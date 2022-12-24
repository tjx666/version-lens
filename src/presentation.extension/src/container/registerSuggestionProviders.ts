import { AwilixContainer } from 'awilix';

import { ILogger } from 'core.logging';
import { ISuggestionProvider } from 'core.suggestions';
import { IProviderModule } from 'core.providers';

import { IContainerMap } from 'presentation.extension';

export async function registerSuggestionProviders(
  providerNames: Array<string>,
  container: AwilixContainer<IContainerMap>,
  logger: ILogger
): Promise<Array<ISuggestionProvider>> {

  logger.debug('Registering providers %o', providerNames.join(', '));

  const results = [];

  const promised = providerNames.map(
    function (providerName: string) {
      return import(`infrastructure.providers/${providerName}/index`)
        .then(
          function (module: IProviderModule) {

            logger.debug('Activating container scope for %s', providerName);

            // create a container scope for the provider
            const scopeContainer = container.createScope();
            const provider = module.configureContainer(scopeContainer);

            // register the provider
            logger.debug(
              "Registered provider for %s:\t file pattern: %s\t caching: %s minutes\t strict ssl: %s",
              providerName,
              provider.config.fileMatcher.pattern,
              provider.config.caching.duration,
              provider.config.http.strictSSL,
            );

            results.push(provider);
          }
        )
        .catch(error => {
          logger.error(
            'Could not register provider %s. Reason: %O',
            providerName,
            error,
          );
        });
    }
  );

  await Promise.all(promised);

  return results;
}