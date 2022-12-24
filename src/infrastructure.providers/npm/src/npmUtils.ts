import {
  VersionHelpers,
  PackageSourceTypes,
  PackageResponse,
  PackageVersionTypes,
} from 'core.packages';
import { ClientResponseSource, ClientResponse } from 'core.clients';

export function npmReplaceVersion(packageInfo: PackageResponse, newVersion: string): string {
  if (packageInfo.source === PackageSourceTypes.Github) {
    return replaceGitVersion(packageInfo, newVersion);
  }

  if (packageInfo.type === PackageVersionTypes.Alias) {
    return replaceAliasVersion(packageInfo, newVersion);
  }

  // fallback to default
  return VersionHelpers.formatWithExistingLeading(
    packageInfo.requested.version,
    newVersion
  );
}

function replaceGitVersion(packageInfo: PackageResponse, newVersion: string): string {
  return packageInfo.requested.version.replace(
    packageInfo.resolved.version,
    newVersion
  )
}

function replaceAliasVersion(packageInfo: PackageResponse, newVersion: string): string {
  // preserve the leading symbol from the existing version
  const preservedLeadingVersion = VersionHelpers.formatWithExistingLeading(
    packageInfo.requested.version,
    newVersion
  );

  return `npm:${packageInfo.resolved.name}@${preservedLeadingVersion}`;
}

export function convertNpmErrorToResponse(error, source: ClientResponseSource): ClientResponse<number, string> {
  return {
    source,
    status: error.code,
    data: error.message,
  }
}