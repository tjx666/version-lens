export enum NpaTypes {
  Git = 'git',
  Remote = 'remote',
  File = 'file',
  Directory = 'directory',

  Tag = 'tag',
  Version = 'version',
  Range = 'range',
  Alias = 'alias',
}

export type NpaSpec = {
  type: NpaTypes;
  registry: boolean,
  name: string,
  scope: string,
  escapedName: string,
  rawSpec: any,
  saveSpec: any,
  fetchSpec: any,
  subSpec: any,
  gitRange: any,
  gitCommittish: string,
  hosted: any,
  raw: string,
}