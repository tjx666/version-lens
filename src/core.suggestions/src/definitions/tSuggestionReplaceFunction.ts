import { PackageResponse } from "core.packages";

export type TSuggestionReplaceFunction = (

  response: PackageResponse,

  version: string

) => string;