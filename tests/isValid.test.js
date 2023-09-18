const { execSync } = require("child_process");
const packageJson = require("../package.json");
const { CheckVersion } = require("../src/CheckVersion.js");

it("satisfies the current version of node", () => {
  expect(
    new CheckVersion(["node"])
      .setDefinedVersions("node", packageJson.engines.node)
      .isValid("node", undefined, undefined, process.version)
  ).toBe(true);
});

it("satisfies the current version of npm", () => {
  const version = `v${execSync("npm -v").toString().trim()}`;

  expect(
    new CheckVersion(["npm"])
      .setDefinedVersions("npm", version)
      .isValid("npm", undefined, undefined, version)
  ).toBe(true);
});

it("satisfies the current version of yarn", () => {
  const version = `v${execSync("yarn -v").toString().trim()}`;

  expect(
    new CheckVersion(["yarn"])
      .setDefinedVersions("yarn", version)
      .isValid("yarn", undefined, undefined, version)
  ).toBe(true);
});

it("satisfies the current version of npx", () => {
  const version = `v${execSync("npx -v").toString().trim()}`;

  expect(
    new CheckVersion(["npx"])
      .setDefinedVersions("npx", version)
      .isValid("npx", undefined, undefined, version)
  ).toBe(true);
});

it("throws error when the selected engine is unknown", () => {
  expect(() =>
    new CheckVersion(["unknown engine"]).isValid("unknown engine")
  ).toThrowError(
    `Specified engine [unknown engine] is not available. Current available engines: node, npm, yarn, pnpm, npx.`
  );
});
