import { KeyStringArrayDictionary } from 'core.generics';

import { TSemverSpec } from "../definitions/tSemverSpec";
import { TPackageNameVersion } from "../definitions/tPackageNameVersion";
import { PackageVersionTypes } from "../definitions/ePackageVersionTypes";

export const formatTagNameRegex = /^[^0-9\-]*/;
export const loosePrereleases = { loose: true, includePrerelease: true };

export function filterPrereleasesFromDistTags(distTags: { [key: string]: string }): Array<string> {
  const { prerelease } = require("semver");
  const prereleases: Array<string> = [];
  Object.keys(distTags)
    .forEach((key: string) => {
      if (prerelease(distTags[key])) prereleases.push(distTags[key]);
    });

  return prereleases;
}

export function extractVersionsFromMap(versions: Array<TPackageNameVersion>): Array<string> {
  return versions.map(function (pnv: TPackageNameVersion) {
    return pnv.version;
  });
}

export function extractTaggedVersions(versions: Array<string>): Array<TPackageNameVersion> {
  const { prerelease } = require('semver');

  const results: Array<TPackageNameVersion> = [];
  versions.forEach(function (version) {
    const prereleaseComponents = prerelease(version);
    const isPrerelease = !!prereleaseComponents && prereleaseComponents.length > 0;
    if (isPrerelease) {
      const regexResult = formatTagNameRegex.exec(prereleaseComponents[0]);

      let name = regexResult[0].toLowerCase();

      // capture cases like x.x.x-x.x.x
      if (!name) name = prereleaseComponents.join('.');

      results.push({
        name,
        version
      })
    }
  });

  return results;
}

export function splitReleasesFromArray(versions: Array<string>): { releases: Array<string>, prereleases: Array<string> } {
  const { prerelease } = require('semver');
  const releases: Array<string> = [];
  const prereleases: Array<string> = [];

  versions.forEach(function (version: string) {
    if (prerelease(version))
      prereleases.push(version);
    else
      releases.push(version);
  });

  return { releases, prereleases };
}

export function lteFromArray(versions: Array<string>, version: string) {
  const { lte } = require('semver');
  return versions.filter(
    function (testVersion: string) {
      return lte(testVersion, version);
    }
  );
}

export function removeFourSegmentVersionsFromArray(versions: Array<string>): Array<string> {
  return versions.filter(function (version: string) {
    return isFourSegmentedVersion(version) === false;
  });
}

export function isFixedVersion(versionToCheck: string): boolean {
  const { Range, valid } = require('semver');
  const testRange = new Range(versionToCheck, loosePrereleases);
  return valid(versionToCheck) !== null && testRange.set[0][0].operator === "";
}

const isfourSegmentVersionRegex = /^(\d+\.)(\d+\.)(\d+\.)(\*|\d+)$/g;
export function isFourSegmentedVersion(versionToCheck: string): boolean {
  return isfourSegmentVersionRegex.test(versionToCheck);
}

const commonReleaseIdentities = [
  ['legacy'],
  ['alpha', 'preview', 'a'],
  ['beta', 'b'],
  ['next'],
  ['milestone', 'm'],
  ['rc', 'cr'],
  ['snapshot'],
  ['release', 'final', 'ga'],
  ['sp']
];
export function friendlifyPrereleaseName(prereleaseName: string): string {
  const filteredNames = [];
  commonReleaseIdentities.forEach(
    function (group) {
      return group.forEach(
        commonName => {
          const exp = new RegExp(`(.+-)${commonName}`, 'i');
          if (exp.test(prereleaseName.toLowerCase())) {
            filteredNames.push(commonName);
          }
        }
      );
    }
  );

  return (filteredNames.length === 0) ?
    null :
    filteredNames[0];
}

export function parseSemver(packageVersion: string): TSemverSpec {
  const { valid, validRange } = require('semver');
  const isVersion = valid(packageVersion, loosePrereleases);
  const isRange = validRange(packageVersion, loosePrereleases);
  return {
    rawVersion: packageVersion,
    type: !!isVersion ?
      PackageVersionTypes.Version :
      !!isRange ? PackageVersionTypes.Range :
        null,
  };
}

export function filterPrereleasesGtMinRange(versionRange: string, prereleases: Array<string>): Array<string> {
  const {
    SemVer,
    gt,
    maxSatisfying,
    minVersion,
    validRange,
  } = require('semver');

  const prereleaseGroupMap: KeyStringArrayDictionary = {};

  // for each prerelease version;
  // group prereleases by x.x.x-{name}*.x
  prereleases.forEach(function (prereleaseVersion) {
    const spec = new SemVer(prereleaseVersion, loosePrereleases)
    const prereleaseKey = friendlifyPrereleaseName(prereleaseVersion) ||
      spec.prerelease[0];

    prereleaseGroupMap[prereleaseKey] = prereleaseGroupMap[prereleaseKey] || [];
    prereleaseGroupMap[prereleaseKey].push(prereleaseVersion);
  });

  // check we have a valid range (handles non-semver errors)
  const isValidRange = validRange(versionRange, loosePrereleases) !== null;
  const minVersionFromRange = isValidRange ?
    minVersion(versionRange, loosePrereleases) :
    versionRange;

  const gtfn = isValidRange ? gt : maxSatisfying;

  // for each group;
  // extract versions that are greater than the min-range (one from each group)
  const filterPrereleases = [];
  Object.keys(prereleaseGroupMap)
    .forEach(function (prereleaseKey) {
      const versions = prereleaseGroupMap[prereleaseKey];
      const testMaxVersion = versions[versions.length - 1];
      const isPrereleaseGt = gtfn(testMaxVersion, minVersionFromRange, loosePrereleases);
      if (isPrereleaseGt) filterPrereleases.push(testMaxVersion)
    });

  return filterPrereleases;
}

export function filterSemverVersions(versions: Array<string>): Array<string> {
  const { validRange } = require('semver');
  const semverVersions = [];
  versions.forEach(version => {
    if (validRange(version, loosePrereleases)) semverVersions.push(version);
  });
  return semverVersions;
}

export const extractSymbolFromVersionRegex = /^([^0-9]*)?.*$/;
export const semverLeadingChars = ['^', '~', '<', '<=', '>', '>=', '~>'];
export function formatWithExistingLeading(existingVersion, newVersion) {
  const regExResult = extractSymbolFromVersionRegex.exec(existingVersion);
  const leading = regExResult && regExResult[1];
  if (!leading || !semverLeadingChars.includes(leading))
    return newVersion;

  return `${leading}${newVersion}`;
}