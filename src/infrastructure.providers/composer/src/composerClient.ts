import { ILogger } from 'core.logging';
import { SuggestionFactory } from 'core.suggestions';
import {
  DocumentFactory,
  VersionHelpers,
  TPackageRequest,
  TPackageDocument,
  PackageSourceTypes,
  TSemverSpec,
  IPackageClient
} from 'core.packages';
import {
  HttpClientRequestMethods,
  HttpClientResponse,
  JsonClientResponse,
  IJsonHttpClient,
} from 'core.clients';

import { ComposerConfig } from './composerConfig';

export class ComposerClient implements IPackageClient<null> {

  config: ComposerConfig;

  client: IJsonHttpClient;

  logger: ILogger;

  constructor(
    config: ComposerConfig,
    client: IJsonHttpClient,
    logger: ILogger
  ) {
    this.config = config;
    this.client = client;
    this.logger = logger;
  }

  async fetchPackage<TClientData>(
    request: TPackageRequest<TClientData>
  ): Promise<TPackageDocument> {
    const semverSpec = VersionHelpers.parseSemver(request.package.version);
    const url = `${this.config.apiUrl}${request.package.name}.json`;

    return this.createRemotePackageDocument(url, request, semverSpec)
      .catch((error: HttpClientResponse) => {

        this.logger.debug(
          "Caught exception from %s: %O",
          PackageSourceTypes.Registry,
          error
        );

        const suggestion = SuggestionFactory.createFromHttpStatus(error.status);
        if (suggestion != null) {
          return DocumentFactory.create(
            PackageSourceTypes.Registry,
            request,
            error,
            [suggestion]
          )
        }

        return Promise.reject(error);
      });
  }

  async createRemotePackageDocument<TClientData>(
    url: string,
    request: TPackageRequest<TClientData>,
    semverSpec: TSemverSpec
  ): Promise<TPackageDocument> {

    const query = {};
    const headers = {};

    return this.client.request(HttpClientRequestMethods.get, url, query, headers)
      .then(function (httpResponse: JsonClientResponse): TPackageDocument {
        const packageInfo = httpResponse.data.packages[request.package.name];

        const { providerName } = request;

        const versionRange = semverSpec.rawVersion;

        const requested = request.package;

        const resolved = {
          name: requested.name,
          version: versionRange,
        };

        const response = {
          source: httpResponse.source,
          status: httpResponse.status,
        };

        const rawVersions = Object.keys(packageInfo);

        // extract semver versions only
        const semverVersions = VersionHelpers.filterSemverVersions(rawVersions);

        // seperate versions to releases and prereleases
        const { releases, prereleases } = VersionHelpers.splitReleasesFromArray(
          VersionHelpers.filterSemverVersions(semverVersions)
        );

        // analyse suggestions
        const suggestions = SuggestionFactory.createSuggestions(
          versionRange,
          releases,
          prereleases
        );

        return {
          providerName,
          source: PackageSourceTypes.Registry,
          response,
          type: semverSpec.type,
          requested,
          resolved,
          suggestions,
        };
      });
  }

}

export function readComposerSelections(filePath) {

  return new Promise(function (resolve, reject) {
    const fs = require('fs');

    if (fs.existsSync(filePath) === false) {
      reject(null);
      return;
    }

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err)
        return;
      }

      const selectionsJson = JSON.parse(data.toString());

      resolve(selectionsJson);
    });

  });

}

