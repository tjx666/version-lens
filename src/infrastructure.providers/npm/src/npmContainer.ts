import { AwilixContainer, asFunction } from 'awilix';

import { CachingOptions, HttpOptions } from 'core.clients';
import { ISuggestionProvider } from 'core.suggestions';

import { createJsonClient } from 'infrastructure.clients';

import { NpmContributions } from './definitions/eNpmContributions';
import { INpmContainerMap } from './definitions/iNpmContainerMap';
import { GitHubOptions } from './options/githubOptions';
import { NpmPackageClient } from './clients/npmPackageClient';
import { PacoteClient } from './clients/pacoteClient';
import { GitHubClient } from './clients/githubClient';
import { NpmSuggestionProvider } from './npmSuggestionProvider'
import { NpmConfig } from './npmConfig';

export function configureContainer(
  container: AwilixContainer<INpmContainerMap>
): ISuggestionProvider {

  const containerMap = {

    // options
    npmCachingOpts: asFunction(
      rootConfig => new CachingOptions(
        rootConfig,
        NpmContributions.Caching,
        'caching'
      )
    ).singleton(),

    npmHttpOpts: asFunction(
      rootConfig => new HttpOptions(
        rootConfig,
        NpmContributions.Http,
        'http'
      )
    ).singleton(),

    npmGitHubOpts: asFunction(
      rootConfig => new GitHubOptions(
        rootConfig,
        NpmContributions.Github,
        'github'
      )
    ).singleton(),

    // config
    npmConfig: asFunction(
      (rootConfig, npmCachingOpts, npmHttpOpts, npmGitHubOpts) =>
        new NpmConfig(rootConfig, npmCachingOpts, npmHttpOpts, npmGitHubOpts)
    ).singleton(),

    // clients
    githubJsonClient: asFunction(
      (npmCachingOpts, npmHttpOpts, logger) =>
        createJsonClient(
          {
            caching: npmCachingOpts,
            http: npmHttpOpts
          },
          logger.child({ namespace: 'npm request' })
        )
    ).singleton(),

    githubClient: asFunction(
      (npmConfig, githubJsonClient, logger) =>
        new GitHubClient(
          npmConfig,
          githubJsonClient,
          logger.child({ namespace: 'npm github' })
        )
    ).singleton(),

    pacoteClient: asFunction(
      (npmConfig, logger) =>
        new PacoteClient(
          npmConfig,
          logger.child({ namespace: 'npm pacote' })
        )
    ).singleton(),

    npmClient: asFunction(
      (npmConfig, githubClient, pacoteClient, logger) =>
        new NpmPackageClient(
          npmConfig,
          pacoteClient,
          githubClient,
          logger.child({ namespace: 'npm client' })
        )
    ).singleton(),

    // provider
    npmProvider: asFunction(
      (npmClient, logger) =>
        new NpmSuggestionProvider(
          npmClient,
          logger.child({ namespace: 'npm provider' })
        )
    ).singleton(),

  };

  container.register(containerMap);

  return container.cradle.npmProvider;
}