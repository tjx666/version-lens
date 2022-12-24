import { TPackageDependencyRange } from "./tPackageDependencyRange";
import { TPackageNameVersion } from "./tPackageNameVersion";

export interface IPackageDependency {

  nameRange: TPackageDependencyRange;

  versionRange: TPackageDependencyRange;

  packageInfo: TPackageNameVersion;

};