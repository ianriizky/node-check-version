const nodeCheck = require("../src/index.js");

test("read package.json automatically", () => {
  expect(nodeCheck.checkVersionsFromPackageJson()).toBe(true);
});

test("read package.json manually", () => {
  expect(nodeCheck.checkVersionsFromPackageJson("../package.json")).toBe(true);
});

it("throws error when package.json is missing", () => {
  expect(() =>
    nodeCheck.checkVersionsFromPackageJson("../packages.json")
  ).toThrowError("package.json is not available.");
});

it("throws error when engines property in package.json is missing", () => {
  expect(() => nodeCheck.checkVersionsFromPackageJson({})).toThrowError(
    "Property [engines] in package.json is not available."
  );
});
