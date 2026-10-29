# Ectoplasma

Ectoplasma is a BetterDiscord theme with a near-black palette, icy blue accents, and glass-like styling.

## Current status

The theme styles live in `src/`. `npm run build` generates the complete installable `Ectoplasma.theme.css` and an identical `dist/Ectoplasma.css` copy.

This is a structural migration: the original CSS regions, selectors, declarations, custom properties, and comments remain in their original order. No mixins or nesting have been introduced.

## Project structure

```text
Ectoplasma/
├── .vscode/settings.json        # Existing editor configuration, preserved
├── src/
│   ├── main.scss               # Ordered SCSS entry point
│   ├── abstracts/
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
│   └── Ectoplasma.css           # Generated copy of the installable theme
├── Ectoplasma.theme.css         # Generated BetterDiscord theme
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

Compile the SCSS entry point to `Ectoplasma.theme.css` and `dist/Ectoplasma.css`:

```sh
npm run build
```

Rebuild automatically when SCSS files change:

```sh
npm run watch
```

Stop the watcher with Ctrl+C. The watcher polls SCSS files every 500 ms without additional dependencies. Source maps are disabled; both generated CSS files stay tracked.

`scripts/build.mjs` uses standard Dart Sass compilation. The BetterDiscord metadata header is preserved. Sass normalizes whitespace, numeric spelling, and some attribute quotes, and omits comments inside selectors; the original SCSS remains unchanged.

Watch mode detects new SCSS files and continues watching after compilation errors, including errors on startup. Failed compilation leaves the last successful outputs installed. Each output is published with an atomic rename after compilation succeeds.

Edit the SCSS partials rather than the generated CSS files.

## BetterDiscord workflow

On macOS, opt into automatic installation after every successful watch build:

```sh
npm run watch -- --betterdiscord
```

This writes to `~/Library/Application Support/BetterDiscord/themes/Ectoplasma.theme.css`, using the current user's home directory. The themes directory is created if needed. Copy failures are reported and the watcher stays running; another SCSS change retries the build and copy. The flag is rejected outside macOS or without watch mode. Plain `npm run build` and `npm run watch` only generate repository outputs.

The existing editor Run on Save configuration is unchanged. Automatic installation with the flag above requires no editor save or copy step.

Verify the installed theme in BetterDiscord after building; compilation and source comparisons do not constitute visual testing.

## License

No license has been selected or added. Choose a license before public distribution or submission. The package is private to prevent accidental npm publication; `UNLICENSED` is a tooling marker, not a license grant.
