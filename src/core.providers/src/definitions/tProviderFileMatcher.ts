export type TProviderFileMatcher = {
  language?: string;
  scheme?: string;
  pattern?: string | ((fileName: string) => boolean);
}
