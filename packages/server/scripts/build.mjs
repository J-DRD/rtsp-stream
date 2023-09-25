// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import "./env.mjs";
import fs from "fs-extra";
import { program } from "commander";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import chalk from "chalk";
import path from "path";
import { rimraf } from "rimraf";
import { makeFolder, readJsonFileSync, indentString } from "./utils.mjs";
import dotenvParseVariables from "dotenv-parse-variables";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyFileSync(filePath, destDir, options = { overwrite: true }) {
  const filename = path.basename(filePath);
  return fs.copySync(filePath, path.join(destDir, filename), options);
}

function copyStreamExecutable(distFolder) {
  const streamDistFolder = path.resolve(
    __dirname,
    "..",
    "..",
    "stream",
    "dist"
  );

  fs.copySync(streamDistFolder, distFolder, { overwrite: true });
}

function copySrcFiles(distFolder) {
  const srcFolder = path.resolve(__dirname, "..", "src");
  fs.copySync(srcFolder, distFolder, { overwrite: true });
}

function copyConfigFile(distFolder) {
  const configFile = path.resolve(__dirname, "..", "..", "..", "config.json");
  copyFileSync(configFile, distFolder);
}

function copyHttpsCertFiles(distFolder) {
  const filesToCopy = [
    path.resolve(__dirname, "..", "https.key"),
    path.resolve(__dirname, "..", "https.crt"),
  ];

  filesToCopy.forEach((file) => {
    copyFileSync(file, distFolder);
  });
}

function copyClientFiles(distFolder) {
  const clientFolder = path.resolve(__dirname, "..", "..", "client", "dist");

  const distClientFolder = path.join(distFolder, "client");

  if (!fs.existsSync(distClientFolder)) {
    fs.mkdirSync(distClientFolder);
  }

  fs.copySync(clientFolder, distClientFolder, { overwrite: true });
}

// -------------------------------------------------------------------------------------------------
async function buildServer({ spinner, projectName }) {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(__dirname, "..", "src");

    const exec = (commands) => spawn(commands, { shell: true, cwd });

    const distFolder = path.resolve(__dirname, "..", "dist");

    if (!fs.existsSync(distFolder)) {
      rimraf.sync(distFolder);
    }

    makeFolder(distFolder);

    spinner.start(chalk.yellow(`🏗️  Building ${projectName}.`));

    copyStreamExecutable(distFolder);
    copySrcFiles(distFolder);
    copyConfigFile(distFolder);
    copyHttpsCertFiles(distFolder);
    copyClientFiles(distFolder);

    spinner.succeed(chalk.green(`Built ${projectName}.`));
    resolve(true);
  });
}

/// ----------------------------------------------------------------------------
async function main() {
  const { name: projectName } = readJsonFileSync(
    path.resolve(__dirname, "..", "package.json")
  );

  program
    .option("-v, --verbose", "Whether to enable verbose output")
    .description(`Builds ${projectName}.`);

  program.parse(process.argv);

  const argv = program.opts();
  const env = dotenvParseVariables(process.env);

  const { VERBOSE = false } = env;

  const verbose = VERBOSE || argv.verbose;

  const spinner = ora({
    spinner: "clock",
    text: `Building ${projectName}.\n`,
  }).start();

  try {
    const params = {
      ...argv,
      spinner,
      logger: console.log,
      verbose,
      projectName,
    };

    await buildServer(params);
  } catch (err) {
    spinner.fail(
      chalk.red(
        `💥 Failed to build ${projectName}:\n\n${indentString(
          err.stack || err,
          4
        )}\n\n`
      )
    );
    process.exit(1);
  }
}

// -------------------------------------------------------------------------------------------------
main().catch((err) => {
  console.error(chalk.red(err.stack || err));
});
