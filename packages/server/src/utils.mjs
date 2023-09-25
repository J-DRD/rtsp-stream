// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
import fs from "fs-extra";
import path from "path";
import glob from "glob";
import archiver from "archiver";
import JSON5 from "json5";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Description
 * @param {any} cwd
 * @param {any} glob
 * @param {any} out
 * @returns {any}
 */
export async function zipGlob({ folderPath, globPattern, outputFilename }) {
  const distFolder = path.dirname(outputFilename);

  // 🚩 Make sure the destination folder exist.
  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = fs
      .createWriteStream(outputFilename)
      .on("close", () => {
        resolve();
      })
      .on("end", resolve);

    archive
      .glob(globPattern, { cwd: folderPath })
      .on("error", reject)
      .on("warning", (err) => {
        if (err.code === "ENOENT") {
          console.warn(err);
        } else {
          throw err;
        }
      })
      .pipe(stream);

    archive.finalize();
  });
}

/**
 * Description   🎵 Note: All branches other than release will have a suffix of '-[branch-name]'.
 * @param {any} branchName
 * @returns {any}
 */
export const isPreReleaseBranch = (branchName) => {
  const regex = new RegExp(`^${process.env.RELEASE_BRANCH || "release"}.*$`);
  return regex.test(branchName) !== true;
};

/**
 * Description
 * @param {any} filePath
 * @returns {any}
 */
export const getPathName = (filePath) => path.basename(filePath);

/**
 * Description
 * @param {any} filePath
 * @returns {any}
 */
export const getFileExtension = (filePath) => path.extname(filePath);

/**
 * Description
 * @param {any} filePath
 * @returns {any}
 */
export const getFileName = (filePath) =>
  path.basename(filePath, getFileExtension(filePath));

/**
 * Description
 * @param {any} folder
 * @returns {any} void
 */
export const makeFolder = (folder, { recursive = true } = {}) =>
  fs.mkdirSync(folder, { recursive });

/**
 * Description
 * @param {any} folder
 * @returns {any}
 */
export const folderExists = (folder) => fs.existsSync(folder);

/**
 * Description
 * @param {any} relativePath
 * @returns {any} fullPath
 */
export const getFullPath = (relativePath, { cwd = process.cwd() } = {}) =>
  path.join(cwd, relativePath);

/**
 * Description
 * @param {any} fileName
 * @returns {any}
 */
export const readJsonFileSync = (fileName) =>
  JSON.parse(fs.readFileSync(fileName, "utf8"));

/**
 * Description
 * @param {any} fileName
 * @returns {any}
 */
export const readJson5File = (fileName) =>
  JSON5.parse(fs.readFileSync(fileName));

/**
 * Description
 * @param {any} fileName
 * @param {any} jsonData
 * @param {any} {overwrite=true
 * @param {any} replacer=null
 * @param {any} space=2}
 * @returns {any}
 */
export const writeJsonFile = (
  fileName,
  jsonData,
  { overwrite = true, replacer = null, space = 2 } = {}
) =>
  fs.writeFileSync(fileName, JSON.stringify(jsonData, replacer, space), {
    overwrite,
  });

/**
 * Description Returns true is the current script is the main entry-point.
 * @param {any} fileName
 * @returns {any}
 */
export function isMainScript(fileName) {
  const [, mainScript] = process.argv;
  return mainScript === fileName;
}

// /**
//  * Description converts forward slash to backslash.
//  * @param {any} path
//  * @returns {any}
//  */
// export function slash(path) {
//   const isExtendedLengthPath = /^\\\\\?\\/.test(path);
//   const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

//   if (isExtendedLengthPath || hasNonAscii) {
//     return path;
//   }

//   return path.replace(/\\/g, "/");
// }

export function indentString(string, count = 1, options = {}) {
  const { indent = " ", includeEmptyLines = false } = options;

  if (typeof string !== "string") {
    throw new TypeError(
      `Expected \`input\` to be a \`string\`, got \`${typeof string}\``
    );
  }

  if (typeof count !== "number") {
    throw new TypeError(
      `Expected \`count\` to be a \`number\`, got \`${typeof count}\``
    );
  }

  if (count < 0) {
    throw new RangeError(
      `Expected \`count\` to be at least 0, got \`${count}\``
    );
  }

  if (typeof indent !== "string") {
    throw new TypeError(
      `Expected \`options.indent\` to be a \`string\`, got \`${typeof indent}\``
    );
  }

  if (count === 0) {
    return string;
  }

  const regex = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

  return string.replace(regex, indent.repeat(count));
}

export function relativePath(file) {
  return path.relative(workspaceRoot, file);
}
