import { IConfig } from "core.configuration";

export interface IVsCodeWorkspace {
  getConfiguration: (section) => IConfig
}