const { execSync } = require("child_process");
const { CheckVersion } = require("../src/CheckVersion.js");

it("return node current version", () => {
  expect(new CheckVersion(["node"]).getCurrentVersions().node).toBe(
    process.version.replace("v", "")
  );
});

it("return npm current version", () => {
  expect(new CheckVersion(["npm"]).getCurrentVersions().npm).toBe(
    execSync("npm -v").toString().trim()
  );
});

it("return yarn current version", () => {
  expect(new CheckVersion(["yarn"]).getCurrentVersions().yarn).toBe(
    execSync("yarn -v").toString().trim()
  );
});

it("return npx current version", () => {
  expect(new CheckVersion(["npx"]).getCurrentVersions().npx).toBe(
    execSync("npx -v").toString().trim()
  );
});

it("throws error when the selected engine is unknown", () => {
  expect(
    () =>
      new CheckVersion(["unknown engine"]).getCurrentVersions()[
        "unknown engine"
      ]
  ).toThrowError("Specified engine [unknown engine] is not available.");
});
