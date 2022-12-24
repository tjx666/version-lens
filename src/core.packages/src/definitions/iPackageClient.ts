import { ILogger } from 'core.logging';
import { IProviderConfig } from 'core.providers';

import { TPackageRequest } from "./tPackageRequest";
import { TPackageDocument } from "./tPackageDocument";

export interface IPackageClient<TClientData> {

  logger: ILogger;

  config: IProviderConfig,

  fetchPackage: (request: TPackageRequest<TClientData>)
    => Promise<TPackageDocument>;

}