const chalk = require("chalk");
const fs = require("fs");
const minimist = require("minimist");
const path = require("path");
const { CheckVersion } = require("./CheckVersion.js");

/**
 * @typedef {{
 *   print: boolean,
 *   p: boolean,
 *   help: boolean,
 *   h: boolean,
 *   'using-volta': boolean,
 *   'using-package': boolean,
 * } & import("./CheckVersion.js").Versions & minimist.ParsedArgs} Argv
 */
class Terminal {
  /** @type {Argv} */
  #argv;

  constructor() {
    this.#argv = this.#parseTerminalArguments();
  }

  /**
   * @returns {Argv}
   */
  #parseTerminalArguments() {
    return minimist(process.argv.slice(2), {
      boolean: ["print", "help", "using-volta", "using-package"],
      string: CheckVersion.availableEngines,
      default: {
        print: true,
        "using-package": true,
      },
      alias: {
        print: "p",
        help: "h",
      },
      unknown: function (arg) {
        console.error(`Unknown option: ${arg}`);

        process.exit(1);
      },
    });
  }

  createCheckVersionInstance() {
    const engines = CheckVersion.availableEngines.filter(
      (engine) => this.#argv[engine]
    );

    if (engines.length > 0) {
      const version = new CheckVersion(engines);

      for (const engine of engines) {
        version.setDefinedVersions(engine, this.#argv[engine]);
      }

      return version;
    }

    if (this.#argv["using-volta"]) {
      return new CheckVersion(
        Object.keys(CheckVersion.collectPackageJson().volta)
      ).setDefinedVersionsUsingVolta();
    }

    if (this.#argv["using-package"]) {
      return new CheckVersion(
        Object.keys(CheckVersion.collectPackageJson().engines)
      ).setDefinedVersionsUsingPackageJson();
    }

    return new CheckVersion();
  }

  run() {
    if (this.#argv.help) {
      this.printHelp();
    } else {
      this.validate();
    }
  }

  printHelp() {
    const help = fs.readFileSync(path.join(__dirname, "../bin/help.txt"), {
      encoding: "utf8",
    });

    process.stdout.write(help);
    process.exit(0);
  }

  validate() {
    const logCallback = this.#argv["print"]
      ? (engine, currentVersion, definedVersion, isValid) => {
          function log() {
            console.info(
              `   Expected: ${definedVersion} <==> Current: ${currentVersion}`
            );
          }

          /**
           * @param {string} icon
           * @param {string} description
           */
          function message(icon, description) {
            return `${icon} ${engine} version is ${description}.`;
          }

          if (!isValid) {
            console.info(message("❌", chalk.red("not okay")));
          } else {
            console.info(message("✅", chalk.green("okay")));
          }

          log();
          return isValid;
        }
      : undefined;

    const code = this.createCheckVersionInstance().validate(logCallback)
      ? 0
      : 1;

    return process.exit(code);
  }
}

module.exports = { Terminal };
