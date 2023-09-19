const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const semver = require("semver");

/** @type {Engines} */
const defaultEngines = ["node"];

/** @type {Engines} */
const availableEngines = ["node", "npm", "yarn", "pnpm", "npx"];

/**
 * Higher value in array means higher priority to check
 * when set up "definedVersions".
 *
 * @type {Array<PackageJsonEngineProperty>}
 */
const availablePackageJsonEngineProperty = ["volta", "engines"];

/**
 * @typedef {"node"} EngineNode
 * @typedef {"npm"} EngineNpm
 * @typedef {"yarn"} EngineYarn
 * @typedef {"pnpm"} EnginePnpm
 * @typedef {"npx"} EngineNpx
 * @typedef {EngineNode | EngineNpm | EngineYarn | EnginePnpm | EngineNpx} Engine
 * @typedef {Array<Engine>} Engines
 * @typedef {string} Version
 * @typedef {{ node?: Version; }} VersionNode
 * @typedef {{ npm?: Version; }} VersionNpm
 * @typedef {{ yarn?: Version; }} VersionYarn
 * @typedef {{ pnpm?: Version; }} VersionPnpm
 * @typedef {{ npx?: Version; }} VersionNpx
 * @typedef {VersionNode & VersionNpm & VersionYarn & VersionPnpm & VersionNpx} Versions
 * @typedef {"engines" | "volta"} PackageJsonEngineProperty
 * @typedef {{ engines?: Versions; volta?: Versions; }} PackageJson
 * @typedef {{ (engine: Engine, currentVersion?: string | semver.Range, definedVersion?: string, isValid: boolean) => void; }} LogCallback
 */
class CheckVersion {
  static defaultEngines = defaultEngines;
  static availableEngines = availableEngines;
  static availablePackageJsonEngineProperty =
    availablePackageJsonEngineProperty;

  /** @type {Engines} */
  #checkedEngines;

  /** @type {Versions} */
  #definedVersions = {};

  /**
   * @param {Engines | Engine} [engines]
   */
  constructor(engines) {
    this.#checkedEngines = this.#parseEngines(engines);
  }

  /**
   * Parse given engines value.
   *
   * @param {Engines | Engine} [engines]
   * @throws {RangeError}
   */
  #parseEngines(engines) {
    if (engines === undefined) {
      engines = defaultEngines;
    } else if (typeof engines === "string") {
      engines = [engines];
    }

    return [...new Set(engines)].map((engine) => {
      if (!availableEngines.includes(engine)) {
        throw new RangeError(
          `Specified engine [${engine}] is not available. ` +
            "Current available engines: " +
            availableEngines.join(", ") +
            "."
        );
      }

      return engine;
    });
  }

  /**
   * Return the version of the specified engine from the running application.
   *
   * @param {Engine} [engine]
   * @throws {TypeError | RangeError}
   */
  static getCurrentVersion(engine) {
    if (engine === undefined) {
      throw new TypeError("Specified engine is undefined.");
    } else if (!availableEngines.includes(engine)) {
      throw new RangeError(
        `Specified engine [${engine}] is not available. ` +
          "Current available engines: " +
          availableEngines.join(", ") +
          "."
      );
    }

    if (engine === "node") {
      return process.version.replace("v", "");
    }

    try {
      return `${execSync(`${engine} -v`, { stdio: "pipe" })
        .toString()
        .replace("v", "")
        .trim()}`;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Return all of the engine versions from the running application.
   *
   * @param {Engines} [engines]
   */
  static getCurrentVersions(engines) {
    engines = engines || availableEngines;

    return Object.fromEntries(
      new Map(
        engines.map((engine) => [
          engine,
          CheckVersion.getCurrentVersion(engine),
        ])
      ).entries()
    );
  }

  /**
   * Return all of the engine versions from the running application based on the checked engines.
   */
  getCurrentVersions() {
    return CheckVersion.getCurrentVersions(this.#checkedEngines);
  }

  /**
   * Return the specified of defined version.
   *
   * @param {Engine} engine
   * @throws {TypeError}
   */
  getDefinedVersion(engine) {
    if (!Object.keys(this.#definedVersions).includes(engine)) {
      throw new TypeError(
        `Specified defined engine [${engine}] is not set up at the instance.`
      );
    }

    if (this.#definedVersions[engine] === undefined) {
      throw new TypeError(`Specified defined engine [${engine}] is undefined.`);
    }

    return this.#definedVersions[engine];
  }

  /**
   * Set defined versions of the specified engine.
   *
   * @param {Engine | Versions} engine
   * @param {Version} version
   * @throws {TypeError}
   */
  setDefinedVersions(engine, version) {
    if (typeof engine === "object") {
      for (const e in engine) {
        this.setDefinedVersions(e, engine[e]);

        return this;
      }
    }

    if (engine === undefined || version === undefined) {
      throw new TypeError(
        "Specified engine or version can not be undefined. " +
          `Given engine: ${engine} and version: ${version}.`
      );
    }

    if (!this.#checkedEngines.includes(engine)) {
      throw new TypeError(
        `Specified engine [${engine}] is not set up at the instance. ` +
          "Please re-instance this class using a new available engine: " +
          availableEngines.join(", ") +
          "."
      );
    }

    this.#definedVersions[engine] = `${version}`;

    return this;
  }

  /**
   * Set defined versions of the specified engine using application manifest on "package.json".
   *
   * @param {PackageJsonEngineProperty} [property]
   * @param {string} [filePath]
   * @throws {TypeError}
   */
  setDefinedVersionsUsingPackageJson(
    property = undefined,
    filePath = undefined
  ) {
    const json = CheckVersion.collectPackageJson(filePath);

    if (
      property !== undefined &&
      (json[property] === undefined || typeof json[property] !== "object")
    ) {
      throw new TypeError(
        `Property [${property}] on package.json is not found.`
      );
    }

    for (const engine of this.#checkedEngines) {
      if (property !== undefined) {
        this.setDefinedVersions(engine, json[property][engine]);

        continue;
      }

      for (const property of availablePackageJsonEngineProperty) {
        const version = json[property][engine];

        if (version !== undefined) {
          this.setDefinedVersions(engine, json[property][engine]);

          break;
        }
      }
    }

    return this;
  }

  /**
   * Set defined versions of the specified engine using volta configuration on "package.json".
   *
   * @param {string} [filePath]
   *
   * @see https://docs.volta.sh/reference/pin
   */
  setDefinedVersionsUsingVolta(filePath = undefined) {
    return this.setDefinedVersionsUsingPackageJson("volta", filePath);
  }

  /**
   * Set defined versions of the specified engine using nvm configuration on ".nvmrc".
   *
   * @param {string} [filePath]
   *
   * @see https://github.com/nvm-sh/nvm#nvmrc
   */
  setDefinedVersionsUsingNvmrc(filePath = undefined) {
    return this.setDefinedVersions("node", CheckVersion.collectNvmrc(filePath));
  }

  /**
   * Collect list of application manifest on "package.json".
   *
   * @param {string} [filePath]
   * @param {boolean} throwError
   * @returns {PackageJson | undefined}
   * @throws {TypeError}
   */
  static collectPackageJson(filePath = undefined, throwError = true) {
    const json = (() => {
      try {
        return require(filePath || path.join(process.cwd(), "package.json"));
      } catch (error) {
        return undefined;
      }
    })();

    if (throwError && json === undefined) {
      throw new TypeError("package.json is not found.");
    } else if (throwError && typeof json !== "object") {
      throw new TypeError("package.json format is invalid.");
    }

    return json;
  }

  /**
   * Collect nvm manifest on ".nvmrc".
   *
   * @param {string} [filePath]
   * @param {boolean} throwError
   * @throws {TypeError}
   */
  static collectNvmrc(filePath = undefined, throwError = true) {
    const file = (() => {
      try {
        return fs.readFileSync(path.join(process.cwd(), filePath || ".nvmrc"), {
          encoding: "utf8",
        });
      } catch (error) {
        return undefined;
      }
    })();

    if (throwError && file === undefined) {
      throw new TypeError(".nvmrc is not found.");
    }

    return typeof file === "string" ? file.split("\n")[0] : file;
  }

  /**
   * Determine whether the defined engine version satisfies the current version.
   *
   * @param {Engine} engine
   * @param {LogCallback} [logCallback]
   * @param {boolean | semver.RangeOptions} [optionsOrLoose]
   * @param {string | semver.Range} [current]
   * @throws {Error}
   */
  isValid(
    engine,
    logCallback = undefined,
    optionsOrLoose = undefined,
    current = undefined
  ) {
    current = current || CheckVersion.getCurrentVersion(engine);

    const defined = this.getDefinedVersion(engine);
    const result = semver.satisfies(current, defined, optionsOrLoose);

    if (logCallback !== undefined && typeof logCallback === "function") {
      logCallback(engine, current, defined, result);
    }

    return result;
  }

  /**
   * Determine whether all of the defined engine version satisfies the current version.
   *
   * @param {LogCallback} [logCallback]
   * @param {string} [filePath] Use for custom "package.json" file path.
   * @param {boolean | semver.RangeOptions} [optionsOrLoose]
   */
  validate(
    logCallback = undefined,
    filePath = undefined,
    optionsOrLoose = undefined
  ) {
    if (Object.keys(this.#definedVersions).length < 1) {
      this.setDefinedVersionsUsingPackageJson(filePath);
    }

    return Object.keys(this.#definedVersions).every((engine) =>
      this.isValid(engine, logCallback, optionsOrLoose)
    );
  }
}

module.exports = { CheckVersion };
