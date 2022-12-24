import { ILogger } from 'core.logging';
import {
  RequestFactory,
  IPackageDependency,
  PackageResponse
} from 'core.packages';

import {
  NpmSuggestionProvider,
  NpmPackageClient
} from 'infrastructure.providers.npm';

import { extractPackageDependenciesFromJson } from './jspmPackageParser';

export class JspmSuggestionProvider extends NpmSuggestionProvider {

  constructor(client: NpmPackageClient, logger: ILogger) {
    super(client, logger);
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