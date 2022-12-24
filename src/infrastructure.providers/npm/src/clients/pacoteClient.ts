import { ILogger } from 'core.logging';
import { SuggestionFactory } from 'core.suggestions';
import {
  DocumentFactory,
  TPackageRequest,
  VersionHelpers,
  TPackageDocument,
  PackageVersionTypes,
  PackageSourceTypes
} from 'core.packages';
import { ClientResponseSource, AbstractCachedRequest } from 'core.clients';

import { NpmConfig } from '../npmConfig';
import { NpaSpec, NpaTypes } from '../models/npaSpec';
import * as NpmUtils from '../npmUtils';

export class PacoteClient extends AbstractCachedRequest<number, TPackageDocument> {

  config: NpmConfig;

  logger: ILogger;

  pacote: any;

  libnpmconfig: any;

  constructor(config: NpmConfig, logger: ILogger) {
    super(config.caching);
    this.config = config;
    this.logger = logger;

    this.pacote = require('pacote');
    this.libnpmconfig = require('libnpmconfig');
  }

  async fetchPackage(
    request: TPackageRequest<null>, npaSpec: NpaSpec
  ): Promise<TPackageDocument> {

    const cacheKey = `${request.package.name}@${request.package.version}_${request.package.path}`;
    if (this.cache.cachingOpts.duration > 0 && this.cache.hasExpired(cacheKey) === false) {
      this.logger.debug("Fetching from cache using key: %s", cacheKey);
      const cachedResp = this.cache.get(cacheKey);
      if (cachedResp.rejected) return Promise.reject(cachedResp);

      cachedResp.data.response.source = ClientResponseSource.cache;
      return Promise.resolve(cachedResp.data);
    }

    // get npm config
    const npmOpts = this.libnpmconfig.read(
      {
        where: request.package.path,
        fullMetadata: false,
        retry: {
          retries: 0
        }
      },
      {
        cwd: request.package.path,
      }
    );

    return this.pacote.packument(npaSpec, npmOpts)
      .then(function (packumentResponse): TPackageDocument {

        const { compareLoose } = require("semver");

        const { providerName } = request;

        const source: PackageSourceTypes = PackageSourceTypes.Registry;

        const type: PackageVersionTypes = <any>npaSpec.type;

        let versionRange: string = (type === PackageVersionTypes.Alias) ?
          npaSpec.subSpec.rawSpec :
          npaSpec.rawSpec;

        const resolved = {
          name: (type === PackageVersionTypes.Alias) ?
            npaSpec.subSpec.name :
            npaSpec.name,
          version: versionRange,
        };

        // extract raw versions and sort
        const rawVersions = Object.keys(packumentResponse.versions || {}).sort(compareLoose);

        // seperate versions to releases and prereleases
        let { releases, prereleases } = VersionHelpers.splitReleasesFromArray(
          rawVersions
        );

        // extract prereleases from dist tags
        const distTags = packumentResponse['dist-tags'] || {};
        const latestTaggedVersion = distTags['latest'];

        // extract releases
        if (latestTaggedVersion) {
          // cap the releases to the latest tagged version
          releases = VersionHelpers.lteFromArray(
            releases,
            latestTaggedVersion
          );
        }

        const response = {
          source: ClientResponseSource.remote,
          status: 200,
        };

        // use 'latest' tagged version from author?
        const suggestLatestVersion = latestTaggedVersion || (
          releases.length > 0 ?
            // suggest latest release?
            releases[releases.length - 1] :
            // no suggestion
            null
        );

        const requested = request.package;
        if (npaSpec.type === NpaTypes.Tag) {

          // get the tagged version. eg latest|next
          versionRange = distTags[requested.version];
          if (!versionRange) {

            // No match
            return DocumentFactory.createNoMatch(
              providerName,
              source,
              type,
              requested,
              response,
              suggestLatestVersion
            );

          }

        }

        // analyse suggestions
        const suggestions = SuggestionFactory.createSuggestions(
          versionRange,
          releases,
          prereleases,
          suggestLatestVersion
        );

        return {
          providerName,
          source,
          response,
          type,
          requested,
          resolved,
          suggestions,
        };

      }).then(document => {
        this.createCachedResponse(
          cacheKey,
          200,
          document,
          false
        );
        return document;
      }).catch(response => {
        this.createCachedResponse(
          cacheKey,
          response.code,
          response.message,
          true
        );
        return Promise.reject(
          NpmUtils.convertNpmErrorToResponse(
            response,
            ClientResponseSource.remote
          )
        );
      });

  }

}