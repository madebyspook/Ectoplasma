# Ectoplasma

A BetterDiscord theme with a near-black palette, icy blue accents, translucent surfaces, and neon glow effects.

[Download Ectoplasma.theme.css](https://madebyspook.github.io/Ectoplasma/Ectoplasma.theme.css) · [Report a problem](https://github.com/madebyspook/Ectoplasma/issues) · [Contributing](CONTRIBUTING.md)

The theme styles live in `src/`. `npm run build` generates the installable `Ectoplasma.theme.css` remote loader and the complete hosted stylesheet at `dist/Ectoplasma.css`. The loader imports the hosted stylesheet and then supplies editable user configuration.

Shared mixins provide the existing wallpaper, glass, and glow effects. Background settings apply to chat, Friends, forums, forum editing, voice calls, and Browse Channels through the shared wallpaper mixin.

## User configuration

Download [Ectoplasma.theme.css](https://madebyspook.github.io/Ectoplasma/Ectoplasma.theme.css), place it in your BetterDiscord themes folder, and enable it. Open the downloaded file in a text editor or BetterDiscord's theme editor and find **USER CONFIGURATION** below the `@import` line. Keep that import in place.

### Accent color

Change `--spook-accent` in the configuration section. The default is `#3C86ff`; existing text, glass, and glow colors continue to derive from it.

```css
--spook-accent: #3C86ff;
```

### Background mode

Enable exactly one of the three numbered background options in the configuration section. To switch, comment out the active option's declarations with `/*` and `*/`, then remove those markers around the option you want to use. Keep the surrounding `:root { ... }` and accent setting. The examples below are declarations inside that existing block.

**1. BackgroundManager — default**

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

**3. Solid background — no BackgroundManager required**

```css
--spook-background-image: none;
--spook-background-color: none;
--spook-background-fill: color-mix(in srgb, var(--spook-accent) 6%, black 94%);
```

This sets an opaque base color of 94% black and 6% accent. Both the wallpaper and its darkening gradient are disabled. Despite its name, `--spook-background-color` holds the existing gradient, so keep its `none` override in solid mode. Existing filters and glass effects remain active and can affect the final rendered color.

BackgroundManager is optional when using custom wallpaper or solid mode. The separate macOS Vibrancy experiment is unchanged; these options configure the normal wallpaper mixin.

Save the file and inspect the result in Discord. Keep a backup: **replacing the downloaded theme file may overwrite your customizations**. The remote stylesheet can update independently of those local settings. Confirm changes in BetterDiscord; compilation is not visual verification.

Node.js, npm, and the repository source are only needed for development. `dist/Ectoplasma.css` is the hosted stylesheet, not the file to install.

```text
Ectoplasma/
├── .vscode/settings.json        # Existing editor configuration, preserved
├── src/
│   ├── main.scss               # Ordered SCSS entry point
│   ├── loader.scss             # Source for the installable remote loader
│   ├── abstracts/
│   │   ├── _configuration.scss # Shared user configuration and defaults
│   │   ├── _variables.scss
│   │   └── _mixins.scss
│   └── sections/
│       ├── _global.scss
│       ├── _application.scss
│       ├── _servers.scss
│       ├── _channels.scss
│       ├── _direct-messages.scss
│       ├── _friends.scss
│       ├── _members.scss
│       ├── _chat-headers.scss
│       ├── _chat.scss
│       ├── _composer.scss
│       ├── _forums.scss
│       ├── _forum-edit.scss
│       ├── _voice.scss
│       ├── _search.scss
│       ├── _settings.scss
│       ├── _popovers.scss
│       └── _pickers.scss
├── dist/
│   └── Ectoplasma.css           # Generated hosted stylesheet
├── Ectoplasma.theme.css         # Generated loader and editable user configuration
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
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

Compile `src/main.scss` to `dist/Ectoplasma.css` and `src/loader.scss` to `Ectoplasma.theme.css`:

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

Watch mode detects new SCSS files and continues watching after compilation errors, including errors on startup. Failed compilation leaves the last successful outputs installed. Repository outputs use atomic replacement; the installed development theme is written in place.

For development, edit SCSS rather than generated repository CSS. `src/abstracts/_configuration.scss` defines the shared configuration once; it is emitted after the hosted defaults and after the loader's import, so user settings override those defaults. Edit `src/loader.scss` for loader metadata or its import. Do not hand-edit generated repository files. Rebuilding replaces their configuration with source defaults; end users can edit their separate downloaded copy directly.

The loader and hosted stylesheet must be published together for the new background-fill setting to take effect. Until then, use the full local development theme to test changes. No additional hosting system is required.

## BetterDiscord workflow

The default destination is `~/Library/Application Support/BetterDiscord/themes/EctoplasmaDev.theme.css`. The themes folder must already exist. To select an existing theme folder explicitly, including on Windows or Linux:

```sh
npm run watch -- --dev
```

This writes the full local stylesheet to `~/Library/Application Support/BetterDiscord/themes/EctoplasmaDev.theme.css`, using the current user's home directory. The themes directory must already exist. Enable EctoplasmaDev with Ectoplasma disabled. The file continues to be written in place because atomic replacement can cause BetterDiscord to unload it. Copy failures are reported and the watcher stays running; another SCSS change retries the build and copy. Plain `npm run build` and `npm run watch` only generate repository outputs.

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
