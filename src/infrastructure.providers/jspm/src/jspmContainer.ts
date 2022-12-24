import { AwilixContainer, asFunction } from 'awilix';

import { ISuggestionProvider } from 'core.suggestions';
import { CachingOptions, HttpOptions } from 'core.clients';

import { createJsonClient } from 'infrastructure.clients';
import {
  NpmContributions,
  PacoteClient,
  NpmPackageClient,
  GitHubClient,
  GitHubOptions
} from 'infrastructure.providers.npm';

import { IJspmContainerMap } from './definitions/iJspmContainerMap';
import { JspmConfig } from './jspmConfig';
import { JspmSuggestionProvider } from './jspmSuggestionProvider'

export function configureContainer(
  container: AwilixContainer<IJspmContainerMap>
): ISuggestionProvider {

  const containerMap = {

    // options
    jspmCachingOpts: asFunction(
      rootConfig => new CachingOptions(
        rootConfig,
        NpmContributions.Caching,
        'caching'
      )
    ).singleton(),

    jspmHttpOpts: asFunction(
      rootConfig => new HttpOptions(
        rootConfig,
        NpmContributions.Http,
        'http'
      )
    ).singleton(),

    jspmGitHubOpts: asFunction(
      rootConfig => new GitHubOptions(
        rootConfig,
        NpmContributions.Github,
        'github'
      )
    ).singleton(),

    // config
    jspmConfig: asFunction(
      (rootConfig, jspmCachingOpts, jspmHttpOpts, jspmGitHubOpts) =>
        new JspmConfig(rootConfig, jspmCachingOpts, jspmHttpOpts, jspmGitHubOpts)
    ).singleton(),

    // clients
    githubJsonClient: asFunction(
      (jspmCachingOpts, jspmHttpOpts, logger) =>
        createJsonClient(
          {
            caching: jspmCachingOpts,
            http: jspmHttpOpts
          },
          logger.child({ namespace: 'jspm request' })
        )
    ).singleton(),

    githubClient: asFunction(
      (jspmConfig, githubJsonClient, logger) =>
        new GitHubClient(
          jspmConfig,
          githubJsonClient,
          logger.child({ namespace: 'jspm github' })
        )
    ).singleton(),

    pacoteClient: asFunction(
      (jspmConfig, logger) =>
        new PacoteClient(
          jspmConfig,
          logger.child({ namespace: 'pacote client' })
        )
    ).singleton(),

    jspmClient: asFunction(
      (jspmConfig, githubClient, pacoteClient, logger) =>
        new NpmPackageClient(
          jspmConfig,
          pacoteClient,
          githubClient,
          logger.child({ namespace: 'jspm client' })
        )
    ).singleton(),

    // provider
    jspmProvider: asFunction(
      (jspmClient, logger) =>
        new JspmSuggestionProvider(
          jspmClient,
          logger.child({ namespace: 'jspm provider' })
        )
    ).singleton(),

  };

  container.register(containerMap);

  return container.cradle.jspmProvider;
}