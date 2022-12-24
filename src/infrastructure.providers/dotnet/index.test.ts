import parseVersionSpec from './test/dotnetUtils/parseVersionSpec.tests';
export const DotNetUtils = {
  parseVersionSpec,
}

export * from './test/clients/dotnetClient.tests';
export * from './test/clients/nugetResourceClient.tests';

// Package Parser Tests
import createDependenciesFromXml from './test/dotnetXmlParserFactory/createDependenciesFromXml.tests';

export const DotnetParserTests = {
  createDependenciesFromXml,
}