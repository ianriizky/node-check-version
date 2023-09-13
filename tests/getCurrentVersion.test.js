const { execSync } = require("child_process");
const nodeCheck = require("../src/index.js");

it("return node current version", () => {
  expect(nodeCheck.getCurrentVersion("node")).toBe(process.version);
});

it("return npm current version", () => {
  expect(nodeCheck.getCurrentVersion("npm")).toBe(
    `v${execSync("npm -v").toString().trim()}`
  );
});

it("return yarn current version", () => {
  expect(nodeCheck.getCurrentVersion("yarn")).toBe(
    `v${execSync("yarn -v").toString().trim()}`
  );
});

it("throws error when the selected engine is pnpm", () => {
  expect(() => nodeCheck.getCurrentVersion("pnpm")).toThrowError(
    "Specified engine [pnpm] is not available."
  );
});
