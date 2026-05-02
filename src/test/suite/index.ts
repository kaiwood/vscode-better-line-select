import * as fs from "fs";
import * as path from "path";
import Mocha = require("mocha");

export function run(): Promise<void> {
  const mocha = new Mocha({
    color: true,
    ui: "tdd"
  });

  const testsRoot = __dirname;

  for (const file of findTestFiles(testsRoot)) {
    mocha.addFile(file);
  }

  return new Promise((resolve, reject) => {
    try {
      mocha.run((failures: number) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function findTestFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...findTestFiles(entryPath));
    } else if (entry.name.endsWith(".test.js")) {
      files.push(entryPath);
    }
  }

  return files;
}
