# MDV Docs Agent Instructions

## Project scope

- This is the standalone Vue 3 and Vite documentation site for `@mdv-ui/mdv`. Keep the custom site; do not migrate it to VitePress.
- Use MDV components for shared navigation and controls. Keep Tailwind CSS v4 and MDV styles imported only through `src/assets/css/main.css`.
- Do not globally register MDV components; import them where used to preserve tree-shaking.
- The theme control cycles through light, dark, and system modes and persists the choice under `mdv-docs-theme`; system mode follows `prefers-color-scheme`.

## Content and locales

- Supported locale prefixes are `/en-US/` and `/zh-CN/`. Explicit URL locale wins; `/` uses the saved preference, then the browser language.
- Keep short interface text in `src/locales/` and article content in localized Markdown under `src/content/<locale>/`.
- Treat `src/content/registry.ts` as the source of truth for page IDs, slugs, localized navigation, titles, and lazy Markdown imports.
- Keep Introduction and Setup as top-level drawer links without static section headings. Components is an MDV collapsible drawer group with Button as its current child. Use icons for top-level links, group controls, and child pages. Preserve localized labels and the existing article URLs; reveal a group when navigating to one of its child pages.
- Markdown pages may import local Vue components with `<script setup>`. Put reusable interactive demonstrations in `src/components/docs/demos/<component>/<example>.vue`, such as `button/variant.vue` and `button/size.vue`, and share them across translations.
- Keep component demo labels and source snippets in English across locales; localize article prose and shared-shell controls.
- Compose demonstrations with `src/components/docs/DemoBlock.vue`: put the live preview in the default slot and Markdown code fences in the `source` slot. Place example headings in article Markdown. Keep demo components focused on the preview. The shared shell places code between the preview divider and the centered Example code toggle, animates its height without replacing preview state, and makes collapsed source inert. Reuse the existing code highlighting and copy controls; honor reduced motion.
- Give demo previews the full available content width. Avoid sizing nested wrapping groups by their text content, which can cause short Chinese labels to wrap early when controls enforce minimum widths. Let each demo handle wrapping within that available width.
- Use `ApiTable.vue` for prop metadata followed by full-width descriptions and `SlotsTable.vue` for slot names followed by descriptions. Keep item data and descriptions in each localized article. `ApiTable` derives kebab-case template attributes from JavaScript prop names unless `attribute` overrides them; omit Web Components reflection metadata. Both components accept `items` and optional `description-<name>` slots for rich Markdown; keep rich slot tags unindented with blank lines around Markdown content so lists end before the closing tag. Share their MDV token styles in `src/components/docs/api-table.css` and keep overflow inside the table wrapper.
- Scope article typography to `.docs-prose`; do not use global element selectors that can restyle MDV controls.
- Generate heading IDs and `#` permalinks during Markdown compilation in `build/markdown-headings.ts`. Position permalinks in the left gutter without shifting heading text; reveal them on heading hover or keyboard focus. Preserve Chinese text, lowercase Latin text, hyphenate whitespace, and suffix duplicate IDs within each article. Use ordinary fragment links for references. Smoothly scroll initial and route-based fragments inside the MDV scaffold via `src/router/scroll.ts`, and use `docs-article-scroll` on its content element for native fragment links. Honor reduced-motion preferences in both CSS and programmatic scrolling.
- Keep the URL fragment aligned with the section being read during manual article scrolling via `src/router/heading-tracker.ts`. Replace the current router location without adding history entries or triggering another scroll. Suspend tracking during anchor navigation and page changes, and dispose listeners, router hooks, and scheduled work with the layout.
- Keep Shiki highlighting in the Vite Markdown pipeline, outside client code. Select light and dark token colors using the inherited MDV `color-scheme`.
- Enable optional fence line numbers with a `:line-numbers` language suffix, such as `ts:line-numbers`. Strip the suffix before highlighting and display decorative numbers in a separate gutter so selection and copying contain only code.
- Use `::: code-tabs` with `@tab Label` and one fenced code block per tab. Keep parsing and automatic wrapper imports in `build/markdown-code.ts`, and use local MDV-based wrappers in `src/components/docs/`.
- Code tabs are a local, text-only adaptation of MDV Primary Tabs rather than MDV component instances. Retain its keyboard rules, state feedback, and spring indicator measured from the label; use the filled-card surface for code containers. Keep source notices in `THIRD_PARTY_NOTICES.md`.
- Code fences show the language label in the upper-right padding above the first code line, avoiding overlap during horizontal scrolling. At desktop widths (768px and above) with a fine pointer and hover support, crossfade to an MDV copy button only when hovering the top-right control area or focusing its button with the keyboard. Mobile and touch devices show only the language label; hide copy actions from display and keyboard navigation. Overlay the controls without reserving a toolbar row. Copy only the current fence's plain text, and show localized success feedback only after the clipboard write succeeds.
- Copy controls and success feedback share a translucent neutral surface derived from MDV's on-surface color. Keep text and icons opaque, and preserve the MDV button's interaction states.
- Maintain both English and Simplified Chinese versions when adding documentation pages. Keep maintainer documentation, including this file, in English.

## MDV integration feedback

- Treat the documentation site as an integration and visual-validation surface for `@mdv-ui/mdv`. Compare rendered components with their intended design while building pages and examples.
- When a component appears inconsistent or defective, record reproducible steps and the expected and actual behavior, then determine whether the issue belongs to the MDV library or the documentation integration.
- Fix library-owned issues in the separate `mdv` repository under its collaboration rules, then verify the result through the documentation site. Do not mask library defects with documentation-level style overrides.

## Development

- Follow `MAINTENANCE.md` for the development, validation, and submission workflow. Keep it current when commands, tooling, or CI change.
- Use UTF-8 and LF for text files, following `.editorconfig` and `.gitattributes`. Keep maintainer Markdown in English; localized articles use their locale's language.
- Use Node 24.22.1 and pnpm 12.14.0 as the baseline. Keep the pnpm store in a user-level or global location; never create a pnpm store inside this repository.
- Commit `tests/`, its fixtures, and test configuration as source. Ignore generated reports, coverage, caches, dependencies, and build output.
- Use Vitest, Vue Test Utils, and jsdom. Import Vue components directly through the shared Vite configuration; do not add custom SFC loaders or a second test runner.
- Test observable behavior. Add regression coverage for functional fixes; use browser checks for visual changes rather than tests that mirror CSS or implementation details. Reset mocks and timers and unmount fixtures after each test.
- Use `pnpm test:watch` during development and `pnpm check` before submission. The complete gate runs type checking, unit tests, and the production build in sequence and also runs in CI on pushes and manual dispatches.
- Keep application, build-tool, and test types covered by the root TypeScript project. Update compatible tooling dependencies and `pnpm-lock.yaml` together; verify with a frozen-lockfile installation.
- Report only checks actually run, including failures and unverified browser behavior. Do not skip tests or suppress errors to make the gate pass.
- Preserve existing workspace changes and keep edits scoped to the documentation site.
