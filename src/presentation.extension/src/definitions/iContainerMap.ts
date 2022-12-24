import { OutputChannel, Disposable } from 'vscode';

import { ILogger, LoggingOptions } from 'core.logging';
import { HttpOptions, CachingOptions } from 'core.clients';
import { ISuggestionProvider } from 'core.suggestions';

import { VsCodeConfig } from 'infrastructure.configuration';
import { ILoggerTransport } from 'infrastructure.logging';

import {
  VersionLensExtension,
  TextEditorEvents,
  IconCommands,
  SuggestionCommands,
  VersionLensProvider
} from 'presentation.extension';

export interface IContainerMap {

  extensionName: string,

  // configuration
  rootConfig: VsCodeConfig,

  // logging options
  loggingOptions: LoggingOptions,

  httpOptions: HttpOptions,

  cachingOptions: CachingOptions,

  // logging
  outputChannel: OutputChannel,

  outputChannelTransport: ILoggerTransport,

  logger: ILogger,

  // extension
  extension: VersionLensExtension,

  // commands
  subscriptions: Array<Disposable>,

  iconCommands: IconCommands,

  suggestionCommands: SuggestionCommands,

  // events
  textEditorEvents: TextEditorEvents,

  // providers
  providerNames: Array<string>,

  suggestionProviders: Array<ISuggestionProvider>,

  versionLensProviders: Array<VersionLensProvider>
}