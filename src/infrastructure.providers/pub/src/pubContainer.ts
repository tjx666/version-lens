import { AwilixContainer, asFunction } from 'awilix';

import { CachingOptions, HttpOptions } from 'core.clients';
import { ISuggestionProvider } from 'core.suggestions';

import { createJsonClient } from 'infrastructure.clients';

import { PubContributions } from './definitions/ePubContributions';
import { IPubContainerMap } from './definitions/iPubContainerMap';
import { PubSuggestionProvider } from './pubSuggestionProvider'
import { PubConfig } from './pubConfig';
import { PubClient } from './pubClient';

export function configureContainer(
  container: AwilixContainer<IPubContainerMap>
): ISuggestionProvider {

  const containerMap = {

    // options
    pubCachingOpts: asFunction(
      rootConfig => new CachingOptions(
        rootConfig,
        PubContributions.Caching,
        'caching'
      )
    ).singleton(),

    pubHttpOpts: asFunction(
      rootConfig => new HttpOptions(
        rootConfig,
        PubContributions.Http,
        'http'
      )
    ).singleton(),

    // config
    pubConfig: asFunction(
      (rootConfig, pubCachingOpts, pubHttpOpts) =>
        new PubConfig(rootConfig, pubCachingOpts, pubHttpOpts)
    ).singleton(),

    // clients
    pubJsonClient: asFunction(
      (pubCachingOpts, pubHttpOpts, logger) =>
        createJsonClient(
          {
            caching: pubCachingOpts,
            http: pubHttpOpts
          },
          logger.child({ namespace: 'pub request' })
        )
    ).singleton(),

    pubClient: asFunction(
      (pubConfig, pubJsonClient, logger) =>
        new PubClient(
          pubConfig,
          pubJsonClient,
          logger.child({ namespace: 'pub client' })
        )
    ).singleton(),

    // provider
    pubProvider: asFunction(
      (pubClient, logger) =>
        new PubSuggestionProvider(
          pubClient,
          logger.child({ namespace: 'pub provider' })
        )
    ).singleton(),
  };

  container.register(containerMap)

  return container.cradle.pubProvider;
}