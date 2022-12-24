import { ILogger } from 'core.logging';
import {
  HttpClientResponse,
  HttpClientRequestMethods,
  IJsonHttpClient
} from 'core.clients';

import { NugetServiceIndexResponse } from '../definitions/nuget';
import { DotNetSource } from '../definitions/dotnet';

export class NuGetResourceClient {

  logger: any;

  client: IJsonHttpClient;

  constructor(client: IJsonHttpClient, logger: ILogger) {
    this.client = client;
    this.logger = logger;
  }

  async fetchResource(source: DotNetSource): Promise<string> {
    const query = {};
    const headers = {};

    this.logger.debug("Requesting PackageBaseAddressService from %s", source.url)

    return await this.client.request(
      HttpClientRequestMethods.get,
      source.url,
      query,
      headers
    )
      .then((response: NugetServiceIndexResponse) => {
        const packageBaseAddressServices = response.data.resources
          .filter(res => res["@type"].indexOf('PackageBaseAddress') > -1);

        // just take one service for now
        const foundPackageBaseAddressServices = packageBaseAddressServices[0]["@id"];

        this.logger.debug(
          "Resolved PackageBaseAddressService endpoint: %O",
          foundPackageBaseAddressServices
        );

        return foundPackageBaseAddressServices;
      })
      .catch((error: HttpClientResponse) => {

        this.logger.error(
          "Could not resolve nuget service index. %O",
          error
        )

        return "";
      });

  }

}