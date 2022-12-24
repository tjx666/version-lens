import { PackageVersionTypes, VersionHelpers } from 'core.packages';

import { DotNetVersionSpec } from './definitions/dotnet';
import { NugetVersionSpec } from './definitions/nuget';

export function expandShortVersion(value) {
  if (!value ||
    value.indexOf('[') !== -1 ||
    value.indexOf('(') !== -1 ||
    value.indexOf(',') !== -1 ||
    value.indexOf(')') !== -1 ||
    value.indexOf(']') !== -1 ||
    value.indexOf('*') !== -1)
    return value;

  let dotCount = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === '.')
      dotCount++;
    else if (isNaN(parseInt(c)))
      return value;
  }

  let fmtValue = '';
  if (dotCount === 0)
    fmtValue = value + '.0.0';
  else if (dotCount === 1)
    fmtValue = value + '.0';
  else
    return value;

  return fmtValue;
}

export function parseVersionSpec(rawVersion: string): DotNetVersionSpec {
  const spec = buildVersionSpec(rawVersion);

  let version: string;
  let isValidVersion = false;
  let isValidRange = false;

  if (spec && !spec.hasFourSegments) {
    // convert spec to semver
    const { valid, validRange } = require('semver');
    version = convertVersionSpecToString(spec);
    isValidVersion = valid(version, VersionHelpers.loosePrereleases);
    isValidRange = !isValidVersion && validRange(version, VersionHelpers.loosePrereleases) !== null;
  }

  const type: PackageVersionTypes = isValidVersion ?
    PackageVersionTypes.Version :
    isValidRange ? PackageVersionTypes.Range : null

  const resolvedVersion = spec ? version : '';

  return {
    type,
    rawVersion,
    resolvedVersion,
    spec
  };
}

export function buildVersionSpec(value): NugetVersionSpec {
  let formattedValue = expandShortVersion(value.trim());
  if (!formattedValue) return null;

  // test if the version is in semver format
  const semver = require('semver');
  const parsedSemver = semver.parse(formattedValue, { includePrereleases: true });
  if (parsedSemver) {
    return {
      version: formattedValue,
      isMinInclusive: true,
      isMaxInclusive: true,
      hasFourSegments: false,
    };
  }

  try {
    // test if the version is a semver range format
    const parsedNodeRange = semver.validRange(formattedValue, { includePrereleases: true });
    if (parsedNodeRange) {
      return {
        version: parsedNodeRange,
        isMinInclusive: true,
        isMaxInclusive: true,
        hasFourSegments: false,
      };
    }
  } catch { }

  // fail if the string is too short
  if (formattedValue.length < 3) return null;

  const versionSpec: NugetVersionSpec = {};

  // first character must be [ or (
  const first = formattedValue[0];
  if (first === '[')
    versionSpec.isMinInclusive = true;
  else if (first === '(')
    versionSpec.isMinInclusive = false;
  else if (VersionHelpers.isFourSegmentedVersion(formattedValue))
    return { hasFourSegments: true }
  else
    return null;

  // last character must be ] or )
  const last = formattedValue[formattedValue.length - 1];
  if (last === ']')
    versionSpec.isMaxInclusive = true;
  else if (last === ')')
    versionSpec.isMaxInclusive = false;

  // remove any [] or ()
  formattedValue = formattedValue.substr(1, formattedValue.length - 2);

  // split by comma
  const parts = formattedValue.split(',');

  // more than 2 is invalid
  if (parts.length > 2)
    return null;
  else if (parts.every(x => !x))
    // must be (,]
    return null;

  // if only one entry then use it for both min and max
  const minVersion = parts[0];
  const maxVersion = (parts.length == 2) ? parts[1] : parts[0];

  // parse the min version
  if (minVersion) {
    const parsedVersion = buildVersionSpec(minVersion);
    if (!parsedVersion) return null;

    versionSpec.minVersionSpec = parsedVersion;
    versionSpec.hasFourSegments = parsedVersion.hasFourSegments;
  }

  // parse the max version
  if (maxVersion) {
    const parsedVersion = buildVersionSpec(maxVersion);
    if (!parsedVersion) return null;

    versionSpec.maxVersionSpec = parsedVersion;
    versionSpec.hasFourSegments = parsedVersion.hasFourSegments;
  }

  return versionSpec;
}

function convertVersionSpecToString(versionSpec: NugetVersionSpec) {
  // x.x.x cases
  if (versionSpec.version
    && versionSpec.isMinInclusive
    && versionSpec.isMaxInclusive)
    return versionSpec.version;

  // [x.x.x] cases
  if (versionSpec.minVersionSpec
    && versionSpec.maxVersionSpec
    && versionSpec.minVersionSpec.version === versionSpec.maxVersionSpec.version
    && versionSpec.isMinInclusive
    && versionSpec.isMaxInclusive)
    return versionSpec.minVersionSpec.version;

  let rangeBuilder = '';

  if (versionSpec.minVersionSpec) {
    rangeBuilder += '>';
    if (versionSpec.isMinInclusive)
      rangeBuilder += '=';
    rangeBuilder += versionSpec.minVersionSpec.version
  }

  if (versionSpec.maxVersionSpec) {
    rangeBuilder += rangeBuilder.length > 0 ? ' ' : '';
    rangeBuilder += '<';
    if (versionSpec.isMaxInclusive)
      rangeBuilder += '=';
    rangeBuilder += versionSpec.maxVersionSpec.version
  }

  return rangeBuilder;
}