# Node.js Check Version

[![Node Version][node-version-image]][node-version-url]
[![NPM Version][npm-version-image]][npm-version-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]
[![Build Status][build-status-image]][build-status-url]
[![Coverage Status][coverage-status-image]][coverage-status-url]
[![License][license-image]][license-url]

Make sure that the [nodejs][node-url], [npm][npm-url], [yarn][yarn-url], [pnpm][pnpm-url], or [npx][npx-url] installed version run is the same as the version defined in your package.json.

## Table of Contents

- [Node.js Check Version](#nodejs-check-version)
  - [Table of Contents](#table-of-contents)
  - [Requirement](#requirement)
  - [Installation](#installation)
  - [Command Line Usage](#command-line-usage)
  - [Testing](#testing)
  - [Changelog](#changelog)
  - [License](#license)
  - [Credits](#credits)

## Requirement

- Node.js ^14.21.3 || >=16.0.0

## Installation

You can install the project through <https://www.npmjs.com> :

```bash
npm install @ianriizky/node-check-version
```

## Command Line Usage

```txt
SYNOPSIS
      node-check-version [OPTIONS]

DESCRIPTION
      node-check-version will make sure that the nodejs, npm,
      yarn, pnpm, or npx installed version run is the same
      as the version defined in your package.json.

      Information about the defined and installed version
      will be printed. The program will exit with an
      error code if the defined version does not
      satisfy the installed version.

OPTIONS

      --node=VERSION
            Check that the defined node version matches the given semver
            version range.

      --npm=VERSION
            Check that the defined npm version matches the given semver
            version range.

      --yarn VERSION
            Check that the defined yarn version matches the given semver
            version range.

      --pnpm VERSION
            Check that the current pnpm version matches the given semver
            version range.

      --npx VERSION
            Check that the defined npx version matches the given semver
            version range.

      --package
            Use the "engines" key in the defined package.json for the
            semver version ranges.

      --volta
            Use the versions pinned by Volta in the package.json

      -p, --print
            Print installed versions.

      -h, --help
            Print this message.
```

## Testing

```bash
npm run test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

## Credits

| Role   | Name                                                     |
| ------ | -------------------------------------------------------- |
| Author | [Septianata Rizky Pratama](https://github.com/ianriizky) |

[node-version-image]: https://badgen.net/npm/node/@ianriizky/node-check-version
[node-version-url]: https://www.npmjs.com/package/@ianriizky/node-check-version
[npm-version-image]: https://badgen.net/npm/v/@ianriizky/node-check-version
[npm-version-url]: https://www.npmjs.com/package/@ianriizky/node-check-version
[npm-install-size-image]: https://packagephobia.com/badge?p=@ianriizky/node-check-version
[npm-install-size-url]: https://packagephobia.com/result?p=@ianriizky/node-check-version
[npm-downloads-image]: https://badgen.net/npm/dw/@ianriizky/node-check-version
[npm-downloads-url]: https://npmcharts.com/compare/@ianriizky/node-check-version?minimal=true
[build-status-image]: https://github.com/ianriizky/node-check-version/actions/workflows/nodejs-ci.yml/badge.svg
[build-status-url]: https://github.com/ianriizky/node-check-version/actions
[coverage-status-image]: https://codecov.io/gh/ianriizky/node-check-version/branch/main/graph/badge.svg
[coverage-status-url]: https://codecov.io/gh/ianriizky/node-check-version
[license-image]: https://badgen.net/npm/license/@ianriizky/node-check-version
[license-url]: LICENSE.md
[node-url]: http://nodejs.org
[npm-url]: https://www.npmjs.com
[yarn-url]: https://yarnpkg.com
[pnpm-url]: https://pnpm.io
[npx-url]: https://www.npmjs.com/package/npx
