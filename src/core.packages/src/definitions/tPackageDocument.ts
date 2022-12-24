import { TPackageSuggestion } from 'core.suggestions';

import { PackageSourceTypes } from './ePackageSourceTypes';
import { PackageVersionTypes } from './ePackageVersionTypes';
import { TPackageIdentifier } from './tPackageIdentifier';
import { TPackageResponseStatus } from './tPackageResponseStatus';
import { TPackageNameVersion } from './tPackageNameVersion';

export type TPackageDocument = {

  providerName: string;

  source: PackageSourceTypes;

  response?: TPackageResponseStatus;

  type: PackageVersionTypes;

  requested: TPackageIdentifier;

  resolved: TPackageNameVersion;

  suggestions: Array<TPackageSuggestion>;

  gitSpec?: any;

};