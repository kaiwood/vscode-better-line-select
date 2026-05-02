const { defineConfig } = require("@vscode/test-cli");

module.exports = defineConfig({
  files: "out/src/test/suite/**/*.test.js",
  launchArgs: ["--user-data-dir=/tmp/bls-vscode-test"],
  version: "1.74.0",
  mocha: {
    ui: "tdd",
    timeout: 20000
  }
});
