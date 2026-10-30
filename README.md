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

## User configuration

Download [Ectoplasma.theme.css](https://madebyspook.github.io/Ectoplasma/Ectoplasma.theme.css), place it in your BetterDiscord themes folder, and enable it. Open the downloaded file in a text editor or BetterDiscord's theme editor and find **USER CONFIGURATION** below the `@import` line. Keep that import in place.

### Accent color

Change `--spook-accent` in the configuration section. The default is `#3C86ff`; existing text, glass, and glow colors continue to derive from it.

```css
--spook-accent: #3C86ff;
```

### Background mode

Solid mode is currently enabled in the source configuration. Enable exactly one of the three numbered background options in the configuration section. To switch, comment out the active option's declarations with `/*` and `*/`, then remove those markers around the declarations of the option you want to use. Keep the surrounding `:root { ... }` and accent setting. The examples below are declarations inside that existing block.

**1. BackgroundManager — requires BackgroundManager**

```css
--spook-background-image: var(--bgm-url);
--spook-background-fill: transparent;
```

This preserves the existing BackgroundManager integration. BackgroundManager supplies `--bgm-url`; Ectoplasma hides its global wallpaper container and uses that image in its own wallpaper-backed views. There is no automatic fallback if `--bgm-url` is undefined.

**2. Custom wallpaper — no BackgroundManager required**

```css
--spook-background-image: url("YOUR_IMAGE_URL");
--spook-background-fill: transparent;
```

Replace `YOUR_IMAGE_URL` with a direct HTTPS image URL, keeping `url("...")` intact. An image-hosting page URL is not the image itself. The existing wallpaper positioning, sizing, darkening gradient, blur, and glass effects remain in use.

**3. Solid background — current default, no BackgroundManager required**

```css
--spook-background-image: none;
--spook-background-color: none;
--spook-background-fill: oklch(from var(--spook-accent) 18% 0.02 h);
```

The current feature configuration uses an opaque OKLCH fill with 18% lightness, 0.02 chroma, and the accent hue. Both the wallpaper and its darkening gradient are disabled. Despite its name, `--spook-background-color` holds the existing gradient, so keep its `none` override in solid mode. Existing filters and glass effects remain active and can affect the final rendered color.

BackgroundManager is optional when using custom wallpaper or solid mode. The separate macOS Vibrancy experiment is unchanged; these options configure the normal wallpaper mixin.

Save the file and inspect the result in Discord. Keep a backup: **replacing the downloaded theme file may overwrite your customizations**. The remote stylesheet can update independently of those local settings. Confirm changes in BetterDiscord; compilation is not visual verification.

### Other overrides

For additional controls, use BetterDiscord Custom CSS or inspect [src/abstracts/_variables.scss](src/abstracts/_variables.scss). Keep Custom CSS overrides consistent with the mode selected in the downloaded file. Existing glass and glow controls retain their separate roles. Changing the accent or wallpaper can affect readability; inspect your chosen settings in Discord.

## Updates and removal

The loader imports a moving hosted stylesheet. Published CSS changes can reach installed copies when Discord reloads that resource; browser caching can delay them. Reload Discord if styling appears stale, then check whether GitHub Pages is reachable. Updating the import does not necessarily update the version displayed by the installed loader.

If the loader itself changes, download `Ectoplasma.theme.css` again and replace the installed copy. Back up edits to the downloaded configuration before replacing it; separate Custom CSS overrides are retained. The `@updateUrl` metadata is not a guarantee of automatic loader updates. No BetterDiscord directory approval or in-client updater support is claimed.

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

`package.json` is the sole source of production theme metadata, including version, author, and description. `src/loader.scss` emits the configuration body; the build adds metadata and the remote import before it. `npm run build` compiles `src/main.scss` and generates two tracked outputs:

- `Ectoplasma.theme.css`: the primary installable remote loader, with the existing public import URL.
- `dist/Ectoplasma.css`: the complete compiled stylesheet and matching metadata.

Edit `src/abstracts/_configuration.scss` for shared configuration, other SCSS for styling, and package metadata for theme identity. The configuration is emitted after the hosted defaults and after the loader import so local settings override imported defaults. Do not manually edit generated CSS. Expanded CSS and disabled source maps are used for both development and production; a separate minification pipeline is unnecessary here.

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
src/loader.scss          Source for the loader configuration body
src/abstracts/           Shared user configuration, CSS variables, and mixins
src/sections/            Styles grouped by Discord interface area
scripts/build.mjs        Build, consistency check, and optional dev installation
Ectoplasma.theme.css     Generated remote loader and editable configuration
dist/Ectoplasma.css      Generated hosted stylesheet
test/                   Build and watcher regression tests
docs/                   Manual testing and release preparation
.github/                CI and contribution templates
```

See [CONTRIBUTING.md](CONTRIBUTING.md), the [manual testing checklist](docs/TESTING.md), and the [release preparation guide](docs/RELEASING.md). Publish the loader and hosted stylesheet together when authorized so the background-fill setting is supported. Rebuilding repository outputs resets their configuration to source defaults; end users edit a separate downloaded copy.

CI checks builds and generated-file consistency; it does not publish releases or deploy the theme. The existing GitHub Pages setup remains responsible for hosting.

## License

No license has been chosen. Licensing remains an explicit owner decision before release preparation is completed. `private: true` prevents accidental npm publication; `UNLICENSED` is a tooling marker, not a license grant. No license or third-party artwork has been added.
