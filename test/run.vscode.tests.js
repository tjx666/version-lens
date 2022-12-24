const { runTests } = require('vscode-test');
const path = require('path');

const extensionDevelopmentPath = path.resolve(__dirname, '..');
const distPath = path.resolve(extensionDevelopmentPath, 'dist');

runTests({
  version: "insiders",
  extensionDevelopmentPath,
  extensionTestsPath: path.resolve(distPath, 'extension.test.js'),
  launchArgs: [
    __dirname
  ]
}).catch(error => {
  console.error('Something went wrong!', error);
  process.exit(1);
});