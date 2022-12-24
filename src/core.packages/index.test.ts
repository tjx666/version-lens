
// VersionHelperTests
import extractTaggedVersions from './test/helpers/versionHelpers/extractTaggedVersions.tests';
import rollupPrereleases from './test/helpers/versionHelpers/filterPrereleasesGtMinRange.tests';
import splitReleasesFromArray from './test/helpers/versionHelpers/splitReleasesFromArray.tests';
import removeFourSegmentVersionsFromArray from './test/helpers/versionHelpers/removeFourSegmentVersionsFromArray.tests';
import friendlifyPrereleaseName from './test/helpers/versionHelpers/friendlifyPrereleaseName.tests';
import filterSemverVersions from './test/helpers/versionHelpers/filterSemverVersions.tests';
import isFixedVersion from './test/helpers/versionHelpers/isFixedVersion.tests';
import lteFromArray from './test/helpers/versionHelpers/lteFromArray.tests'

export const VersionHelperTests = {
  extractTaggedVersions,
  rollupPrereleases,
  splitReleasesFromArray,
  removeFourSegmentVersionsFromArray,
  friendlifyPrereleaseName,
  filterSemverVersions,
  isFixedVersion,
  lteFromArray,
}

// Package Parser Tests
import extractPackageDependenciesFromJson from './test/parsers/jsonPackageParser/extractPackageDependenciesFromJson.tests';
import extractPackageDependenciesFromYaml from './test/parsers/yamlPackageParser/extractPackageDependenciesFromYaml.tests';

export const PackageParserTests = {
  extractPackageDependenciesFromJson,
  extractPackageDependenciesFromYaml,
}