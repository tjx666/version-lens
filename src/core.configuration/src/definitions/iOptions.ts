import { IConfig } from "./iConfig";

export interface IFrozenOptions extends IConfig {

  defrost(): void;

}

export interface IOptions extends IFrozenOptions { }

export interface IOptionsWithDefaults extends IOptions {

  getOrDefault<T>(key: string, defaultValue: T): T;

}