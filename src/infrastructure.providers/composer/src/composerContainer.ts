import { AwilixContainer, asFunction } from 'awilix';

import { CachingOptions, HttpOptions } from 'core.clients';
import { ISuggestionProvider } from 'core.suggestions';

import { createJsonClient } from 'infrastructure.clients';

import { ComposerContributions } from './definitions/eComposerContributions';
import { IComposerContainerMap } from './definitions/iComposerContainerMap';
import { ComposerSuggestionProvider } from './composerSuggestionProvider'
import { ComposerConfig } from './composerConfig';
import { ComposerClient } from './composerClient';

export function configureContainer(
  container: AwilixContainer<IComposerContainerMap>
): ISuggestionProvider {

  const containerMap = {

    // options
    composerCachingOpts: asFunction(
      rootConfig => new CachingOptions(
        rootConfig,
        ComposerContributions.Caching,
        'caching'
      )
    ).singleton(),

    composerHttpOpts: asFunction(
      rootConfig => new HttpOptions(
        rootConfig,
        ComposerContributions.Http,
        'http'
      )
    ).singleton(),

    // config
    composerConfig: asFunction(
      (rootConfig, composerCachingOpts, composerHttpOpts) =>
        new ComposerConfig(rootConfig, composerCachingOpts, composerHttpOpts)
    ).singleton(),

    // clients
    composerJsonClient: asFunction(
      (composerCachingOpts, composerHttpOpts, logger) =>
        createJsonClient(
          {
            caching: composerCachingOpts,
            http: composerHttpOpts
          },
          logger.child({ namespace: 'composer request' })
        )
    ).singleton(),

    composerClient: asFunction(
      (composerConfig, composerJsonClient, logger) =>
        new ComposerClient(
          composerConfig,
          composerJsonClient,
          logger.child({ namespace: 'composer client' })
        )
    ).singleton(),

    // provider
    composerProvider: asFunction(
      (composerClient, logger) =>
        new ComposerSuggestionProvider(
          composerClient,
          logger.child({ namespace: 'composer provider' })
        )
    ).singleton(),
  };

  container.register(containerMap)

  return container.cradle.composerProvider;
}