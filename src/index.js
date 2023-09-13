/**
 * @typedef {{
 *   engines?: {
 *     node?: string;
 *     npm?: string;
 *     yarn?: string;
 *   }
 * }} PackageJson
 * @typedef {"node"} Node
 * @typedef {"npm"} NPM
 * @typedef {"yarn"} Yarn
 * @typedef { Node | NPM | Yarn } Engine
 * @typedef { Array<Node | NPM | Yarn> } Engines
 */

const { execSync } = require("child_process");
const path = require("path");
const semver = require("semver");

/**
 * Return the version of the specified engine from the running application.
 *
 * @param {Engine} engine
 * @throws {Error}
 */
function getCurrentVersion(engine) {
  if (engine === "node") {
    return process.version;
  } else if (engine === "npm") {
    return `v${execSync("npm -v").toString().trim()}`;
  } else if (engine === "yarn") {
    return `v${execSync("yarn -v").toString().trim()}`;
  } else if (engine === undefined) {
    throw new Error(`Specified engine must be defined.`);
  } else {
    throw new Error(`Specified engine [${engine}] is not available.`);
  }
}

/**
 * Determine whether the expected engine version satisfies the current version.
 *
 * @param {Engine} engine
 * @param {string | semver.SemVer} expected
 * @param {string | semver.Range} [current]
 * @throws {Error}
 */
function checkVersion(engine, expected, current) {
  current = current || getCurrentVersion(engine);

  return semver.satisfies(current, expected);
}

/**
 * Collect list of application manifest on "package.json".
 *
 * @param {string} [filePath]
 * @returns {PackageJson}
 */
function collectPackageJson(filePath = undefined) {
  try {
    return require(filePath || path.join(process.cwd(), "package.json"));
  } catch (error) {
    return undefined;
  }
}

/**
 * Determine whether all of the versions of the engine from "package.json"
 * satisfy the running application version.
 *
 * @param {PackageJson & string} json The object data of "package.json" or file path to the "package.json".
 * @param {Engines} [engines] List of engine to check.
 */
function checkVersionsFromPackageJson(json, engines) {
  if (typeof json === "string" || json === undefined) {
    json = collectPackageJson(json);
  }

  engines = [...new Set(engines || ["node"])];

  return engines.every((engine) => {
    if (json === undefined) {
      throw new Error("package.json is not available.");
    } else if (!"engines" in json || json.engines === undefined) {
      throw new Error("Property [engines] in package.json is not available.");
    } else if (!engine in json.engines || json.engines[engine] === undefined) {
      throw new Error(
        `Specified engine [${engine}] in package.json is not available.`
      );
    }

    return checkVersion(engine, json.engines[engine]);
  });
}

module.exports = {
  getCurrentVersion,
  checkVersion,
  collectPackageJson,
  checkVersionsFromPackageJson,
};
