import { TPackageSuggestion } from 'core.suggestions';

import { PackageSourceTypes } from '../definitions/ePackageSourceTypes';
import { PackageVersionTypes } from '../definitions/ePackageVersionTypes';
import { PackageResponseErrors } from '../definitions/ePackageResponseErrors';
import { TPackageNameVersion } from '../definitions/tPackageNameVersion';
import { TPackageIdentifier } from '../definitions/tPackageIdentifier';
import { TPackageResponseStatus } from '../definitions/tPackageResponseStatus';
import { TPackageDependencyRange } from '../definitions/tPackageDependencyRange';

export class PackageResponse {
  providerName: string;
  requested: TPackageIdentifier;

  nameRange: TPackageDependencyRange;
  versionRange: TPackageDependencyRange;
  order: number;

  error?: PackageResponseErrors;
  errorMessage?: string;
  source?: PackageSourceTypes;
  response?: TPackageResponseStatus;
  type?: PackageVersionTypes;
  resolved?: TPackageNameVersion;
  suggestion?: TPackageSuggestion;
}