export enum SuggestionStatus {
  BadRequest = '400 bad request',
  NotAuthorized = '401 not authorized',
  Forbidden = '403 forbidden',
  NotFound = 'package not found',
  InternalServerError = '500 internal server error',
  NotSupported = 'not supported',
  ConnectionRefused = 'connection refused',
  Invalid = 'invalid entry',
  NoMatch = 'no match',
  Satisfies = 'satisfies',
  Latest = 'latest',
  LatestIsPrerelease = 'latest prerelease',
  Fixed = 'fixed'
}