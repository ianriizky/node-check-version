const semver = require("semver");
const { CheckVersion } = require("../src/CheckVersion.js");

test("read package.json automatically", () => {
  expect(
    new CheckVersion().setDefinedVersionsUsingPackageJson("engines").validate()
  ).toBe(true);
});

test("read package.json automatically with volta", () => {
  if (semver.satisfies(process.version, "^14")) {
    expect(new CheckVersion().setDefinedVersionsUsingVolta().validate()).toBe(
      true
    );
  }
});

test("read package.json automatically with nvm", () => {
  if (semver.satisfies(process.version, "^14")) {
    expect(new CheckVersion().setDefinedVersionsUsingNvmrc().validate()).toBe(
      true
    );
  }
});

test("read package.json manually", () => {
  expect(
    new CheckVersion()
      .setDefinedVersionsUsingPackageJson("engines", "../package.json")
      .validate()
  ).toBe(true);
});

test("read package.json manually with volta", () => {
  if (semver.satisfies(process.version, "^14")) {
    expect(
      new CheckVersion()
        .setDefinedVersionsUsingVolta("../package.json")
        .validate()
    ).toBe(true);
  }
});

test("read package.json manually with nvm", () => {
  if (semver.satisfies(process.version, "^14")) {
    expect(
      new CheckVersion().setDefinedVersionsUsingNvmrc("../.nvmrc").validate()
    ).toBe(true);
  }
});

it("throws error when package.json is missing", () => {
  expect(() =>
    new CheckVersion()
      .setDefinedVersionsUsingPackageJson("engines", "../packages.json")
      .validate()
  ).toThrowError("package.json is not found.");
});
