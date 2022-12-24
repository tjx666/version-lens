import { ILogger } from "core.logging";
import { IProviderConfig } from "core.providers";
import {
  PackageResponse,
  IPackageDependency
} from "core.packages";

import { TSuggestionReplaceFunction } from "./tSuggestionReplaceFunction";

export interface ISuggestionProvider {

  config: IProviderConfig;

  logger: ILogger;

  suggestionReplaceFn: TSuggestionReplaceFunction;

  parseDependencies(packageText: string): Array<IPackageDependency>;

  fetchSuggestions(
    packagePath: string,
    packageDependencies: Array<IPackageDependency>
  ): Promise<Array<PackageResponse>>;

}