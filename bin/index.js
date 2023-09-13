#!/usr/bin/env node

const chalk = require("chalk");
const nodeCheck = require("../src/index.js");

const terminalArguments = require("minimist")(process.argv.slice(2));

(function () {
  console.info("🏁 Version checking started.");
  console.info("=============================");

  const packageJson = nodeCheck.collectPackageJson();

  const engines = [
    ...new Set((terminalArguments["engines"] || "node").split(",")),
  ];

  const engineStatuses = engines.map((engine) => {
    function log() {
      console.info(
        `   Expected: ${
          packageJson.engines[engine]
        } <==> Current: ${nodeCheck.getCurrentVersion(engine)}`
      );
    }

    /**
     * @param {string} icon
     * @param {string} description
     */
    function message(icon, description) {
      return `${icon} ${engine} version is ${description}.`;
    }

    if (!nodeCheck.checkVersion(engine, packageJson.engines[engine])) {
      console.info(message("❌", chalk.red("not okay")));
      log();

      return false;
    } else {
      console.info(message("✅", chalk.green("okay")));
      log();

      return true;
    }
  });

  console.info("=============================");
  console.info("✨ Version checking finished.");

  process.exit(engineStatuses.some((status) => !status) ? 1 : 0);
})();
