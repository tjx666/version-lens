import { IPackageDependency } from './iPackageDependency';
import { TPackageIdentifier } from './tPackageIdentifier';

export type TPackageRequest<TClientData> = {
  // provider descriptor
  providerName: string;

  // provider specific data
  clientData: TClientData,

  // dependency ranges
  dependency: IPackageDependency;

  // package to fetch
  package: TPackageIdentifier;

  // number of fallback attempts
  attempt: number;
};