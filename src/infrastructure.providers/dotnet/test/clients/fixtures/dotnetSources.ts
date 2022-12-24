export default {

  enabledSources: `E https://api.nuget.org/v3/index.json
E http://non-ssl/v3/index.json
EM C:\\Program Files (x86)\\Microsoft SDKs\\NuGetPackages\\`,

  disabledSource: `D https://api.nuget.org/v3/index.json`,

  enabledAndDisabledSources: `D http://non-ssl/v3/index.json
E https://api.nuget.org/v3/index.json`,

  invalidSources: 'error: invalid value'

}