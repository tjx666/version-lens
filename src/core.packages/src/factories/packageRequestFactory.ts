import {
  RequestFactory,
  ResponseFactory,
  IPackageDependency,
  TPackageRequest,
  IPackageClient,
  PackageResponse,
} from 'core.packages';

export async function executeDependencyRequests<TClientData>(
  packagePath: string,
  client: IPackageClient<TClientData>,
  clientData: TClientData,
  dependencies: Array<IPackageDependency>,
): Promise<Array<PackageResponse>> {

  const { providerName } = client.config;

  const results = [];
  const promises = dependencies.map(
    function (dependency) {

      // build the client request
      const { name, version } = dependency.packageInfo;
      const clientRequest: TPackageRequest<TClientData> = {
        providerName,
        clientData,
        dependency,
        package: {
          name,
          version,
          path: packagePath,
        },
        attempt: 0
      };

      // execute request
      const promisedDependency = RequestFactory.executePackageRequest(
        client,
        clientRequest
      );

      // flatten responses
      return promisedDependency.then(
        function (responses) {
          if (Array.isArray(responses))
            results.push(...responses)
          else
            results.push(responses);
        }
      );

    }

  );

  return Promise.all(promises).then(_ => results)
}

export async function executePackageRequest<TClientData>(
  client: IPackageClient<TClientData>,
  request: TPackageRequest<TClientData>,
): Promise<Array<PackageResponse> | PackageResponse> {

  client.logger.debug(`Queued package: %s`, request.package.name);

  return client.fetchPackage(request)
    .then(function (response) {

      client.logger.info(
        'Fetched %s package from %s: %s@%s',
        response.providerName,
        response.response.source,
        request.package.name,
        request.package.version
      );

      return ResponseFactory.createSuccess(request, response);
    })
    .catch(function (error: PackageResponse) {

      client.logger.error(
        `%s caught an exception.\n Package: %j\n Error: %j`,
        executePackageRequest.name,
        request.package,
        error
      );

      return Promise.reject(error);
    })
}