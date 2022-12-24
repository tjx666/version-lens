import { ILogger } from 'core.logging';
import { UrlHelpers, IProcessClient } from 'core.clients';

import { MavenConfig } from '../mavenConfig';
import { MavenRepository } from '../definitions/mavenRepository';
import * as MavenXmlFactory from '../mavenXmlParserFactory';

export class MvnCli {

  config: MavenConfig;

  client: IProcessClient;

  logger: ILogger;

  constructor(config: MavenConfig, client: IProcessClient, logger: ILogger) {
    this.client = client;
    this.config = config;
    this.logger = logger;
  }

  async fetchRepositories(cwd: string): Promise<Array<MavenRepository>> {
    const promisedCli = this.client.request(
      'mvn ',
      ['help:effective-settings'],
      cwd
    );

    return promisedCli.then(result => {
      const { data } = result;
      // check we have some data
      if (data.length === 0) return [];

      return MavenXmlFactory.extractReposUrlsFromXml(data);
    }).catch(error => {
      return [];
    }).then((repos: Array<string>) => {

      if (repos.length === 0) {
        // this.config.getDefaultRepository()
        repos.push("https://repo.maven.apache.org/maven2/")
      }

      return repos;

    }).then((repos: Array<string>) => {

      // parse urls to Array<MavenRepository.
      return repos.map(url => {
        const protocol = UrlHelpers.getProtocolFromUrl(url);
        return {
          url,
          protocol,
        }
      });

    });

  }

}
