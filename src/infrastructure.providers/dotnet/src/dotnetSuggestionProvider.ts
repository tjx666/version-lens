import { ILogger } from 'core.logging';
import { UrlHelpers } from 'core.clients';
import {
  ISuggestionProvider,
  defaultReplaceFn,
  TSuggestionReplaceFunction
} from 'core.suggestions';
import {
  RequestFactory,
  IPackageDependency,
  PackageResponse
} from 'core.packages';

import { DotNetCli } from './clients/dotnetCli';
import { NuGetPackageClient } from './clients/nugetPackageClient';
import { NuGetResourceClient } from './clients/nugetResourceClient';
import { NuGetClientData } from './definitions/nuget';
import { DotNetConfig } from './dotnetConfig';
import { createDependenciesFromXml } from './dotnetXmlParserFactory'

export class DotNetSuggestionProvider implements ISuggestionProvider {

  dotnetClient: DotNetCli;

  nugetPackageClient: NuGetPackageClient;

  nugetResClient: NuGetResourceClient;

  config: DotNetConfig;

  logger: ILogger;

  suggestionReplaceFn: TSuggestionReplaceFunction;

  constructor(
    dotnetCli: DotNetCli,
    nugetClient: NuGetPackageClient,
    nugetResClient: NuGetResourceClient,
    logger: ILogger
  ) {
    this.dotnetClient = dotnetCli;
    this.nugetPackageClient = nugetClient;
    this.nugetResClient = nugetResClient;
    this.config = nugetClient.config;
    this.logger = logger;
    this.suggestionReplaceFn = defaultReplaceFn
  }

  parseDependencies(packageText: string): Array<IPackageDependency> {
    const packageDependencies = createDependenciesFromXml(
      packageText,
      this.config.dependencyProperties
    );

    return packageDependencies;
  }

  async fetchSuggestions(
    packagePath: string,
    packageDependencies: Array<IPackageDependency>
  ): Promise<Array<PackageResponse>> {

    // ensure latest nuget sources from settings
    this.config.nuget.defrost();

    // get each service index source from the dotnet cli
    const sources = await this.dotnetClient.fetchSources(packagePath)

    // remote sources only
    const remoteSources = sources.filter(
      s => s.protocol === UrlHelpers.RegistryProtocols.https ||
        s.protocol === UrlHelpers.RegistryProtocols.http
    );

    // resolve each service url
    const promised = remoteSources.map(
      async (remoteSource) => {
        return await this.nugetResClient.fetchResource(remoteSource);
      }
    );

    const serviceUrls = (await Promise.all(promised))
      .filter(url => url.length > 0);

    if (serviceUrls.length === 0) {
      this.logger.error("Could not resolve any nuget service urls")
      return null;
    }

    const clientData: NuGetClientData = { serviceUrls: serviceUrls }

    return RequestFactory.executeDependencyRequests(
      packagePath,
      this.nugetPackageClient,
      clientData,
      packageDependencies,
    );

  }

}