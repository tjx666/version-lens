import { ILogger } from 'core.logging';
import {
  ISuggestionProvider,
  defaultReplaceFn,
  TSuggestionReplaceFunction
} from 'core.suggestions';
import {
  extractPackageDependenciesFromJson,
  RequestFactory,
  IPackageDependency,
  PackageResponse
} from 'core.packages';

import { DubConfig } from './dubConfig';
import { DubClient } from './dubClient';

export class DubSuggestionProvider implements ISuggestionProvider {

  config: DubConfig;

  client: DubClient;

  logger: ILogger;

  suggestionReplaceFn: TSuggestionReplaceFunction;

  constructor(client: DubClient, logger: ILogger) {
    this.client = client;
    this.config = client.config;
    this.logger = logger;
    this.suggestionReplaceFn = defaultReplaceFn
  }

  parseDependencies(packageText: string): Array<IPackageDependency> {
    const packageDependencies = extractPackageDependenciesFromJson(
      packageText,
      this.config.dependencyProperties
    );

    return packageDependencies;
  }

  async fetchSuggestions(
    packagePath: string,
    packageDependencies: Array<IPackageDependency>
  ): Promise<Array<PackageResponse>> {
    const clientData = null;

    return RequestFactory.executeDependencyRequests(
      packagePath,
      this.client,
      clientData,
      packageDependencies,
    );
  }

}