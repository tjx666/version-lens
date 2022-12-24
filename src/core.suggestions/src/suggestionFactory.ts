import {
  SuggestionFactory,
  TPackageSuggestion,
  SuggestionStatus,
  SuggestionFlags
} from "core.suggestions";

import { VersionHelpers } from "core.packages";

export function createSuggestions(
  versionRange: string,
  releases: string[],
  prereleases: string[],
  suggestedLatestVersion: string = null
): Array<TPackageSuggestion> {
  const { maxSatisfying, compareLoose } = require("semver");
  const suggestions: Array<TPackageSuggestion> = [];

  // check for a release
  let satisfiesVersion = maxSatisfying(
    releases,
    versionRange,
    VersionHelpers.loosePrereleases
  );
  if (!satisfiesVersion && versionRange.indexOf('-') > -1) {
    // lookup prereleases
    satisfiesVersion = maxSatisfying(
      prereleases,
      versionRange,
      VersionHelpers.loosePrereleases
    );
  }

  // get the latest release
  const latestVersion = suggestedLatestVersion || releases[releases.length - 1];
  const isLatest = latestVersion === satisfiesVersion;

  const noSuggestionNeeded = versionRange.includes(satisfiesVersion) ||
    versionRange.includes(suggestedLatestVersion);

  if (releases.length === 0 && prereleases.length === 0)
    // no match
    suggestions.push(createNoMatch())
  else if (!satisfiesVersion)
    // no match
    suggestions.push(
      createNoMatch(),
      // suggest latestVersion
      createLatest(latestVersion),
    )
  else if (isLatest && noSuggestionNeeded)
    // latest
    suggestions.push(createMatchesLatest(versionRange));
  else if (isLatest)
    suggestions.push(
      // satisfies latest
      createSatisifiesLatest(),
      // suggest latestVersion
      createLatest(latestVersion),
    );
  else if (satisfiesVersion && VersionHelpers.isFixedVersion(versionRange))
    suggestions.push(
      // fixed
      createFixedStatus(versionRange),
      // suggest latestVersion
      createLatest(latestVersion),
    );
  else if (satisfiesVersion)
    suggestions.push(
      // satisfies >x.y.z <x.y.z
      createSuggestion(
        SuggestionStatus.Satisfies,
        satisfiesVersion,
        noSuggestionNeeded ?
          SuggestionFlags.status :
          SuggestionFlags.release
      ),
      // suggest latestVersion
      createLatest(latestVersion),
    );

  // roll up prereleases
  const maxSatisfyingPrereleases = VersionHelpers.filterPrereleasesGtMinRange(
    versionRange,
    prereleases
  ).sort(compareLoose);

  // group prereleases (latest first)
  const taggedVersions = VersionHelpers.extractTaggedVersions(maxSatisfyingPrereleases);
  for (let index = taggedVersions.length - 1; index > -1; index--) {
    const pvn = taggedVersions[index];
    if (pvn.name === 'latest') break;
    if (pvn.version === satisfiesVersion) break;
    if (pvn.version === latestVersion) break;
    if (versionRange.includes(pvn.version)) break;

    suggestions.push({
      name: pvn.name,
      version: pvn.version,
      flags: SuggestionFlags.prerelease
    });
  }

  return suggestions;
}

export function createFromHttpStatus(status: number | string): TPackageSuggestion {

  if (status == 400)
    return SuggestionFactory.createBadRequest();
  else if (status == 401)
    return SuggestionFactory.createNotAuthorized();
  else if (status == 403)
    return SuggestionFactory.createForbidden();
  else if (status == 404)
    return SuggestionFactory.createNotFound();
  else if (status == 500)
    return SuggestionFactory.createInternalServerError();

  return null;
}

export function createNotFound(): TPackageSuggestion {
  return {
    name: SuggestionStatus.NotFound,
    version: '',
    flags: SuggestionFlags.status
  };
}

export function createInternalServerError(): TPackageSuggestion {
  return {
    name: SuggestionStatus.InternalServerError,
    version: '',
    flags: SuggestionFlags.status
  };
}

export function createConnectionRefused(): TPackageSuggestion {
  return {
    name: SuggestionStatus.ConnectionRefused,
    version: '',
    flags: SuggestionFlags.status
  };
}

export function createForbidden(): TPackageSuggestion {
  return {
    name: SuggestionStatus.Forbidden,
    version: '',
    flags: SuggestionFlags.status
  };
}

export function createNotAuthorized(): TPackageSuggestion {
  return {
    name: SuggestionStatus.NotAuthorized,
    version: '',
    flags: SuggestionFlags.status
  };
}

export function createBadRequest(): TPackageSuggestion {
  return {
    name: SuggestionStatus.BadRequest,
    version: '',
    flags: SuggestionFlags.status
  };
}

export function createInvalid(requestedVersion: string): TPackageSuggestion {
  return {
    name: SuggestionStatus.Invalid,
    version: requestedVersion,
    flags: SuggestionFlags.status
  };
}

export function createNotSupported(): TPackageSuggestion {
  return {
    name: SuggestionStatus.NotSupported,
    version: '',
    flags: SuggestionFlags.status
  };
}

export function createNoMatch(): TPackageSuggestion {
  return {
    name: SuggestionStatus.NoMatch,
    version: '',
    flags: SuggestionFlags.status
  };
}

export function createLatest(requestedVersion?: string): TPackageSuggestion {
  const isPrerelease = requestedVersion && requestedVersion.indexOf('-') !== -1;

  const name = isPrerelease ?
    SuggestionStatus.LatestIsPrerelease :
    SuggestionStatus.Latest;

  // treats requestedVersion as latest version
  // if no requestedVersion then uses the 'latest' tag instead
  return {
    name,
    version: requestedVersion || 'latest',
    flags:
      isPrerelease ?
        SuggestionFlags.prerelease :
        requestedVersion ?
          SuggestionFlags.release :
          SuggestionFlags.tag
  };
}

export function createMatchesLatest(latestVersion: string): TPackageSuggestion {
  const isPrerelease = latestVersion && latestVersion.indexOf('-') !== -1;

  const name = isPrerelease ?
    SuggestionStatus.LatestIsPrerelease :
    SuggestionStatus.Latest;

  return {
    name,
    version: isPrerelease ? latestVersion : '',
    flags: SuggestionFlags.status
  };


}

export function createSatisifiesLatest(): TPackageSuggestion {
  return createSuggestion(
    SuggestionStatus.Satisfies,
    'latest',
    SuggestionFlags.status
  )
}

export function createFixedStatus(version: string): TPackageSuggestion {
  return createSuggestion(
    SuggestionStatus.Fixed,
    version,
    SuggestionFlags.status
  );
}

export function createSuggestion(
  name: string, version: string, flags: SuggestionFlags
): TPackageSuggestion {
  return { name, version, flags };
}