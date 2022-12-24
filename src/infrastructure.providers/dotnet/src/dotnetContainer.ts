import { AwilixContainer, asFunction } from 'awilix';

import { CachingOptions, HttpOptions } from 'core.clients';
import { ISuggestionProvider } from 'core.suggestions';

import { createJsonClient, createProcessClient } from 'infrastructure.clients';

import { IDotNetContainerMap } from './definitions/iDotNetContainerMap';
import { DotNetContributions } from './definitions/eDotNetContributions';
import { NugetOptions } from './options/nugetOptions';
import { DotNetCli } from './clients/dotnetCli';
import { NuGetResourceClient } from './clients/nugetResourceClient';
import { NuGetPackageClient } from './clients/nugetPackageClient';
import { DotNetSuggestionProvider } from './dotnetSuggestionProvider';
import { DotNetConfig } from './dotnetConfig';

export function configureContainer(
  container: AwilixContainer<IDotNetContainerMap>
): ISuggestionProvider {

  const containerMap = {

    // options
    nugetOpts: asFunction(
      rootConfig => new NugetOptions(
        rootConfig,
        DotNetContributions.Nuget
      )
    ).singleton(),

    dotnetCachingOpts: asFunction(
      rootConfig => new CachingOptions(
        rootConfig,
        DotNetContributions.Caching,
        'caching'
      )
    ).singleton(),

    dotnetHttpOpts: asFunction(
      rootConfig => new HttpOptions(
        rootConfig,
        DotNetContributions.Http,
        'http'
      )
    ).singleton(),

    // config
    dotnetConfig: asFunction(
      (rootConfig, dotnetCachingOpts, dotnetHttpOpts, nugetOpts) =>
        new DotNetConfig(
          rootConfig,
          dotnetCachingOpts,
          dotnetHttpOpts,
          nugetOpts
        )
    ).singleton(),

    // cli
    dotnetProcess: asFunction(
      (dotnetCachingOpts, logger) =>
        createProcessClient(
          dotnetCachingOpts,
          logger.child({ namespace: 'dotnet process' })
        )
    ).singleton(),

    dotnetCli: asFunction(
      (dotnetConfig, dotnetProcess, logger) =>
        new DotNetCli(
          dotnetConfig,
          dotnetProcess,
          logger.child({ namespace: 'dotnet cli' })
        )
    ).singleton(),

    // clients
    dotnetJsonClient: asFunction(
      (dotnetCachingOpts, dotnetHttpOpts, logger) =>
        createJsonClient(
          {
            caching: dotnetCachingOpts,
            http: dotnetHttpOpts
          },
          logger.child({ namespace: 'dotnet request' })
        )
    ).singleton(),

    nugetClient: asFunction(
      (dotnetConfig, dotnetJsonClient, logger) =>
        new NuGetPackageClient(
          dotnetConfig,
          dotnetJsonClient,
          logger.child({ namespace: 'dotnet client' })
        )
    ).singleton(),

    nugetResClient: asFunction(
      (dotnetJsonClient, logger) =>
        new NuGetResourceClient(
          dotnetJsonClient,
          logger.child({ namespace: 'dotnet resource service' })
        )
    ).singleton(),

    // provider
    dotnetProvider: asFunction(
      (dotnetCli, nugetClient, nugetResClient, logger) =>
        new DotNetSuggestionProvider(
          dotnetCli,
          nugetClient,
          nugetResClient,
          logger.child({ namespace: 'dotnet provider' })
        )
    ).singleton(),
  };

  container.register(containerMap);

  return container.cradle.dotnetProvider;
}