import { ILogger } from 'core.logging';
import { SuggestionFactory, TPackageSuggestion } from 'core.suggestions';
import { ClientResponseSource } from 'core.clients';
import {
  DocumentFactory,
  ResponseFactory,
  IPackageClient,
  TPackageRequest,
  TPackageDocument,
  PackageVersionTypes,
  PackageSourceTypes
} from 'core.packages';

import * as PackageFactory from '../factories/packageFactory';
import { NpaSpec, NpaTypes } from '../models/npaSpec';
import * as NpmUtils from '../npmUtils';
import { NpmConfig } from '../npmConfig';
import { PacoteClient } from './pacoteClient';
import { GitHubClient } from './githubClient';

export class NpmPackageClient implements IPackageClient<null> {

  logger: ILogger;

  config: NpmConfig;

  pacoteClient: PacoteClient;

  githubClient: GitHubClient;

  constructor(
    config: NpmConfig,
    pacoteClient: PacoteClient,
    githubClient: GitHubClient,
    logger: ILogger
  ) {
    this.config = config;

    this.pacoteClient = pacoteClient;
    this.githubClient = githubClient;
    this.logger = logger;
  }

  async fetchPackage(request: TPackageRequest<null>): Promise<TPackageDocument> {
    const npa = require('npm-package-arg');
    let source: PackageSourceTypes;

    return new Promise<TPackageDocument>((resolve, reject) => {
      let npaSpec: NpaSpec;

      // try parse the package
      try {
        npaSpec = npa.resolve(
          request.package.name,
          request.package.version,
          request.package.path
        );
      }
      catch (error) {
        return reject(NpmUtils.convertNpmErrorToResponse(error, ClientResponseSource.local));
      }

      // return if directory or file document
      if (npaSpec.type === NpaTypes.Directory || npaSpec.type === NpaTypes.File) {
        source = PackageSourceTypes.Directory;
        return resolve(
          PackageFactory.createDirectory(
            request.providerName,
            request.package,
            ResponseFactory.createResponseStatus(ClientResponseSource.local, 200),
            npaSpec,
          )
        );
      }

      if (npaSpec.type === NpaTypes.Git) {

        source = PackageSourceTypes.Git;

        if (!npaSpec.hosted) {
          // could not resolve
          return reject({
            status: 'EUNSUPPORTEDPROTOCOL',
            data: 'Git url could not be resolved',
            source: ClientResponseSource.local
          });
        }

        if (!npaSpec.gitCommittish && npaSpec.hosted.default !== 'shortcut') {
          return resolve(
            DocumentFactory.createFixed(
              request.providerName,
              PackageSourceTypes.Git,
              request.package,
              ResponseFactory.createResponseStatus(ClientResponseSource.local, 0),
              PackageVersionTypes.Committish,
              'git repository'
            )
          );
        }

        // resolve tags, committishes
        source = PackageSourceTypes.Github;
        return resolve(this.githubClient.fetchGithub(request, npaSpec));
      }

      // otherwise return registry result
      source = PackageSourceTypes.Registry;
      return resolve(this.pacoteClient.fetchPackage(request, npaSpec));

    }).catch(response => {

      this.logger.debug("Caught exception from %s: %O", source, response);

      if (!response.data) {
        response = NpmUtils.convertNpmErrorToResponse(
          response,
          ClientResponseSource.remote
        );
      }

      const status = response.status &&
        !Number.isInteger(response.status) &&
        response.status.startsWith('E') ?
        response.status.substr(1) :
        response.status;

      let suggestions: Array<TPackageSuggestion>;

      if (status == 'CONNREFUSED')
        suggestions = [SuggestionFactory.createConnectionRefused()];
      else if (status == 'UNSUPPORTEDPROTOCOL' || response.data == 'Not implemented yet')
        suggestions = [SuggestionFactory.createNotSupported()];
      else if (status == 'INVALIDTAGNAME' || response.data.includes('Invalid comparator:'))
        suggestions = [
          SuggestionFactory.createInvalid(''),
          SuggestionFactory.createLatest()
        ];
      else if (status == 128)
        suggestions = [SuggestionFactory.createNotFound()]
      else
        suggestions = [SuggestionFactory.createFromHttpStatus(status)];

      if (suggestions === null) return Promise.reject(response);

      return DocumentFactory.create(
        source,
        request,
        ResponseFactory.createResponseStatus(response.source, response.status),
        suggestions
      );

    });

  }

}
