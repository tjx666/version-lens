import { workspace, window, ExtensionContext } from 'vscode';

import {
  createContainer,
  asValue,
  asFunction,
  InjectionMode,
  AwilixContainer
} from 'awilix';

import { LoggingOptions } from 'core.logging';
import { HttpOptions, CachingOptions } from 'core.clients';

import { VsCodeConfig } from 'infrastructure.configuration';
import { createWinstonLogger, OutputChannelTransport } from 'infrastructure.logging';

import {
  VersionLensExtension,
  registerIconCommands,
  registerSuggestionCommands,
  TextEditorEvents
} from 'presentation.extension';

import { IContainerMap } from './definitions/iContainerMap';
import { registerSuggestionProviders } from './container/registerSuggestionProviders';
import { registerVersionLensProviders } from './container/registerVersionLensProviders';

export async function configureContainer(
  context: ExtensionContext
): Promise<AwilixContainer<IContainerMap>> {

  const container: AwilixContainer<IContainerMap> = createContainer({
    injectionMode: InjectionMode.CLASSIC
  });

  const containerMap = {

    extensionName: asValue(VersionLensExtension.extensionName),

    // maps to the vscode configuration
    rootConfig: asFunction(
      extensionName => new VsCodeConfig(workspace, extensionName.toLowerCase())
    ).singleton(),

    // logging options
    loggingOptions: asFunction(
      rootConfig => new LoggingOptions(rootConfig, 'logging')
    ).singleton(),

    httpOptions: asFunction(
      rootConfig => new HttpOptions(rootConfig, 'http')
    ).singleton(),

    cachingOptions: asFunction(
      rootConfig => new CachingOptions(rootConfig, 'caching')
    ).singleton(),

    // logging
    outputChannel: asFunction(
      extensionName => window.createOutputChannel(extensionName)
    ).singleton(),

    outputChannelTransport: asFunction(
      (outputChannel, loggingOptions) =>
        new OutputChannelTransport(outputChannel, loggingOptions)
    ).singleton(),

    logger: asFunction(
      (outputChannelTransport) =>
        createWinstonLogger(outputChannelTransport, { namespace: 'extension' })
    ).singleton(),

    // extension
    extension: asFunction(
      rootConfig => new VersionLensExtension(rootConfig)
    ).singleton(),

    // commands
    subscriptions: asValue(context.subscriptions),

    iconCommands: asFunction(
      (extension, versionLensProviders, subscriptions, outputChannel, logger) =>
        registerIconCommands(
          extension.state,
          versionLensProviders,
          subscriptions,
          outputChannel,
          logger.child({ namespace: 'icon commands' })
        )
    ).singleton(),

    suggestionCommands: asFunction(
      (extension, subscriptions, logger) =>
        registerSuggestionCommands(
          extension.state,
          subscriptions,
          logger.child({ namespace: 'suggestion commands' })
        )
    ).singleton(),

    // events
    textEditorEvents: asFunction(
      (extension, suggestionProviders, outputChannelTransport) =>
        new TextEditorEvents(
          extension.state,
          suggestionProviders,
          outputChannelTransport
        )
    ).singleton(),

    // codelens providers
    providerNames: asValue([
      'composer',
      'dotnet',
      'dub',
      'jspm',
      'maven',
      'npm',
      'pub',
    ]),

    versionLensProviders: asFunction(
      (extension, suggestionProviders, subscriptions, logger) =>
        registerVersionLensProviders(
          extension,
          suggestionProviders,
          subscriptions,
          logger
        )
    )

  };

  // register the map
  container.register(containerMap);

  // generate the provider registry async
  const { logger, providerNames } = container.cradle;
  const suggestionProviders = await registerSuggestionProviders(
    providerNames,
    container,
    logger.child({ namespace: 'registry' })
  )

  // add the registry in to the container
  container.register({
    suggestionProviders: asValue(suggestionProviders)
  });

  return container;
}