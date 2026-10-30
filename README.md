# Ectoplasma

Ectoplasma is a BetterDiscord theme with a near-black palette, icy blue accents, and glass-like styling.

## Current status

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

## Project structure

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

The existing tracked `.DS_Store` is preserved. New operating system metadata is ignored.

## Development

Prerequisites: Node.js 22 or newer and npm. Dart Sass is installed locally as a development dependency; a global Sass installation is unnecessary.

Install the locked dependencies:

```sh
npm ci
```

Compile `src/main.scss` to `dist/Ectoplasma.css` and `src/loader.scss` to `Ectoplasma.theme.css`:

```sh
npm run build
```

Rebuild automatically when SCSS files change:

```sh
npm run watch
```

Stop the watcher with Ctrl+C. The watcher polls SCSS files every 500 ms without additional dependencies. Source maps are disabled; both generated CSS files stay tracked.

`scripts/build.mjs` uses standard Dart Sass compilation. The BetterDiscord metadata header is preserved. Sass normalizes whitespace, numeric spelling, and some attribute quotes, and omits comments inside selectors; the original SCSS remains unchanged.

Watch mode detects new SCSS files and continues watching after compilation errors, including errors on startup. Failed compilation leaves the last successful outputs installed. Repository outputs use atomic replacement; the installed development theme is written in place.

For development, edit SCSS rather than generated repository CSS. `src/abstracts/_configuration.scss` defines the shared configuration once; it is emitted after the hosted defaults and after the loader's import, so user settings override those defaults. Edit `src/loader.scss` for loader metadata or its import. Do not hand-edit generated repository files. Rebuilding replaces their configuration with source defaults; end users can edit their separate downloaded copy directly.

The loader and hosted stylesheet must be published together for the new background-fill setting to take effect. Until then, use the full local development theme to test changes. No additional hosting system is required.

## BetterDiscord workflow

On macOS, opt into automatic installation after every successful watch build:

```sh
npm run watch -- --dev
```

This writes the full local stylesheet to `~/Library/Application Support/BetterDiscord/themes/EctoplasmaDev.theme.css`, using the current user's home directory. The themes directory must already exist. Enable EctoplasmaDev with Ectoplasma disabled. The file continues to be written in place because atomic replacement can cause BetterDiscord to unload it. Copy failures are reported and the watcher stays running; another SCSS change retries the build and copy. Plain `npm run build` and `npm run watch` only generate repository outputs.

The existing editor Run on Save configuration is unchanged. Automatic installation with the flag above requires no editor save or copy step.

Verify the installed theme in BetterDiscord after building; compilation and source comparisons do not constitute visual testing.

## License

No license has been selected or added. Choose a license before public distribution or submission. The package is private to prevent accidental npm publication; `UNLICENSED` is a tooling marker, not a license grant.
