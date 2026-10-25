# Ectoplasma

Ectoplasma is a BetterDiscord theme with a near-black palette, icy blue accents, and glass-like styling.

## Current status

The active theme is `Ectoplasma.theme.css`. The SCSS migration has **not** happened yet: `src/` contains placeholders, and `dist/Ectoplasma.css` contains only a scaffold comment. Do not install the compiled placeholder as the theme.

This setup prepares development tooling for a future migration and eventual BetterDiscord theme library submission. It does not indicate submission readiness or library approval.

## Project structure

```text
Ectoplasma/
├── .vscode/settings.json        # Existing editor configuration, preserved
├── src/
│   ├── main.scss               # Scaffold entry point
│   ├── abstracts/
│   │   ├── _variables.scss
│   │   └── _mixins.scss
│   ├── components/
│   │   ├── _glass.scss
│   │   └── _glow.scss
│   └── sections/
│       ├── _global.scss
│       ├── _application.scss
│       ├── _servers.scss
│       ├── _channels.scss
│       ├── _direct-messages.scss
│       ├── _friends.scss
│       ├── _members.scss
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
│   └── Ectoplasma.css           # Tracked build output; currently a placeholder
├── Ectoplasma.theme.css         # Active BetterDiscord theme
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

Compile the SCSS entry point to `dist/Ectoplasma.css`:

```sh
npm run build
```

Rebuild automatically when SCSS files change:

```sh
npm run watch
```

Stop the watcher with Ctrl+C. Source maps are disabled; the compiled CSS stays tracked for future public distribution.

## BetterDiscord workflow

Continue using the existing `Ectoplasma.theme.css` and your current Cursor Run on Save synchronization workflow. These npm scripts only write to `dist/Ectoplasma.css`; they do not replace or synchronize the active theme.

The checked-in `.vscode/settings.json` currently references `Spookveil` in its Run on Save command. That configuration is preserved exactly during this setup.

## License

No license has been selected or added. Choose a license before public distribution or submission. The package is private to prevent accidental npm publication; `UNLICENSED` is a tooling marker, not a license grant.
