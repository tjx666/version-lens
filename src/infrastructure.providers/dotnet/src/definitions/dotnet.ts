import { PackageVersionTypes } from 'core.packages';
import { UrlHelpers } from 'core.clients';
import { NugetVersionSpec } from './nuget';

export type DotNetVersionSpec = {
  type: PackageVersionTypes,
  rawVersion: string,
  resolvedVersion: string,
  spec: NugetVersionSpec,
};

export type DotNetSource = {
  enabled: boolean,
  machineWide: boolean,
  url: string,
  protocol: UrlHelpers.RegistryProtocols,
}