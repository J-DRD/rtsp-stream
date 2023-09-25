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

// -------------------------------------------------------------------------------------------------
async function buildProxy({ spinner, projectName }) {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(__dirname, "..", "src");

    const exec = (commands) => spawn(commands, { shell: true, cwd });

    const distAppFolder = path.resolve(__dirname, "..", "dist");

    if (!fs.existsSync(distAppFolder)) {
      rimraf.sync(distAppFolder);
    }

    makeFolder(distAppFolder);

    spinner.start(chalk.yellow(`🏗️  Building ${projectName}.`));

    const npx = exec(`go build -ldflags="-s -w" -o "${distAppFolder}"`);

    npx.on("close", async (code) => {
      if (code !== 0) {
        reject(new Error(`Failed to build ${projectName} : ${code}`));
        return;
      }

      spinner.succeed(chalk.green(`Built ${projectName}.`));
      resolve();
    });

    npx.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Failed to build browser extensions: ${code}`));
        return;
      }
      resolve();
    });

    npx.stdout.on("data", (data) => {
      spinner.info(data.toString().replace(/\s/g, ""));
    });
    npx.stdin.on("data", (data) => {
      spinner.info(data.toString().replace(/\s/g, ""));
    });
    npx.stderr.on("data", (data) => {
      spinner.info(data.toString().replace(/\s/g, ""));
    });
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

    await buildProxy(params);
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
