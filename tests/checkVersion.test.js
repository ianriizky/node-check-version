const { execSync } = require("child_process");
const packageJson = require("../package.json");
const nodeCheck = require("../src/index.js");

it("satisfies the current version of node", () => {
  expect(nodeCheck.checkVersion("node", packageJson.engines.node)).toBe(true);
});

it("satisfies the current version of npm", () => {
  expect(
    nodeCheck.checkVersion("npm", `v${execSync("npm -v").toString().trim()}`)
  ).toBe(true);
});

it("satisfies the current version of yarn", () => {
  expect(
    nodeCheck.checkVersion("yarn", `v${execSync("yarn -v").toString().trim()}`)
  ).toBe(true);
});

it("throws error when the selected engine is pnpm", () => {
  expect(() => nodeCheck.checkVersion("pnpm")).toThrowError(
    "Specified engine [pnpm] is not available."
  );
});
