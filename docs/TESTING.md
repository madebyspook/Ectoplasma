# Manual testing checklist

This is an uncompleted checklist, not evidence of compatibility. Record actual results for each release candidate. Mark untested items as **Not tested** and failures as **Fail**, with details.

## Record the environment

| Field | Result |
| --- | --- |
| Date and tester | Not recorded |
| Source commit and theme version | Not recorded |
| Discord version and channel | Not recorded |
| BetterDiscord version | Not recorded |
| OS and version | Not recorded |
| Appearance mode, zoom, and scaling | Not recorded |
| Hardware acceleration and relevant accessibility settings | Not recorded |
| BackgroundManager version/configuration, if used | Not recorded |
| Other enabled plugins, themes, and Custom CSS | Not recorded |

## Automated preparation

- [ ] Run `npm ci`, `npm run build`, `npm run check`, and `npm test`.
- [ ] Confirm generated CSS has no unintended styling changes against a fresh baseline.
- [ ] For a hosted candidate, record the deployed commit separately from the installed loader version: the import is a moving URL.

## Installation and configuration

- [ ] Download the actual `Ectoplasma.theme.css` file; verify it appears in BetterDiscord and displays the expected loader metadata.
- [ ] Enable it with other full themes disabled. Confirm the hosted stylesheet loads; note network/cache failures separately from styling defects.
- [ ] Inspect installation without BackgroundManager or custom wallpaper configuration. Record the current behavior; there is no `--bgm-url` fallback. Do not assume a standalone wallpaper baseline.
- [ ] With BackgroundManager enabled, inspect the existing wallpaper integration and hidden global BackgroundManager layer.
- [ ] Apply a Custom CSS accent override, check affected text/surfaces/glow, then remove it.
- [ ] Test disabling, reenabling, reloading, replacing the loader, and uninstalling. Confirm removal of theme-specific Custom CSS where applicable.

## Interface coverage

- [ ] Server list: selection, unread indicators, notification badges.
- [ ] Channels: categories, hover/selection, unread indicators, action icons.
- [ ] DMs, Friends, pending requests, and member lists.
- [ ] Chat: text hierarchy, links, mentions, replies, threads, reactions, unread divider, embeds, polls, code blocks, and blockquotes.
- [ ] Composer: placeholder, text, attachments, reply bar, and action buttons.
- [ ] Forums, forum editing, Browse Channels, and voice-channel text chat.
- [ ] Voice/video calls, participant names, and relevant controls.
- [ ] Settings, dialogs, context menus, tooltips, search, and emoji/sticker/GIF pickers.
- [ ] Narrow windows, larger text, and relevant display scaling.

## Accessibility and performance

- [ ] Keyboard focus remains visible, especially in picker search fields; core controls remain reachable.
- [ ] Readability, status distinctions, destructive actions, mentions, and unread indicators remain clear.
- [ ] Inspect relevant accessibility settings, including reduced motion and saturation. Record limitations without assuming support.
- [ ] Check scrolling, large chats, picker interaction, and calls for noticeable rendering lag with current blur/glow settings.

## Local development workflow

- [ ] Enable EctoplasmaDev with the production theme disabled. Save a local SCSS change and confirm the installed dev theme updates without unloading. Restore the change afterward.
- [ ] Confirm a Sass error leaves the previous installed theme in place and a subsequent corrected save recovers.
- [ ] Restore all test overrides, theme selection, and local settings.

For each failed item, record the view, reproduction steps, expected/actual result, relevant configuration, and a redacted screenshot if useful. Investigate suspected selectors and visual defects separately; do not silently change styling while preparing publication tooling.
