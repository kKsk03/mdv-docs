# Documentation Roadmap

Updated: 2026-11-24. Documentation dependency: **@mdv-ui/mdv 0.1.10**.

This is the local checklist for documenting MDV in this repository. Use it to select, implement, and review three component pages at a time. Read [AGENTS.md](./AGENTS.md) for project decisions and [MAINTENANCE.md](./MAINTENANCE.md) for validation procedures.

## Inventory and current status

The inventory was checked against the sibling library's `src/index.ts`, `COMPONENTS.md`, `ROADMAP.md`, and playground catalog, and the installed package's public declarations and component sources.

- The library exports **67 public Vue components**. All 67 are assigned exactly once to **41 documentation pages** below.
- **41 of 41 component pages are complete** in English and Simplified Chinese. There are no remaining component batches for this baseline; see [guide coverage](#guide-coverage-beyond-component-batches) for follow-up work.
- The 40 non-Button component pages follow the Button page's concise example-first style in both locales. Package baselines and integration investigations stay in maintainer documentation; only usage-relevant caveats appear in articles.
- Related items, groups, providers, scaffolds, and variants are documented in their owning page when listed below. Each included component needs its own API coverage on that page.
- Public types belong with the components that use them. The `useSnackbar` helper belongs on the Snackbar page. Dynamic-color functions have a separate guide task below.
- Introduction is the localized landing page; Setup remains a separate guide in both locales. The shared demo shell, API tables, Markdown highlighting, heading links, page outline, and page transitions are already implemented.

Use the installed package as the API baseline for examples; check props, defaults, slots, events, methods, and public types again before writing each page.

Checked items represent documentation completed in the local workspace. They do not indicate deployment or exhaustive browser and assistive-technology validation. Record actual checks and remaining limits when closing a batch.

## Delivery and navigation rules

1. Work on **three documentation pages per batch**, including their listed companion components. Select the next three unchecked entries in the A-Z checklist unless the user changes the priority.
2. Sort component drawer entries by the primary English component name, ignoring the common `Mdv` prefix and comparing the entire name case-insensitively. Use the same order in both locales. Introduction and Setup keep their existing top-level order.
3. Keep `src/content/registry.ts` as the source of truth for component routes and navigation. Use distinct icons and shared English names in the drawer and Introduction grid. Show translated titles only in non-English locales. Add entries when their pages are implemented, rather than adding empty article routes for the entire inventory.
4. Use one article per locale at `src/content/<locale>/components/<slug>.md`, sharing English demo components under `src/components/docs/demos/<component>/`. Keep article prose and shared controls localized.
5. Document the current installed behavior and known scope. Use the library guide and playground as references, then verify against actual sources. Treat component defects as integration feedback and address library-owned issues under the library's collaboration rules.

### First-batch prerequisite

- [x] Implement stable A-Z component ordering in the registry and update navigation regression coverage. Both locales share the same automatically sorted component names. Show badges only for translations and extend the assertions with each batch.

## Component checklist (A-Z)

The leading component name identifies the public component and its sorting key. Drawer labels omit the `Mdv` prefix in both locales, keeping the remaining name unchanged, such as `BottomSheet` or `ButtonGroup`. Slugs below are relative to `/<locale>/components/`; Button and Checkbox retain their existing URLs.

- [x] **MdvAppBar** — `app-bar`. Includes `MdvAppBarScaffold`. Covers sizes, appearance, title alignment, images, scrolling, and scaffold/navigation composition.
- [x] **MdvAutocomplete** — `autocomplete`. Covers editable suggestions, free-text values, local filtering, application-managed remote search, loading, and form behavior.
- [x] **MdvBadge** — `badge`. Covers small dots, large content, counts, placement, accessible naming, and composition with interactive content.
- [x] **MdvBottomSheet** — `bottom-sheet`. Includes `MdvBottomSheetScaffold`. Covers modal and standard layouts, height states, gesture rules, scrolling, focus, forms, and close behavior.
- [x] **MdvButton** — `button`. Existing reference page covering variants, sizes, shapes, colors, icons, links, loading, disabled states, and API.
- [x] **MdvButtonGroup** — `button-group`. Includes `MdvButtonGroupItem`. Covers standard/connected layouts, actions, independent toggles, selection, sizing, forms, and keyboard behavior.
- [x] **MdvCard** — `card`. Covers outlined/filled/elevated variants, content slots, internal actions, whole-card actions/links, disabled states, and semantics.
- [x] **MdvCarousel** — `carousel`. Covers four layouts, media, stable keys, controlled navigation, custom content/controls, gesture configuration, keyboard operation, and reduced-motion behavior.
- [x] **MdvCheckbox** — `checkbox`. Covers boolean/array models, indeterminate state, select-all, labels, colors, disabled/error states, forms, and API.
- [x] **MdvChip** — `chip`. Includes `MdvChipSet`. Covers variants, group/independent selection, removal, decorative slots, colors, wrapping/scrolling, keyboard focus, and explicit form composition.
- [x] **MdvCircularProgress** — `circular-progress`. Covers determinate/indeterminate modes, flat/wavy appearance, sizing/strokes, progress units, local themes, and accessible labels/status messages.
- [x] **MdvDatePicker** — `date-picker`. Covers ISO dates, all four layout options, calendar/text drafts, restrictions, field states, locale/label separation, controlled acceptance, custom triggers, keyboard behavior, and native forms/validation/reset.
- [x] **MdvDateRangePicker** — `date-range-picker`. Covers complete inclusive ranges, modal/fullscreen layouts, interior-date restrictions, localized entry, validation, controlled acceptance, separate form values, fieldsets, and reset.
- [x] **MdvDialog** — `dialog`. Covers content/actions, close results, controlled rejection, retained/destroyed content, asynchronous guards, native forms, focus restoration, long content, local themes, and nested dialogs.
- [x] **MdvDivider** — `divider`. Covers horizontal/vertical orientation, insets, decorative/semantic use, sizing, local themes, and RTL.
- [x] **MdvFab** — `fab`. Includes `MdvExtendedFab`. Covers sizes, colors, icons/labels, native forms/links, logical placement, controlled expansion, and explicit scroll-container behavior.
- [x] **MdvFabMenu** — `fab-menu`. Includes `MdvFabMenuItem`. Covers expressive/baseline presentation, trigger attributes, action cancellation/keep-open/disabled behavior, controlled requests, close events, placement, dialog composition, and keyboard/focus behavior.
- [x] **MdvFullscreenDialog** — `fullscreen-dialog`. Covers header/footer actions, native forms, long content, asynchronous saving, controlled close rejection, retained/destroyed content, focus, local themes, RTL, and nested confirmation.
- [x] **MdvIcon** — `icon`. Covers optional icon data, individual imports, artwork styles, local SVG data, sizes/colors, button composition, decorative/meaningful semantics, and SSR limits.
- [x] **MdvIconButton** — `icon-button`. Covers variants, dimensions, widths, shapes, controlled actions/toggles, native forms/links, loading/disabled states, colors, accessible names, and Tooltip composition.
- [x] **MdvLinearProgress** — `linear-progress`. Covers determinate/indeterminate states, flat/wavy appearance, real task units, completion/failure/retry, width/thickness, RTL, local themes, accessible labels, and motion behavior.
- [x] **MdvList** — `list`. Includes `MdvListItem` and `MdvListSubheader`. Covers expressive/baseline variants, standard/segmented layouts, content slots, strict-value selection, controlled acceptance/cancellation, independent actions, dividers, groups/reordering/focus, native forms, long content, local themes, and RTL.
- [x] **MdvLoadingIndicator** — `loading-indicator`. Covers default/contained appearances, sizing, pause/resume/visibility, reduced-motion behavior, local themes, task failure/retry, loading announcements, and decorative button composition.
- [x] **MdvMenu** — `menu`. Includes `MdvContextMenu`, `MdvMenuGroup`, and `MdvMenuItem`. Covers ordinary/context triggers, variants, grouped surfaces, strict-value selection, controlled requests, cancellation, three-level flyout/push navigation, scrolling, themes, keyboard operation, and modal focus composition.
- [x] **MdvNavigationBar** — `navigation-bar`. Includes `MdvNavigationBarItem`. Covers automatic/explicit item orientation, fixed-anchor containment, application-owned destination state, real router links, disabled callback checks, active icons, badges, safe-area ownership, themes, and RTL.
- [x] **MdvNavigationDrawer** — `navigation-drawer`. Includes `MdvModalNavigationDrawer`, `MdvNavigationDrawerGroup`, and `MdvNavigationDrawerItem`. Covers standard/modal layouts, headings/disclosures/badges, controlled updates, close policy and guards, content retention, responsive replacement, App Bar adjacency, swipe rules, themes, RTL, keyboard navigation, and focus.
- [x] **MdvNavigationRail** — `navigation-rail`. Includes `MdvModalNavigationRail` and `MdvNavigationRailItem`. Cover collapsed/expanded presentation, standard/modal layouts, alignment, labels, badges, scrolling, and focus.
- [x] **MdvRadio** — `radio`. Includes `MdvRadioGroup`. Cover standalone/group models, mutual exclusion, orientation, labels, colors, disabled/error states, keyboard navigation, and form validation.
- [x] **MdvSearchBar** — `search-bar`. Includes `MdvSearchView` and `MdvSearchAppBar`. Cover contained/divided appearance, docked/fullscreen results, controlled input/opening, IME, result slots, focus, and App Bar composition.
- [x] **MdvSegmentedButton** — `segmented-button`. Includes `MdvSegmentedButtonItem`. Covers classic single/multiple selection, interaction constraints, strict values, densities, full-width overflow, icons, controlled rejection/cancellation, keyboard rules, native/external forms, and reset.
- [x] **MdvSelect** — `select`. Covers typed single-choice models, filled/outlined fields, expressive/baseline listboxes, custom options, controlled value/open requests, disabled/error states, explicit clearing, application-supplied empty-list text, loading/retry, native forms, validation, and reset.
- [x] **MdvSideSheet** — `side-sheet`. Includes `MdvSideSheetScaffold`. Covers modal/standard layouts, logical placement, attached/detached appearance, actual main-area resizing, independent scrolling, close policies/guards, native dialog forms, content retention, gestures, focus, local themes, RTL, and nested overlays.
- [x] **MdvSlider** — `slider`. Covers standard/centered/range variants, sizes, steps, labels, colors, disabled states, pointer/keyboard interaction, and form values.
- [x] **MdvSnackbar** — `snackbar`. Includes `MdvSnackbarProvider` and `useSnackbar`. Covers controlled messages, provider queues, actions, placement, timing, close reasons, and overlay/focus behavior.
- [x] **MdvSplitButton** — `split-button`. Covers variants, sizes, main/secondary actions, menu slots and accepted open state, disabled/loading behavior, and keyboard/focus behavior.
- [x] **MdvSwitch** — `switch`. Covers boolean models, labels/positions, state icons, colors, disabled/error states, native forms, validation, and reset.
- [x] **MdvTabs** — `tabs`. Includes `MdvTab` and `MdvTabPanel`. Covers primary/secondary variants, icons/badges, activation, keyboard rules, overflow, panel lifecycle, and touch navigation.
- [x] **MdvTextField** — `text-field`. Covers filled/outlined variants, value modifiers, input types, icons/slots, clear/password actions, supporting/error text, native constraints, and exposed methods.
- [x] **MdvTimePicker** — `time-picker`. Covers minute-precision values, dial/input modes, 12/24-hour cycles, orientation, limits/steps, localization, keyboard interaction, and native forms.
- [x] **MdvToolbar** — `toolbar`. Covers docked/floating variants, colors, orientation, placement, expansion, scrolling, keyboard behavior, and FAB composition.
- [x] **MdvTooltip** — `tooltip`. Includes `MdvRichTooltip`. Covers plain/rich content, trigger slots, timing, placement, hover/focus/touch interaction, actions, and overlay composition.

## Planned batches

This schedule records the completed A-Z component batches. The component checklist is the completion record; update this schedule if inventory or user priorities change.

| Batch | Pages |
| --- | --- |
| 1 — complete | `MdvAppBar`, `MdvAutocomplete`, `MdvBadge` |
| 2 — complete | `MdvBottomSheet`, `MdvButtonGroup`, `MdvCard` |
| 3 — complete | `MdvCarousel`, `MdvChip`, `MdvCircularProgress` |
| 4 — complete | `MdvDatePicker`, `MdvDateRangePicker`, `MdvDialog` |
| 5 — complete | `MdvDivider`, `MdvFab`, `MdvFabMenu` |
| 6 — complete | `MdvFullscreenDialog`, `MdvIcon`, `MdvIconButton` |
| 7 — complete | `MdvLinearProgress`, `MdvList`, `MdvLoadingIndicator` |
| 8 — complete | `MdvMenu`, `MdvNavigationBar`, `MdvNavigationDrawer` |
| 9 — complete | `MdvNavigationRail`, `MdvRadio`, `MdvSearchBar` |
| 10 — complete | `MdvSegmentedButton`, `MdvSelect`, `MdvSideSheet` |
| 11 — complete | `MdvSlider`, `MdvSnackbar`, `MdvSplitButton` |
| 12 — complete | `MdvSwitch`, `MdvTabs`, `MdvTextField` |
| 13 — complete | `MdvTimePicker`, `MdvToolbar`, `MdvTooltip` |

## Latest completed batch

Batch 13 adds English and Simplified Chinese guides for Time Picker, Toolbar, and Tooltip (including Rich Tooltip). Both locales share nine interactive demos and a Time Picker label map, with synchronized displayed source. The drawer now lists all 41 component pages in A-Z order with localized badges and distinct icons.

- Time Picker covers draft confirmation and cancellation, dial/text modes, 12/24-hour display, overnight availability, controlled updates, localization, and native form validation and reset.
- Toolbar covers docked keyboard navigation, floating expansion and FAB pairing, logical placement, active scroll regions, and focus when action groups collapse.
- Tooltip covers plain descriptions, persistent Rich help, and temporary hints inside a dialog. It documents trigger bindings, ARIA relationships, Popover support, touch delays, and overlay dismissal and focus behavior.
- The focused checks passed (19 tests), covering demo interactions, six localized routes and articles, heading permalinks, source parity, and drawer ordering and badges. `pnpm check` stopped with `spawn EPERM` and the approval service could not complete a retry. The separate `pnpm type-check`, `pnpm test:unit` (23 files, 220 tests), and `pnpm build-only` (819 modules) all passed. Vite still warns about chunks over 500 kB; the main JavaScript chunk is 728.58 kB (226.71 kB gzip).
- Browser checks remain open: direct loading and language switching, heading scrolling, desktop/mobile layout, light/dark and scoped themes, visual focus, physical pointer and touch input, native overlay stacking, and reduced motion. The DOM tests use minimal Dialog and Popover mocks and do not verify those browser behaviors.

Next: **Add theme/style guidance** for light/dark/system and scoped themes. This is a follow-up guide task, not another component batch.

## Component copy in MDV 0.1.10

The English and Simplified Chinese Setup guides explain how to pass application text and keep native validation. Component articles and examples use the optional copy APIs, including `resultsLabel` for Search View and Search App Bar, `noOptionsText` for Select, action labels for Text Field, and separate range-handle names for Slider. Date and time pickers use `locale` for formatting and `labels` for interface and validation text. Carousel passes optional text to its empty-state slot.

`pnpm check` passed against the installed MDV 0.1.10, including type checking, 225 tests in 24 files, and a production build. Demo tests cover the named search results region, Text Field actions, and both empty states. Vite still reports the chunk-size warning. Computer Use stopped at local URL verification, so browser spot checks are pending.

## Open MDV integration feedback

- **Visited-link paint during palette changes:** the reported effect was a brief darkening on the active Drawer row and Setup outline links during light and dark palette transitions. The installed package includes the Drawer fix from MDV 0.1.8, and the outline uses the Button paint variable. Verify with established visited links and captured paint frames in both modes.

- **NavigationBarItem disabled link callbacks (MDV 0.1.5):** use a custom RouterLink slot and bind its `navigate` callback to a NavigationBarItem with both `href` and `disabled`. Clicking the disabled anchor removes native href navigation but still invokes the supplied callback, allowing router navigation. Expected: a disabled destination blocks activation listeners as the other MDV navigation items do. The installed and sibling sources both forward listeners without a disabled activation guard. The docs demo now checks the disabled state before calling `navigate`, and its regression test verifies the route remains unchanged. The localized articles explain this current callback limitation. This is an application-level callback check, not a CSS override; a library fix and package-consumer verification remain open under MDV's collaboration workflow.

- **Radio Group reported-validity residue (MDV 0.1.5, reproduced in production preview):** open the Radio page's external-form demo with no selection and activate Report validity; then select Express and submit. FormData contains delivery=express and every native radio is valid, while the originally required Standard input retains aria-invalid=true and the mdv-radio--error class after the group clears its own error. Expected: all grouped option error/ARIA states resynchronize after correction or reset. MdvRadio retains its own reported nativeInvalid flag and does not refresh it in grouped onUpdated handling. The articles expose this limitation and the docs do not hide it with CSS. A library fix remains open.
- **Radio Group class forwarding (MDV 0.1.5, source-confirmed):** pass a class to MdvRadioGroup. inheritAttrs is false, rootAttrs removes class, and the fieldset class binding contains only library classes, so the caller's class is dropped; style is forwarded explicitly. Expected: ordinary root class attributes are merged consistently. Articles recommend a surrounding layout container pending library review; no internal styling override is added.

## Review checklist for each batch

Use these checks for every page in the active batch. Mark the component entry complete only after implementation and relevant validation; record any blocked or unverified checks explicitly.

- [ ] Check installed source and public declarations for every documented component and helper, including companion APIs.
- [ ] Write aligned `zh-CN` and `en-US` articles with practical guidance and accurate scope limits.
- [ ] Add shared, interactive English demos using `DemoBlock`; keep displayed source synchronized with each live example.
- [ ] Document applicable props/defaults, models, slots, events, methods, public types, native attributes, and form behavior.
- [ ] Register both locale routes, localized titles, and icons; verify A-Z ordering, translation-only badges and subtitles, active navigation, direct links, heading links, and locale switching.
- [ ] Check applicable desktop/mobile layouts, light/dark/local themes, long content, disabled/error/loading states, keyboard/focus behavior, and reduced motion.
- [ ] Add meaningful behavior coverage for demo logic or integration changes; run the validation gate from `MAINTENANCE.md` and record the actual result.
- [ ] Record reproducible library-owned defects and remaining validation limits; update the component checkboxes, counts, and next batch.

## Guide coverage beyond component batches

These are follow-up documentation tasks, separate from the component-page count. Introduction and Setup remain the existing starting points.

- [x] Make Introduction a landing page with a centered, theme-aware wordmark and a CSS-only animated backdrop above the flat component grid. Accent the M, D, and V initials and keep the backdrop still with reduced motion. The hero links to Setup, the catalog, and the library repository. The version and public component count follow the package at build time.
- [x] Add an App Bar palette picker with 20 fixed swatches, including the original MDV palette. Apply non-default presets through MDV's lazy-loaded dynamic color API, separate from light/dark/system mode. Use the same swatches in a desktop anchored panel and the compact More options dialog.
- [x] Review Setup against the installed @mdv-ui/mdv 0.1.10 package: optional icon data, individual component imports, CSS order, consumer-side Tailwind generation, local Roboto/font fallback behavior, and application-supplied component copy and native validation.
- [ ] Add theme/style guidance covering light/dark/system and local scopes, MDV color roles, CSS variables and Tailwind mappings, typography/fonts, shapes, elevation, motion, and reduced motion.
- [ ] Add dynamic-color guidance for `createMdvColorScheme`, `applyMdvColorScheme`, their public types, seed requirements, scoped application, cleanup, and server/browser boundaries.
- [ ] Add integration guidance for native forms, accessible names and keyboard interaction, IME, overlay composition, routing, SSR/hydration limits, and individual imports/bundle considerations.
- [ ] Establish a visible documented-version policy and keep it aligned with the installed package before publishing the site.

Introduction and navigation validation: The registry supplies one card per component page and the same English names for the grid and drawer. Integration tests cover the root locale redirect, icon-free wordmark with accented initials, no article outline, localized catalog permalinks, and card links. `pnpm check` passed (222 tests in 24 files, type checking, and a production build); the existing Vite chunk-size warning remains. CSS polygons preserve the moving backdrop in light and dark mode, with no horizontal overflow at 320px and 390px. The production build no longer emits the backdrop PNG; the landing route's CSS, JavaScript, and backdrop assets are 14,086 bytes smaller before compression. Browser checks for the shared catalog permalink covered pointer and keyboard activation, direct loading of the locale fragments, and an unclipped focus outline at both widths. Reduced motion was not emulated in the browser.

App Bar palette validation: `pnpm check` passed with MDV 0.1.6 (type checking, 224 tests in 24 files, and production build). The existing Vite chunk-size warning remains. Integration tests cover preset switching, persistence, restoring the default, and independence from light/dark mode. Earlier Chromium checks covered refresh persistence, desktop keyboard navigation and Escape, the 320px dialog's layout and focus return, and dismissal across the 768px breakpoint. Introduction uses unmodified `MdvButton` links and relies on MDV for the visited-link color fix. Browser painting after the upgrade, forced colors, reduced motion, and other browsers were not checked in this pass.

Component editorial review validation: `pnpm check` passed (24 files, 225 tests, and a production build) against @mdv-ui/mdv 0.1.10. The final source scan found 41 of 41 registered component pages in both locales, public prop tables cover the installed declaration props, and localized fences remain identical where examples are shared. Production preview spot checks previously covered the Chinese Navigation Rail outline, rail expansion and example code, and the English Date Range Picker link to Date Picker localization. Computer Use could not complete a final local URL verification, so broader browser coverage, the existing Vite chunk-size warning, and the previously observed Date Range Picker narrow-layout clipping remain open.

## Maintaining this file

Before each batch, recheck the package baseline and choose the next three unchecked pages. After the batch, update current counts, completion boxes, actual validation results, unresolved issues, and the next batch. Keep detailed implementation history in commits rather than appending a running activity log here.

When MDV exports or the installed dependency change, reconcile every public component with this inventory, update companion ownership and the schedule, and preserve existing article URLs. Do not mark a component documented merely because it is used in the site shell or another example.
