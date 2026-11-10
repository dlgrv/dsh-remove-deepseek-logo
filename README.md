---
description: "Remove the DeepSeek logo, version string, and the conversation hero fish from the DSH sidebar."
kind: "package-bundle"
---

# remove-deepseek-logo

A tiny DeepSeek Harness (DSH) plugin that makes the sidebar yours: no whale mark,
no brand wordmark, no version string — and no animated
fish in an empty conversation. The logo row collapses completely, so the sidebar
starts right at the toggle and the New Session button.

English | [Русский](#readme-russian)

## How it works

- Registers empty occupants into the `sidebar.brand.mark` and `sidebar.brand.name`
  slots (the same mechanism the official brand package uses), so both the official
  branding and the local-build fallback disappear.
- Registers an empty occupant into the `conversation.hero.brand.mark` slot, which
  replaces the animated hero fish.
- Adds a small safety-net stylesheet that hides the the version
  string, any fish fallback, and collapses the now-empty logo row. Attribute
  selectors survive CSS-hash changes between app versions.

No host-side behavior is touched; the plugin changes nothing about model requests,
sessions, or tools.

## Install

From npm (**recommended**):

```sh
npm i remove-deepseek-logo
```

or in DSH **Settings → Plugins → Add plugin**, enter `remove-deepseek-logo`
(npm name) or:

```
github:dlgrv/remove-deepseek-logo
```

then add `remove-deepseek-logo` to `dsh.profile.bundles` in your profile's
`package.json`. Restart the application to apply.

## Uninstall

Remove the bundle from your profile (toggle it off on the Plugins page) and
uninstall the package. The original branding returns after a restart.

## License

MIT
