# Version Lens for Visual Studio Code

[![Badge for version for Visual Studio Code extension](https://vsmarketplacebadge.apphb.com/version-short/pflannery.vscode-versionlens.svg?color=blue&style=?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens&wt.mc_id=vscode-versionlens-gitlab) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/pflannery.vscode-versionlens.svg?color=blue&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/pflannery.vscode-versionlens.svg?color=blue&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens) [![The ISC License](https://img.shields.io/badge/license-ISC-orange.svg?color=blue&style=flat-square)](http://opensource.org/licenses/ISC)

[![](https://gitlab.com/versionlens/vscode-versionlens/badges/master/pipeline.svg)](https://gitlab.com/versionlens/vscode-versionlens/-/pipelines)


This extension shows __version__ information when opening a package or project for one of the following:

- dotnet https://www.dotnetfoundation.org/
- dub https://code.dlang.org/
- jspm https://jspm.io/,
- maven https://maven.apache.org/
- npm https://www.npmjs.com/
- pub https://pub.dev/
- composer https://getcomposer.org/

## How do I see version information?

Click the V icon in the package\project file toolbar.

You can also choose the default startup state by setting `versionlens.suggestions.showOnStartup`

![Show releases](https://gitlab.com/versionlens/vscode-versionlens/-/raw/master/images/faq/show-releases.gif)

## Can I see prerelease versions?

Yes! click on the tag icon in the package\project file toolbar.

You can also choose the default startup state by setting `versionlens.suggestions.showPrereleasesOnStartup`

![Show prereleases](https://gitlab.com/versionlens/vscode-versionlens/-/raw/master/images/faq/show-prereleases.gif)

## How do I install this extension?

Follow this link on [how to install vscode extensions](https://code.visualstudio.com/docs/editor/extension-gallery)

## Can I install this extension manually?

Yes goto the [release page for instructions](https://gitlab.com/versionlens/vscode-versionlens/-/releases)

## I'm not able to install this extention

Try a clean install:

- Shut down vscode
- Delete the extension folder `{home}/.vscode/extensions/pflannery.vscode-versionlens*`
- Open vscode and try reinstalling the extension again

If that fails then have a look in the `Log (Extension Host)` channel. Report it here if that doesn't help.

![image](https://gitlab.com/versionlens/vscode-versionlens/-/raw/master/images/faq/ext-host-log.png)

## How do I troubleshoot this extension?

- Ensure that the package\project file open is using the correct file type. i.e. json instead of jsonc

  ![image](https://gitlab.com/versionlens/vscode-versionlens/-/raw/master/images/faq/json-file-type.png)

- Version lens writes a log to an output channel in vscode.

  If your experiencing issues please set your `versionlens.logging.level` to `debug` (vscode needs to be restarted) 
    
  Then open the channel like:
    
  ![image](https://gitlab.com/versionlens/vscode-versionlens/-/raw/master/images/faq/ext-log.png)

## License

Licensed under ISC

Copyright &copy; 2016+ [contributors](https://gitlab.com/versionlens/vscode-versionlens/-/graphs/master)
