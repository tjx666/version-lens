import { ILogger } from 'core.logging';
import { SuggestionFactory } from 'core.suggestions';

import {
  TPackageRequest,
  DocumentFactory,
  TPackageDocument,
  PackageSourceTypes,
  VersionHelpers,
  TSemverSpec,
  IPackageClient,
} from 'core.packages';

import {
  HttpClientRequestMethods,
  HttpClientResponse,
  IJsonHttpClient
} from 'core.clients';

import { PubConfig } from './pubConfig';

export class PubClient implements IPackageClient<null> {

  config: PubConfig;

  client: IJsonHttpClient;

  logger: ILogger;

  constructor(config: PubConfig, client: IJsonHttpClient, logger: ILogger) {
    this.config = config;
    this.client = client;
    this.logger = logger;
  }

  async fetchPackage(request: TPackageRequest<null>): Promise<TPackageDocument> {
    const semverSpec = VersionHelpers.parseSemver(request.package.version);
    const url = `${this.config.apiUrl}api/documentation/${request.package.name}`;

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

  async createRemotePackageDocument(
    url: string,
    request: TPackageRequest<null>,
    semverSpec: TSemverSpec
  ): Promise<TPackageDocument> {

    const query = {};
    const headers = {};

    return this.client.request(HttpClientRequestMethods.get, url, query, headers)
      .then(function (httpResponse): TPackageDocument {

        const packageInfo = httpResponse.data;

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

        const rawVersions = VersionHelpers.extractVersionsFromMap(packageInfo.versions);

        // seperate versions to releases and prereleases
        const { releases, prereleases } = VersionHelpers.splitReleasesFromArray(rawVersions)

        // analyse suggestions
        const suggestions = SuggestionFactory.createSuggestions(
          versionRange,
          releases,
          prereleases
        );

        // return PackageDocument
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