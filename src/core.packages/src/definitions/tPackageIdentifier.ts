import { TPackageNameVersion } from './tPackageNameVersion';

export type TPackageIdentifier = TPackageNameVersion & {

  path: string;

};