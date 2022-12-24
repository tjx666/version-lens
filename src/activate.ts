import { ExtensionContext, window } from 'vscode';
import { configureContainer } from 'presentation.extension';

export async function activate(context: ExtensionContext) {

  configureContainer(context)
    .then(container => {

      const { version } = require('../package.json');

      const {
        logger,
        loggingOptions,
        textEditorEvents,
      } = container.cradle;

      // log general start up info
      logger.info('version: %s', version);
      logger.info('log level: %s', loggingOptions.level);
      logger.info('log path: %s', context.logPath);

      // resolve commands
      container.resolve('iconCommands');
      container.resolve('suggestionCommands');

      // ensure icons are shown if editor is already active
      textEditorEvents.onDidChangeActiveTextEditor(window.activeTextEditor);
    });

}