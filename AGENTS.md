Ectoplasma — Agent Instructions

Project Overview

Ectoplasma is a BetterDiscord theme featuring a dark, translucent glass aesthetic, customizable accent colors, and neon glow effects.

The project is transitioning from a single CSS file to a modular SCSS architecture.

The primary goal is to maintain a visually consistent, reliable theme while improving code organization and maintainability.

Project Structure

* Ectoplasma.theme.css — Current working BetterDiscord theme. Treat this as the source of truth until the SCSS migration is complete.
* src/main.scss — Entry point for the modular SCSS architecture.
* src/abstracts/ — Shared variables and mixins.
* src/components/ — Reusable visual components and effects.
* src/sections/ — Styles organized by Discord interface area.
* dist/ — Generated CSS output.

General Development Rules

* Preserve existing functionality and appearance unless explicitly instructed otherwise.
* Prefer small, focused changes over large, unrelated refactors.
* Follow existing naming conventions and formatting patterns.
* Do not introduce dependencies unless they provide a clear benefit.
* Avoid unnecessary complexity and abstraction.
* Do not modify unrelated sections when implementing a change.

CSS and SCSS Guidelines

* Keep styles organized by the Discord interface area they affect.
* Each section should be as self-contained as reasonably possible.
* Avoid selectors that unintentionally affect unrelated interface areas.
* Prefer narrowly scoped selectors over broad global overrides.
* Preserve existing CSS selectors unless a task explicitly requires changing them.
* Preserve the existing --spook-* CSS custom properties until instructed to rename them.
* Use shared variables and mixins when they meaningfully reduce duplication.
* Do not introduce abstractions solely to reduce line count.
* Maintain compatibility with BetterDiscord and Discord’s current interface.

Visual Design

Ectoplasma uses a consistent visual language:

* Dark and translucent backgrounds.
* Frosted-glass blur effects.
* Accent-colored neon glow.
* Subtle borders, shadows, and highlights.
* Consistent text hierarchy and readability.

Use existing styles as references when implementing new interface elements.

Do not introduce new visual patterns without a clear reason.

Development and Testing

* Run npm run build after modifying SCSS files.
* Investigate and resolve build errors before completing a task.
* Do not manually edit generated CSS files.
* Do not claim that visual changes have been verified unless they were actually tested in Discord.
* Explain changes that require manual visual verification.

Git and Change Management

* Keep changes focused on the requested task.
* Do not commit or push changes unless explicitly requested.
* Do not merge branches unless explicitly requested.
* Do not modify Git configuration or repository settings without permission.
* Do not discard existing work or overwrite unrelated changes.

Working with the User

The user reviews and tests changes in BetterDiscord.

When completing a task:

1. Summarize what changed.
2. Mention any important implementation decisions.
3. Report build or validation results.
4. Identify anything requiring manual testing.

Ask for clarification when a decision could significantly affect the theme’s appearance, architecture, or behavior.