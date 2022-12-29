import { basename } from 'path';
import * as  minimatch from 'minimatch';

import { PackageResponse, VersionHelpers } from 'core.packages';

import { ISuggestionProvider } from './definitions/iSuggestionProvider';

export function defaultReplaceFn(packageResponse: PackageResponse, newVersion: string): string {
  return VersionHelpers.formatWithExistingLeading(
    packageResponse.requested.version,
    newVersion
  );
}

export function filtersProvidersByFileName(
  fileName: string,
  providers: Array<ISuggestionProvider>
): Array<ISuggestionProvider> {

  const filename = basename(fileName);

  const filtered = providers.filter(
    provider => {
      const { pattern } = provider.config.fileMatcher;
      return typeof pattern === 'function' ? pattern(fileName) : minimatch(filename, pattern)
    }
  );

  if (filtered.length === 0) return [];

  return filtered;
}