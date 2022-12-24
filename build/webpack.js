const fs = require('fs');
const path = require('path');

const buildPath = __dirname;
const projectPath = path.resolve(buildPath, '..');
const sourcePath = path.resolve(projectPath, 'src');
const testPath = path.resolve(projectPath, 'test');
const distPath = path.resolve(projectPath, 'dist');

module.exports = function (env, argv) {

  const logging = env && env.logging == 'true'
  const test = env && env.test == 'true'

  const entry = test ?
    path.resolve(testPath, 'runner.ts') :
    path.resolve(sourcePath, 'activate.ts');

  const tsconfigFile = test ?
    path.resolve(buildPath, 'tsconfig.test.json') :
    path.resolve(buildPath, 'tsconfig.src.json');

  const outputFile = test ?
    'extension.test.js' :
    'extension.bundle.js'

  console.log("[info] " + tsconfigFile)

  return {

    target: 'node',

    node: {
      __dirname: false
    },

    entry,

    externals: generateExternals(),

    resolve: {
      extensions: ['.ts'],
      alias: generateAliases()
    },

    module: {
      rules: [{
        test: /\.ts?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: tsconfigFile,
            transpileOnly: true
          }
        }]
      }]
    },

    devtool: 'source-map',

    output: {
      path: distPath,
      filename: outputFile,
      libraryTarget: "commonjs2",
      devtoolModuleFilenameTemplate: "../[resource-path]",
    },

  }

  function generateAliases() {
    log("[debug] Generating aliases")

    let aliases = {
      ...generateAreaAliases(''),
      ...generateAreaAliases('infrastructure.providers')
    }

    log("[debug] Generated aliases", aliases)

    return aliases;
  }

  function generateAreaAliases(relativePath) {
    log("[debug] Generating area aliases for " + relativePath)

    const areaAliases = {}
    const areaPrefix = relativePath.length > 0 ?
      `${relativePath}.` :
      relativePath;

    getDirectories(path.resolve(sourcePath, relativePath))
      .sort()
      .map(areaPath => ({ areaName: path.basename(areaPath), areaPath }))
      .forEach(
        area => {
          const areaFullName = `${areaPrefix}${area.areaName}`;
          const areaFullPath = path.resolve(sourcePath, relativePath, area.areaPath);
          const indexTestPath = path.resolve(areaFullPath, 'index.test.ts');

          areaAliases[areaFullName] = areaFullPath;
          if (test && fs.existsSync(indexTestPath)) {
            areaAliases['test.' + areaFullName] = indexTestPath;
          }
        }
      )

    return areaAliases;
  }

  function generateExternals() {
    log("[debug] Generating externals")

    const externals = {
      "vscode": "commonjs vscode",
      "@npmcli/promise-spawn": "commonjs @npmcli/promise-spawn"
    }

    getNodeModulesNames()
      .forEach(
        moduleName => externals[moduleName] = `commonjs ${moduleName}`
      )

    log("[debug] Generated externals", externals)

    return [
      externals,
      /package\.json$/,
    ]
  }

  function getNodeModulesNames() {
    return getDirectories(path.resolve(projectPath, 'node_modules'))
  }

  function getDirectories(absolutePath) {
    log(`[debug] getDirectories ${absolutePath}`)
    return fs.readdirSync(absolutePath).filter(
      function (file) {
        return fs.statSync(absolutePath + '/' + file).isDirectory();
      }
    );
  }

  function log(message, ...optional) {
    if (logging) console.log(message, ...optional)
  }

}