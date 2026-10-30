# Release preparation

No release is created by these instructions or by CI. Publishing, tagging, pushing, and repository-setting changes require separate authorization. The existing GitHub Pages hosting remains in place.

## Version and artifacts

`package.json` is the production metadata source. The current version is carried forward from the existing SCSS metadata; it does not establish a published release history.

Use stable `MAJOR.MINOR.PATCH` versions: patch for compatible fixes, minor for compatible additions, and major for breaking configuration or behavior changes. Do not bump a version solely to imply unperformed testing.

On an authorized feature branch, update package and lockfile versions together, without creating a commit or tag:

```sh
npm version <version> --no-git-tag-version
npm run build
npm run release:check
```

Replace `<version>` with the agreed stable version. `release:check` runs the read-only generated-file check and tooling tests; it does not commit, tag, install a theme, publish to npm, create a release, or verify Discord compatibility.

The build generates:

- `Ectoplasma.theme.css`: the primary installable loader.
- `dist/Ectoplasma.css`: the hosted stylesheet imported by that loader.

Keep both files tracked, include regenerated outputs in the reviewed change, and retain their public filenames and URLs. The loader imports a moving stylesheet: tagging or attaching the loader to a release does **not** freeze styling or provide a reproducible rollback. Self-contained snapshots are deferred.

## Before release approval

- [ ] Run `npm ci`, `npm run build`, and `npm run release:check`.
- [ ] Review the diff for unintended selectors, declarations, variable changes, or SCSS module reordering.
- [ ] Complete and retain actual results from [TESTING.md](TESTING.md). Record tested versions and all limitations, including current wallpaper behavior.
- [ ] Resolve licensing with the owner. No license has been selected or added.
- [ ] Capture real, current, redacted Discord screenshots for the README and any future listing. No screenshot is supplied by this preparation work.
- [ ] Review installation, customization, update, and removal instructions against the candidate.
- [ ] Write release notes from the final reviewed diff and actual test results. Do not imply a prior release or validation that did not happen.
- [ ] Obtain approval for committing, pushing, opening/merging a PR, tagging, and publishing as applicable. Keep implementation work off `main`.

## After separate publishing authorization

Review and merge the candidate through the agreed branch/PR process. Verify that the existing Pages deployment has served the intended commit and both public CSS URLs return CSS with the expected contents:

- https://madebyspook.github.io/Ectoplasma/Ectoplasma.theme.css
- https://madebyspook.github.io/Ectoplasma/dist/Ectoplasma.css

Remember that a merge to the hosted branch can update installed users through the existing import before a GitHub Release is created. Coordinate that merge as a publication step.

When authorized, tag the approved commit as `v<package-version>`. CI checks tag/version agreement and build consistency but does not publish anything. A later manually created GitHub Release can attach the generated loader and reviewed release notes; keep the remote loader as the primary installation method. Do not introduce another CDN or hosting system.

BetterDiscord directory submission is separate and has its own review process. Do not claim approval or automatic in-client updating without verification. Preserve the submitted file's location and repository history. See [BetterDiscord distribution guidance](https://docs.betterdiscord.app/themes/publishing/distribution).

## GitHub presentation to apply when authorized

Prepared About values, not applied repository-setting changes:

- Description: `A near-black BetterDiscord theme with icy blue accents, translucent surfaces, and neon glow.`
- Website: `https://madebyspook.github.io/Ectoplasma/Ectoplasma.theme.css`
- Topics: `betterdiscord`, `betterdiscord-theme`, `discord-theme`, `scss`.

Add actual screenshots after capture and review, then link verified releases or an approved BetterDiscord listing when available. Do not add badges that imply published releases, licensing, or passing remote checks before those facts are established.
