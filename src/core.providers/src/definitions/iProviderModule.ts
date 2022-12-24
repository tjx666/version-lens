import { ISuggestionProvider } from "core.suggestions";

export interface IProviderModule {

  configureContainer(container: any): ISuggestionProvider

}