import { ILogger } from 'core.logging';
import { UrlHelpers, IProcessClient } from 'core.clients';
import { DotNetSource } from '../definitions/dotnet';
import { DotNetConfig } from '../dotnetConfig';

export class DotNetCli {

  config: DotNetConfig;

  client: IProcessClient;

  logger: ILogger;

  constructor(config: DotNetConfig, client: IProcessClient, logger: ILogger) {
    this.config = config;
    this.client = client;
    this.logger = logger;
  }

  async fetchSources(cwd: string): Promise<Array<DotNetSource>> {

    const promisedCli = this.client.request(
      'dotnet',
      ['nuget', 'list', 'source', '--format', 'short'],
      cwd
    );

    return await promisedCli.then(result => {
      const { data } = result;

      // reject when data contains "error"
      if (data.indexOf("error") > -1) return Promise.reject(result);

      // check we have some data
      if (data.length === 0 || data.indexOf('E') === -1) {
        return [];
      }

      // extract sources
      const hasCrLf = data.indexOf(crLf) > 0;
      const splitChar = hasCrLf ? crLf : '\n';
      let lines = data.split(splitChar);

      // pop any blank entries
      if (lines[lines.length - 1] === '') lines.pop();

      return parseSourcesArray(lines).filter(s => s.enabled);
    }).then(sources => {
      // combine the sources where feed take precedent
      const feedSources = convertFeedsToSources(this.config.nuget.sources);
      return [
        ...feedSources,
        ...sources
      ]
    }).catch(error => {
      // return the fallback source for dotnet clients < 5.5
      return [
        <DotNetSource>{
          enabled: true,
          machineWide: false,
          protocol: UrlHelpers.RegistryProtocols.https,
          url: this.config.fallbackNugetSource,
        }
      ]
    })
  }
}

const crLf = '\r\n';
function parseSourcesArray(lines: Array<string>): Array<DotNetSource> {
  return lines.map(function (line) {
    const enabled = line.substring(0, 1) === 'E';
    const machineWide = line.substring(1, 2) === 'M';
    const offset = machineWide ? 3 : 2;
    const url = line.substring(offset);
    const protocol = UrlHelpers.getProtocolFromUrl(url);
    return {
      enabled,
      machineWide,
      url,
      protocol
    };
  });
}

function convertFeedsToSources(feeds: Array<string>): Array<DotNetSource> {
  return feeds.map(function (url: string) {
    const protocol = UrlHelpers.getProtocolFromUrl(url);
    const machineWide = (protocol === UrlHelpers.RegistryProtocols.file);
    return {
      enabled: true,
      machineWide,
      url,
      protocol
    };
  });
}
