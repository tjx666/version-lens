import { PackageVersionTypes } from "./ePackageVersionTypes";

export type TSemverSpec = {

  rawVersion: string,

  type: PackageVersionTypes,

};