# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-11-14

### Changed

- Removed the badge row from the README.

## [1.1.0] - 2026-11-14

### Added

- Idempotent style injection: a repeated plugin load no longer duplicates the stylesheet.
- Startup diagnostics: if no branding elements are found three seconds after load, the plugin logs a console warning that the DSH UI may have changed.
- `engines.node >= 20` requirement in package.json.
- CI check that the `npm pack` archive contains every shipped file.

### Changed

- Moved the stars badge to the end of the README badge row; added license and DSH version badges.

## [1.0.5] - 2026-11-13

### Changed

- Hide the hero headline and the preview badge above the input.

## [1.0.4] - 2026-11-12

### Changed

- Switched to CSS-only hiding after slot registration hit a single-slot conflict.

## [1.0.0] - 2026-11-10

### Added

- Initial release as `remove-deepseek-logo`: hides the DSH sidebar branding, version string, and hero fish.

[1.1.1]: https://github.com/dlgrv/dsh-remove-deepseek-logo/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/dlgrv/dsh-remove-deepseek-logo/compare/1.0.5...1.1.0
[1.0.5]: https://github.com/dlgrv/dsh-remove-deepseek-logo/compare/1.0.4...1.0.5
[1.0.4]: https://github.com/dlgrv/dsh-remove-deepseek-logo/compare/1.0.0...1.0.4
[1.0.0]: https://github.com/dlgrv/dsh-remove-deepseek-logo/releases/tag/1.0.0
