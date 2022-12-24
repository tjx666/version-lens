import { commands } from 'vscode';

export class ContextState<T> {

  private key: string;
  private _value: T;

  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.change(defaultValue);
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this.change(newValue);
  }

  change(newValue: T): Thenable<T> {
    this._value = newValue;
    return commands.executeCommand(
      'setContext',
      this.key,
      newValue
    );
  }

}