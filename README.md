# Ectoplasma

A BetterDiscord theme with a near-black palette, icy blue accents, translucent surfaces, and neon glow effects.

[Download Ectoplasma.theme.css](https://madebyspook.github.io/Ectoplasma/Ectoplasma.theme.css) · [Report a problem](https://github.com/madebyspook/Ectoplasma/issues) · [Contributing](CONTRIBUTING.md)

## Install

1. Install [BetterDiscord](https://betterdiscord.app/) if needed.
2. Download **Ectoplasma.theme.css** using the link above. Save the CSS file itself, keeping that filename; avoid a `.txt` or `.html` extension.
3. In Discord, open **User Settings → BetterDiscord → Themes → Open Themes Folder** and put the file there.
4. Enable **Ectoplasma**. Disable other full themes and **EctoplasmaDev** while testing it.

Node.js, npm, and the repository source are only needed for development. `dist/Ectoplasma.css` is the hosted stylesheet, not the file to install.

The installed theme loads its styling from [the hosted CSS](https://madebyspook.github.io/Ectoplasma/dist/Ectoplasma.css). It needs access to GitHub Pages; an import failure can leave Discord largely unthemed. Successful builds do not establish runtime compatibility. Tested environments and visual results must be recorded using the [manual checklist](docs/TESTING.md).

## Customize

Add overrides to **BetterDiscord → Custom CSS** and save/apply them. This keeps your preferences separate from downloaded theme files. For example:

```css
:root {
  --spook-accent: #3C86ff;
  --spook-glass-border-radius: 12px;
}
```

| Variable | Current default | Purpose |
| --- | --- | --- |
| `--spook-accent` | `#3C86ff` | Accent used to derive text, surfaces, and glow colors. |
| `--spook-glass-border-radius` | `12px` | Rounding used by shared glass panels. |
| `--spook-glass-filter` | `blur(8px) saturate(1.25)` | Wallpaper filtering and panel backdrop filtering. |
| `--spook-background-image` | `var(--bgm-url)` | Wallpaper image supplied through the BackgroundManager integration. |

Other existing controls are in [src/abstracts/_variables.scss](src/abstracts/_variables.scss). Text, glass, and glow controls have different roles even where values look similar. Changing the accent or wallpaper can affect readability; inspect your chosen settings in Discord.

### Current wallpaper behavior

Ectoplasma reads `--bgm-url`, supplied externally by BackgroundManager, through `--spook-background-image`. It hides BackgroundManager's global `.BGM-bg_container` and uses the image in its own wallpaper layers. Ectoplasma does not install or configure BackgroundManager.

There is currently no fallback for an undefined `--bgm-url`. Without BackgroundManager or an explicit user override, the wallpaper `background-image` declaration cannot resolve. Standalone wallpaper behavior and fallback handling are outstanding work. This repository does not claim that the default appearance without BackgroundManager has been visually verified.

## Updates and removal

The loader imports a moving hosted stylesheet. Published CSS changes can reach installed copies when Discord reloads that resource; browser caching can delay them. Reload Discord if styling appears stale, then check whether GitHub Pages is reachable. Updating the import does not necessarily update the version displayed by the installed loader.

If the loader itself changes, download `Ectoplasma.theme.css` again and replace the installed copy. Keep your preferences in Custom CSS. The `@updateUrl` metadata is not a guarantee of automatic loader updates. No BetterDiscord directory approval or in-client updater support is claimed.

To uninstall, disable Ectoplasma and remove `Ectoplasma.theme.css` from the theme folder. Remove any Ectoplasma-specific Custom CSS overrides you added. If you used the development theme, disable and remove `EctoplasmaDev.theme.css` too.

For blank or unexpected styling, check the filename, hosted CSS access, other enabled themes, your Custom CSS, and the wallpaper behavior above. Include relevant details in a [bug report](https://github.com/madebyspook/Ectoplasma/issues/new/choose).

## Development

Use Node.js **22 or newer** and npm. Dart Sass is the only direct development dependency and is installed locally.

```sh
npm ci
npm run build
npm run check
npm test
```

`package.json` is the source of production theme metadata, including version, author, and description. `npm run build` compiles `src/main.scss` and generates two tracked outputs:

- `Ectoplasma.theme.css`: the primary installable remote loader, with the existing public import URL.
- `dist/Ectoplasma.css`: the complete compiled stylesheet and matching metadata.

Edit SCSS for styling and package metadata for theme identity. Do not manually edit generated CSS. Expanded CSS and disabled source maps are used for both development and production; a separate minification pipeline is unnecessary here.

`npm run check` compiles in memory and fails if either generated output is missing or stale, or if package and lockfile versions disagree. It does not write files. `npm test` exercises build and watcher behavior in temporary directories without touching your installed theme.

### Watch and local testing

```sh
npm run watch
```

This rebuilds repository outputs when SCSS files or package metadata change, polling every 500 ms. It detects added and deleted SCSS files. Compilation errors leave the last successful outputs in place and watching continues. Fix the error and save a watched file to retry. Restart the watcher after editing the build script. Stop it with Ctrl+C.

On macOS, opt into updating a separate local development theme:

```sh
npm run watch -- --dev
```

The default destination is `~/Library/Application Support/BetterDiscord/themes/EctoplasmaDev.theme.css`. The themes folder must already exist. To select an existing theme folder explicitly, including on Windows or Linux:

```sh
npm run watch -- --dev --themes-dir "/absolute/path/to/BetterDiscord/themes"
```

Enable **EctoplasmaDev** and disable **Ectoplasma** to test local changes without waiting for hosting. The dev file contains the full local stylesheet, a single development header, and no production update URL. It is written **in place** because replacing the file atomically can make BetterDiscord unload it. Repository outputs use atomic replacement.

Installation errors are reported and the watcher keeps running; save a watched file after correcting the problem to retry. Invalid options or a missing theme folder at startup fail immediately. `--dev` requires watch mode; the old documented `--betterdiscord` flag is unsupported and rejected. Plain build/watch never install into BetterDiscord.

### Repository layout

```text
src/main.scss            Ordered SCSS entry point
src/abstracts/           CSS custom properties and shared Sass mixins
src/sections/            Styles grouped by Discord interface area
scripts/build.mjs        Build, consistency check, and optional dev installation
Ectoplasma.theme.css     Generated installable remote loader
dist/Ectoplasma.css      Generated hosted stylesheet
test/                   Build and watcher regression tests
docs/                   Manual testing and release preparation
.github/                CI and contribution templates
```

See [CONTRIBUTING.md](CONTRIBUTING.md), the [manual testing checklist](docs/TESTING.md), and the [release preparation guide](docs/RELEASING.md). CI checks builds and generated-file consistency; it does not publish releases or deploy the theme. The existing GitHub Pages setup remains responsible for hosting.

## License

No license has been chosen. Licensing remains an explicit owner decision before release preparation is completed. `private: true` prevents accidental npm publication; `UNLICENSED` is a tooling marker, not a license grant. No license or third-party artwork has been added.
