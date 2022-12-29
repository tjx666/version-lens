# Version Lens for Visual Studio Code

## Modified Content

- support nest `versionlens.npm.dependencyProperties` setting, for example: "pnpm.overrides"
- support `versionlens.npm.jsonPatterns` setting

## Features

This extension shows **version** information when opening a package or project for one of the following:

- dotnet <https://www.dotnetfoundation.org/>
- dub <https://code.dlang.org/>
- jspm <https://jspm.io/>,
- maven <https://maven.apache.org/>
- npm <https://www.npmjs.com/>
- pub <https://pub.dev/>
- composer <https://getcomposer.org/>

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
