import { ILogger } from 'core.logging';
import { UrlHelpers } from 'core.clients';
import { ISuggestionProvider, TSuggestionReplaceFunction } from 'core.suggestions';
import {
  RequestFactory,
  PackageResponse,
  IPackageDependency
} from 'core.packages';

import { MavenClientData } from './definitions/mavenClientData';
import { MvnCli } from './clients/mvnCli';
import { MavenClient } from './clients/mavenClient';
import * as MavenXmlFactory from './mavenXmlParserFactory';
import { MavenConfig } from './mavenConfig';

export class MavenSuggestionProvider implements ISuggestionProvider {

  mvnCli: MvnCli;

  config: MavenConfig;

  client: MavenClient;

  logger: ILogger;

  suggestionReplaceFn: TSuggestionReplaceFunction;

  constructor(mnvCli: MvnCli, client: MavenClient, logger: ILogger) {
    this.mvnCli = mnvCli;
    this.client = client;
    this.config = client.config;
    this.logger = logger;
  }

  parseDependencies(packageText: string): Array<IPackageDependency> {
    const packageDependencies = MavenXmlFactory.createDependenciesFromXml(
      packageText,
      this.config.dependencyProperties
    );

    return packageDependencies;
  }

  async fetchSuggestions(
    packagePath: string,
    packageDependencies: Array<IPackageDependency>
  ): Promise<Array<PackageResponse>> {

    // gets source feeds from the project path
    const promisedRepos = this.mvnCli.fetchRepositories(packagePath);

    return promisedRepos.then(repos => {

      const repositories = repos.filter(
        repo => repo.protocol === UrlHelpers.RegistryProtocols.https
      );

      const clientData: MavenClientData = { repositories }

      return RequestFactory.executeDependencyRequests(
        packagePath,
        this.client,
        clientData,
        packageDependencies
      );
    })

  }

}