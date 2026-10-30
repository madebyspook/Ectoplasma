# Ectoplasma — Agent Instructions

Ectoplasma is a BetterDiscord theme with dark translucent surfaces, customizable accents, and neon glow effects. Preserve its existing appearance and functionality unless the user explicitly requests a visual change.

## Source and distribution

- `src/main.scss` is the authoritative, ordered SCSS entry point. Preserve its module order.
- `src/abstracts/` holds CSS custom properties and shared Sass mixins.
- `src/sections/` groups styles by Discord interface area.
- `package.json` supplies production metadata. Its version must match the package lockfile.
- `scripts/build.mjs` generates the root `Ectoplasma.theme.css` remote loader and `dist/Ectoplasma.css` hosted stylesheet. Never edit either CSS output manually.
- Preserve the remote-loader architecture, public filenames, and existing GitHub Pages URLs. A release tag does not freeze the remote stylesheet.

## Styling boundaries

- Keep changes small and scoped to the requested interface area. Preserve selectors, declaration order, specificity, `!important`, and existing behavior unless changes are explicitly authorized.
- Preserve all `--spook-*` names and intentionally separate styling and diagnostic variables. Similar values do not make controls interchangeable.
- Reuse existing mixins when they meaningfully reduce duplication; avoid abstractions solely to reduce line count.
- Preserve BackgroundManager integration, wallpaper variables, and existing no-fallback behavior unless that work is explicitly requested.
- Do not fix suspected selectors or change visual effects speculatively. Confirm behavior in Discord first.

## Tooling and validation

- Use the existing local Dart Sass dependency; do not introduce dependencies without a clear benefit.
- Run `npm run build` after source, metadata, or build changes, then `npm run check` and `npm test` as appropriate.
- Compare compiled styling with a fresh baseline for changes that must preserve appearance. Ignore only metadata/comment differences; preserve selectors, declarations, and cascade order.
- `npm run check` is read-only. It must detect missing/stale generated outputs and version mismatches.
- Build/watch without `--dev` must not install files outside the repository.
- The installed `EctoplasmaDev.theme.css` must be written **in place**, never with an atomic rename. BetterDiscord can unload atomically replaced development themes. Repository outputs may use atomic replacement.
- Use temporary fixtures for tooling tests, never the user's real BetterDiscord folder.
- Follow `docs/TESTING.md` for manual checks. Do not claim runtime compatibility or visual verification without actual Discord testing.

## Documentation and delivery

- Keep installation instructions separate from contributor setup. Document current behavior and limitations accurately.
- Keep `CONTRIBUTING.md`, issue templates, and `docs/RELEASING.md` consistent with supported commands.
- Do not invent screenshots, compatibility results, release notes, or release history.
- Do not choose or add a license. Leave licensing as an explicit owner decision.
- Work on a descriptive branch for implementation work; never commit or push directly to `main`.
- Do not commit, push, open a pull request, tag, merge, create a GitHub Release, or publish unless explicitly requested.
- Do not change Git configuration, repository settings, or hosting settings without permission. Preserve unrelated work and local editor configuration.

When handing off, state what changed, the important decisions, validation performed, and remaining manual steps. Distinguish automated checks from Discord testing. Ask before a decision that would significantly affect appearance, architecture, or behavior.
