import { OutputChannel } from 'vscode';

import { ILoggingOptions } from 'core.logging';

import { ILoggerTransport } from './iLoggerTransport';

const { Transport } = require('winston');

const MESSAGE = Symbol.for('message');

export class OutputChannelTransport extends Transport implements ILoggerTransport {

  constructor(outputChannel: OutputChannel, logging: ILoggingOptions) {
    super({ level: logging.level });
    this.outputChannel = outputChannel;
    this.logging = logging;
  }

  outputChannel: OutputChannel;

  logging: ILoggingOptions;

  get name() {
    return this.outputChannel.name;
  }

  log(entry, callback) {

    setImmediate(() => {
      this.emit('logged', entry)
      this.outputChannel.appendLine(`${entry[MESSAGE]}`);
    });

    callback();
  }

  updateLevel() {
    this.logging.defrost();
    super.level = this.logging.level;
  }

}