import { ILogger } from 'core.logging';
import { SuggestionFactory } from 'core.suggestions';
import {
  HttpClientRequestMethods,
  JsonClientResponse,
  IJsonHttpClient
} from 'core.clients';
import {
  TPackageRequest,
  PackageSourceTypes,
  PackageVersionTypes,
  VersionHelpers,
  TPackageDocument,
  DocumentFactory
} from 'core.packages';

import { NpmConfig } from "../npmConfig";
import { NpaSpec } from "../models/npaSpec";

const defaultHeaders = {
  accept: 'application\/vnd.github.v3+json',
  'user-agent': 'vscode-contrib/vscode-versionlens'
};

export class GitHubClient {

  config: NpmConfig;

  logger: ILogger;

  client: IJsonHttpClient;

  constructor(config: NpmConfig, client: IJsonHttpClient, logger: ILogger) {
    this.config = config;
    this.client = client;
    this.logger = logger;
  }

  fetchGithub(request: TPackageRequest<null>, npaSpec: NpaSpec): Promise<TPackageDocument> {
    const { validRange } = require('semver');

    if (npaSpec.gitRange) {
      // we have a semver:x.x.x
      return this.fetchTags(request, npaSpec);
    }

    if (validRange(npaSpec.gitCommittish, VersionHelpers.loosePrereleases)) {
      // we have a #x.x.x
      npaSpec.gitRange = npaSpec.gitCommittish;
      return this.fetchTags(request, npaSpec);
    }

    // we have a #commit
    return this.fetchCommits(request, npaSpec);
  }

  fetchTags(request: TPackageRequest<null>, npaSpec: NpaSpec): Promise<TPackageDocument> {
    // todo pass in auth
    const { user, project } = npaSpec.hosted;
    const tagsRepoUrl = `https://api.github.com/repos/${user}/${project}/tags`;
    const query = {};
    const headers = this.getHeaders();

    return this.client.request(
      HttpClientRequestMethods.get,
      tagsRepoUrl,
      query,
      headers
    )
      .then(function (response: JsonClientResponse): TPackageDocument {
        const { compareLoose } = require("semver");

        // extract versions
        const tags = <[]>response.data;

        const rawVersions = tags.map((tag: any) => tag.name);

        const allVersions = VersionHelpers.filterSemverVersions(rawVersions).sort(compareLoose);

        const source: PackageSourceTypes = PackageSourceTypes.Github;

        const { providerName } = request;

        const requested = request.package;

        const type: PackageVersionTypes = npaSpec.gitRange ?
          PackageVersionTypes.Range :
          PackageVersionTypes.Version;

        const versionRange = npaSpec.gitRange;

        const resolved = {
          name: project,
          version: versionRange,
        };

        // seperate versions to releases and prereleases
        const { releases, prereleases } = VersionHelpers.splitReleasesFromArray(
          allVersions
        );

        // analyse suggestions
        const suggestions = SuggestionFactory.createSuggestions(
          versionRange,
          releases,
          prereleases
        );

        return {
          providerName,
          source,
          response,
          type,
          requested,
          resolved,
          suggestions
        };

      });

  }

  fetchCommits(request: TPackageRequest<null>, npaSpec: NpaSpec): Promise<TPackageDocument> {
    // todo pass in auth
    const { user, project } = npaSpec.hosted;
    const commitsRepoUrl = `https://api.github.com/repos/${user}/${project}/commits`;
    const query = {};
    const headers = this.getHeaders();

    return this.client.request(
      HttpClientRequestMethods.get,
      commitsRepoUrl,
      query,
      headers
    )
      .then((response: JsonClientResponse) => {

        const commitInfos = <[]>response.data

        const commits = commitInfos.map((commit: any) => commit.sha);

        const source: PackageSourceTypes = PackageSourceTypes.Github;

        const { providerName } = request;

        const requested = request.package;

        const type = PackageVersionTypes.Committish;

        const versionRange = npaSpec.gitCommittish;

        if (commits.length === 0) {
          // no commits found
          return DocumentFactory.create(
            PackageSourceTypes.Github,
            request,
            response,
            [SuggestionFactory.createNotFound()]
          )
        }

        const commitIndex = commits.findIndex(
          commit => commit.indexOf(versionRange) > -1
        );

        const latestCommit = commits[commits.length - 1].substr(0, 8);

        const noMatch = commitIndex === -1;

        const isLatest = versionRange === latestCommit;

        const resolved = {
          name: project,
          version: versionRange,
        };

        const suggestions = [];

        if (noMatch) {
          suggestions.push(
            SuggestionFactory.createNoMatch(),
            SuggestionFactory.createLatest(latestCommit)
          );
        } else if (isLatest) {
          suggestions.push(
            SuggestionFactory.createMatchesLatest(versionRange)
          );
        } else if (commitIndex > 0) {
          suggestions.push(
            SuggestionFactory.createFixedStatus(versionRange),
            SuggestionFactory.createLatest(latestCommit)
          );
        }

        return {
          providerName,
          source,
          response,
          type,
          requested,
          resolved,
          suggestions,
          gitSpec: npaSpec.saveSpec
        };

      });

  }

  getHeaders() {
    const userHeaders = {};
    if (this.config.github.accessToken && this.config.github.accessToken.length > 0) {
      (<any>userHeaders).authorization = `token ${this.config.github.accessToken}`;
    }
    return Object.assign({}, userHeaders, defaultHeaders);
  }

}