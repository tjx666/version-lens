import { AwilixContainer, asFunction } from 'awilix';

import { CachingOptions, HttpOptions } from 'core.clients';
import { ISuggestionProvider } from 'core.suggestions';

import { createJsonClient } from 'infrastructure.clients';

import { DubContributions } from './definitions/eDubContributions';
import { IDubContainerMap } from './definitions/iDubContainerMap';
import { DubSuggestionProvider } from './dubSuggestionProvider'
import { DubConfig } from './dubConfig';
import { DubClient } from './dubClient';

export function configureContainer(
  container: AwilixContainer<IDubContainerMap>
): ISuggestionProvider {

  const containerMap = {

    // options
    dubCachingOpts: asFunction(
      rootConfig => new CachingOptions(
        rootConfig,
        DubContributions.Caching,
        'caching'
      )
    ).singleton(),

    dubHttpOpts: asFunction(
      rootConfig => new HttpOptions(
        rootConfig,
        DubContributions.Http,
        'http'
      )
    ).singleton(),

    // config
    dubConfig: asFunction(
      (rootConfig, dubCachingOpts, dubHttpOpts) =>
        new DubConfig(rootConfig, dubCachingOpts, dubHttpOpts)
    ).singleton(),

    // clients
    dubJsonClient: asFunction(
      (dubCachingOpts, dubHttpOpts, logger) =>
        createJsonClient(
          {
            caching: dubCachingOpts,
            http: dubHttpOpts
          },
          logger.child({ namespace: 'dub request' })
        )
    ).singleton(),

    dubClient: asFunction(
      (dubConfig, dubJsonClient, logger) =>
        new DubClient(
          dubConfig,
          dubJsonClient,
          logger.child({ namespace: 'dub client' })
        )
    ).singleton(),

    // provider
    dubProvider: asFunction(
      (dubClient, logger) =>
        new DubSuggestionProvider(
          dubClient,
          logger.child({ namespace: 'dub provider' })
        )
    ).singleton(),
  };

  container.register(containerMap)

  return container.cradle.dubProvider;
}