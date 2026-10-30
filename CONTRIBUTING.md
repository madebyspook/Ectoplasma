# Contributing to Ectoplasma

Keep changes focused and preserve the existing appearance unless a visual change is the purpose of the proposal. Licensing has not yet been decided; contribution and reuse terms remain outstanding.

## Work locally

Use Node.js 22 or newer and npm, then create a descriptive branch from the current default branch. Avoid direct commits to `main`.

```sh
npm ci
npm run build
npm run check
npm test
```

Edit `src/` for styling. Preserve the order in `src/main.scss`, existing selectors, `--spook-*` properties, and intentionally separate styling and diagnostic controls. Keep BackgroundManager and wallpaper behavior unchanged unless the proposal explicitly addresses them. Shared mixins live in `src/abstracts/_mixins.scss`; new abstraction layers and dependencies need a concrete benefit.

Generated CSS is tracked. Run the build and include the resulting loader and stylesheet changes when appropriate; do not edit generated files manually. Production metadata belongs in `package.json`. See [release preparation](docs/RELEASING.md) before changing the version.

## Test the change

Use `npm run watch` for repository output only. For a separate local development theme, use `npm run watch -- --dev` on macOS or specify an existing folder with `--themes-dir`. See the [README](README.md#watch-and-local-testing) for exact commands and installation behavior.

Disable other full themes while testing and enable only the intended Ectoplasma theme. Do not enable Ectoplasma and EctoplasmaDev together. The development theme must continue to be written in place; atomic replacement has caused BetterDiscord to unload it.

Follow [docs/TESTING.md](docs/TESTING.md). For appearance-preserving work, compare a fresh compiled baseline and verify affected views in Discord. A build or CSS comparison does not establish runtime compatibility.

## Report problems

Use the [issue templates](https://github.com/madebyspook/Ectoplasma/issues/new/choose). Include steps to reproduce, expected and actual behavior, a screenshot where useful, theme version, Discord/BetterDiscord versions, OS, appearance settings, and other enabled themes/plugins. Redact personal information from screenshots and logs.

## Prepare a review

Describe the concrete problem and resulting behavior. Keep unrelated formatting, selector changes, and refactoring out of the patch. State which automated checks passed, which views were tested in Discord, and anything still unverified. Include real screenshots for visual changes when available.

Do not add screenshots, release notes, or compatibility claims that have not been verified. Do not introduce a license without the owner's decision. Commit, push, open a pull request, or publish only when authorized by the task.
