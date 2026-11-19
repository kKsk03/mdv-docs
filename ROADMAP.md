# Documentation Roadmap

Updated: 2026-11-19. Documentation dependency: **@mdv-ui/mdv 0.1.5**.

This is the local checklist for documenting MDV in this repository. Use it to select, implement, and review three component pages at a time. Read [AGENTS.md](./AGENTS.md) for project decisions and [MAINTENANCE.md](./MAINTENANCE.md) for validation procedures.

## Inventory and current status

The inventory was checked against the sibling library's `src/index.ts`, `COMPONENTS.md`, `ROADMAP.md`, and playground catalog, and the installed package's public declarations and component sources.

- The library exports **67 public Vue components**. All 67 are assigned exactly once to **41 documentation pages** below.
- **23 pages are complete:** App Bar, Autocomplete, Badge, Bottom Sheet, Button, Button Group, Card, Carousel, Checkbox, Chip, Circular Progress, Date Picker, Date Range Picker, Dialog, Divider, Fab, Fab Menu, Fullscreen Dialog, Icon, Icon Button, Linear Progress, List, and Loading Indicator. **18 pages remain**, arranged into **6 batches of 3**.
- Related items, groups, providers, scaffolds, and variants are documented in their owning page when listed below. Each included component needs its own API coverage on that page.
- Public types belong with the components that use them. The `useSnackbar` helper belongs on the Snackbar page. Dynamic-color functions have a separate guide task below.
- Introduction and Setup already exist in both locales. The shared demo shell, API tables, Markdown highlighting, heading links, page outline, and page transitions are already implemented.

The library working-tree manifest currently says `0.1.4`, while this site's dependency and installed package say `0.1.5`. Their 67 component export names and public component source files match after line-ending normalization. Use the installed package as the API baseline for examples; check props, defaults, slots, events, methods, and public types again before writing each page.

Checked items represent documentation completed in the local workspace. They do not indicate deployment or exhaustive browser and assistive-technology validation. Record actual checks and remaining limits when closing a batch.

## Delivery and navigation rules

1. Work on **three documentation pages per batch**, including their listed companion components. Select the next three unchecked entries in the A-Z checklist unless the user changes the priority.
2. Sort component drawer entries by the primary English component name, ignoring the common `Mdv` prefix and comparing the entire name case-insensitively. Use the same order in both locales. Introduction and Setup keep their existing top-level order.
3. Keep `src/content/registry.ts` as the source of truth for component routes and navigation. Use localized badge text and distinct icons. Add entries when their pages are implemented, rather than adding empty article routes for the entire inventory.
4. Use one article per locale at `src/content/<locale>/components/<slug>.md`, sharing English demo components under `src/components/docs/demos/<component>/`. Keep article prose and shared controls localized.
5. Document the current installed behavior and known scope. Use the library guide and playground as references, then verify against actual sources. Treat component defects as integration feedback and address library-owned issues under the library's collaboration rules.

### First-batch prerequisite

- [x] Implement stable A-Z component ordering in the registry and update navigation regression coverage. Both locales share the same automatically sorted component names and localized badges; extend the assertions with each batch.

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
- [ ] **MdvMenu** — `menu`. Includes `MdvContextMenu`, `MdvMenuGroup`, and `MdvMenuItem`. Cover ordinary/context triggers, variants, groups, selection, nested menus, keyboard navigation, and focus.
- [ ] **MdvNavigationBar** — `navigation-bar`. Includes `MdvNavigationBarItem`. Cover supported orientations/layouts, destination models, icons/labels, badges, and native navigation semantics.
- [ ] **MdvNavigationDrawer** — `navigation-drawer`. Includes `MdvModalNavigationDrawer`, `MdvNavigationDrawerGroup`, and `MdvNavigationDrawerItem`. Cover classic standard/modal layouts, groups, dividers, badges, responsive composition, gestures, and focus.
- [ ] **MdvNavigationRail** — `navigation-rail`. Includes `MdvModalNavigationRail` and `MdvNavigationRailItem`. Cover collapsed/expanded presentation, standard/modal layouts, alignment, labels, badges, scrolling, and focus.
- [ ] **MdvRadio** — `radio`. Includes `MdvRadioGroup`. Cover standalone/group models, mutual exclusion, orientation, labels, colors, disabled/error states, keyboard navigation, and form validation.
- [ ] **MdvSearchBar** — `search-bar`. Includes `MdvSearchView` and `MdvSearchAppBar`. Cover contained/divided appearance, docked/fullscreen results, controlled input/opening, IME, result slots, focus, and App Bar composition.
- [ ] **MdvSegmentedButton** — `segmented-button`. Includes `MdvSegmentedButtonItem`. Cover classic single/multiple selection, density, selected icons, keyboard behavior, and native forms.
- [ ] **MdvSelect** — `select`. Cover single-choice models, options, filled/outlined fields, expressive/baseline menus, disabled/loading/error states, clear behavior, keyboard navigation, and forms.
- [ ] **MdvSideSheet** — `side-sheet`. Includes `MdvSideSheetScaffold`. Cover modal/standard layouts, placement, attached/detached appearance, resizing of adjacent content, gestures, and focus.
- [ ] **MdvSlider** — `slider`. Cover standard/centered/range variants, sizes, steps, labels, colors, disabled states, pointer/keyboard interaction, and form values.
- [ ] **MdvSnackbar** — `snackbar`. Includes `MdvSnackbarProvider` and `useSnackbar`. Cover controlled messages, provider queues, actions, placement, timing, close reasons, and overlay/focus behavior.
- [ ] **MdvSplitButton** — `split-button`. Cover variants, sizes, main/secondary actions, menu slots and accepted open state, disabled/loading behavior, and keyboard/focus behavior.
- [ ] **MdvSwitch** — `switch`. Cover boolean models, labels/positions, state icons, colors, disabled/error states, native forms, validation, and reset.
- [ ] **MdvTabs** — `tabs`. Includes `MdvTab` and `MdvTabPanel`. Cover primary/secondary variants, icons/badges, activation, keyboard rules, overflow, panel lifecycle, and touch navigation.
- [ ] **MdvTextField** — `text-field`. Cover filled/outlined variants, value modifiers, input types, icons/slots, clear/password actions, supporting/error text, native constraints, and exposed methods.
- [ ] **MdvTimePicker** — `time-picker`. Cover minute-precision values, dial/input modes, 12/24-hour cycles, orientation, limits/steps, localization, keyboard interaction, and native forms.
- [ ] **MdvToolbar** — `toolbar`. Cover docked/floating variants, colors, orientation, placement, expansion, scrolling, keyboard behavior, and FAB composition.
- [ ] **MdvTooltip** — `tooltip`. Includes `MdvRichTooltip`. Cover plain/rich content, trigger slots, timing, placement, hover/focus/touch interaction, actions, and overlay composition.

## Planned batches

This schedule follows the unchecked A-Z entries above. The component checklist is the completion record; update this schedule if inventory or user priorities change.

| Batch | Pages |
| --- | --- |
| 1 — complete | `MdvAppBar`, `MdvAutocomplete`, `MdvBadge` |
| 2 — complete | `MdvBottomSheet`, `MdvButtonGroup`, `MdvCard` |
| 3 — complete | `MdvCarousel`, `MdvChip`, `MdvCircularProgress` |
| 4 — complete | `MdvDatePicker`, `MdvDateRangePicker`, `MdvDialog` |
| 5 — complete | `MdvDivider`, `MdvFab`, `MdvFabMenu` |
| 6 — complete | `MdvFullscreenDialog`, `MdvIcon`, `MdvIconButton` |
| 7 — complete | `MdvLinearProgress`, `MdvList`, `MdvLoadingIndicator` |
| **8 — next** | `MdvMenu`, `MdvNavigationBar`, `MdvNavigationDrawer` |
| 9 | `MdvNavigationRail`, `MdvRadio`, `MdvSearchBar` |
| 10 | `MdvSegmentedButton`, `MdvSelect`, `MdvSideSheet` |
| 11 | `MdvSlider`, `MdvSnackbar`, `MdvSplitButton` |
| 12 | `MdvSwitch`, `MdvTabs`, `MdvTextField` |
| 13 | `MdvTimePicker`, `MdvToolbar`, `MdvTooltip` |

## Latest completed batch

Batch 7 adds aligned English and Chinese articles for Linear Progress, List, and Loading Indicator, with 18 shared English demos and 36 displayed-source fences verified against their live components. The installed MDV 0.1.5 source matches the sibling library for the 18 component, helper, and style files reviewed in this batch. Navigation includes all 23 pages, sorted A-Z without the Mdv prefix, with localized badges and distinct icons.

- Linear Progress covers flat/wavy and determinate/indeterminate modes, actual task units and value normalization, manual task transitions through unknown/known/completed/failed states, retry, container width, stroke thickness, RTL, local themes, color variables, progress semantics, and animation lifecycle. It distinguishes the graphic's height from a visible label and documents the shared progress types and absence of built-in requests, errors, and completion events.
- List covers all four variant/layout combinations and the APIs of List, Item, and Subheader, including inferred content/lines, slots, dividers, strict single/multiple values, parent acceptance and click cancellation, decorative selection marks, independent controls, disabled actions, stable-key reordering, group boundaries, focus methods, native forms, long content, themes, and RTL. It distinguishes native actions from listbox options, and decorative marks from actual form inputs.
- Loading Indicator covers default/contained appearances, 24–240px sizing, phase-preserving pause/resume, visibility, local themes, application-owned busy/status state, asynchronous failure/retry, decorative button loading, reduced-motion behavior, and numeric-ARIA removal. It documents the Chinese default accessible label and the local geometric approximation used for the morphing shapes.
- Added 9 behavior tests covering task progress, strict-value keyboard selection, controlled rejection/cancellation, independent actions, disabled controls, reordered focus, native required/submit/reset behavior, asynchronous loading/retry, decorative button semantics, and timer disposal. Both locales' navigation assertions include all 23 pages. `pnpm check` was blocked by the existing run-s launcher restriction (spawn EPERM); its stages passed separately, including after the CSS-target fix: `pnpm type-check`, `pnpm test:unit` (17 files, 137 tests), and `pnpm build-only`. The main JavaScript chunk is 562.80 kB (182.63 kB gzip), above Vite's 500 kB warning threshold; bundle optimization remains separate work.
- Production-preview checks covered all six localized routes, desktop/mobile locale switching, localized A-Z navigation, compact outline scrolling, highlighted source expansion, API/slot tables, 1280px desktop and 390px layouts, and light/dark/local themes. Tables and source kept horizontal overflow inside their wrappers; mobile copy buttons remained hidden, including with source expanded, and 240px indicators fit the mobile preview. Linear task checks covered omitted numeric ARIA while connecting, actual values after connection, completion, failure/retry, narrow width, 12px thickness, and RTL. List checks covered skipping disabled options, moving focus without selection, Enter activation, numeric/string values, multiple selection, controlled acceptance/cancellation, independent actions/disabled controls, group hiding, DOM reordering, instance focus, and native required validation/submission/reset. Loading checks compared SVG paths and rotation to confirm paused frames remain stable and resumed frames change; they also covered hiding, failure/retry, completion status, and decorative button semantics. No page warnings or errors were captured.
- Fixed a documentation-build integration defect: Vite's default Chrome/Edge 111 CSS target lowered MDV's `:dir(rtl)` selector to language matching, so English/Chinese scoped RTL labels aligned correctly while Linear Progress graphics still grew from the left. Production CSS now targets Chrome/Edge 120, Firefox 114, and Safari/iOS 16.4 to preserve native direction matching. Rebuilt previews verified the native selector and mirrored/unmirrored graphics in both locales. JavaScript retains Vite's default target. No library files were changed; see `MAINTENANCE.md` for the retained build constraint.
- Real touch input, screen readers, IME, browser reduced-motion settings, forced colors, SSR/hydration, actual network transfers, offscreen/tab-hidden/KeepAlive pause behavior, and cross-browser combinations remain unverified. Unit tests use reduced-motion queries and do not establish visual motion quality. Loading tasks use local timers; progress tasks use explicit local controls.

Next batch: **MdvMenu** (including ContextMenu, Group, and Item), **MdvNavigationBar** (including Item), and **MdvNavigationDrawer** (including Modal, Group, and Item).

## Review checklist for each batch

Use these checks for every page in the active batch. Mark the component entry complete only after implementation and relevant validation; record any blocked or unverified checks explicitly.

- [ ] Check installed source and public declarations for every documented component and helper, including companion APIs.
- [ ] Write aligned `zh-CN` and `en-US` articles with practical guidance and accurate scope limits.
- [ ] Add shared, interactive English demos using `DemoBlock`; keep displayed source synchronized with each live example.
- [ ] Document applicable props/defaults, models, slots, events, methods, public types, native attributes, and form behavior.
- [ ] Register both locale routes, localized badges, and icons; verify A-Z ordering, active navigation, direct links, heading links, and locale switching.
- [ ] Check applicable desktop/mobile layouts, light/dark/local themes, long content, disabled/error/loading states, keyboard/focus behavior, and reduced motion.
- [ ] Add meaningful behavior coverage for demo logic or integration changes; run the validation gate from `MAINTENANCE.md` and record the actual result.
- [ ] Record reproducible library-owned defects and remaining validation limits; update the component checkboxes, counts, and next batch.

## Guide coverage beyond component batches

These are follow-up documentation tasks, separate from the component-page count. Introduction and Setup remain the existing starting points.

- [ ] Expand Introduction with the supported library scope, component categories, and links to setup and examples.
- [ ] Review Setup against the installed package, including optional icon data, individual component imports, CSS order, consumer-side Tailwind generation, and font behavior.
- [ ] Add theme/style guidance covering light/dark/system and local scopes, MDV color roles, CSS variables and Tailwind mappings, typography/fonts, shapes, elevation, motion, and reduced motion.
- [ ] Add dynamic-color guidance for `createMdvColorScheme`, `applyMdvColorScheme`, their public types, seed requirements, scoped application, cleanup, and server/browser boundaries.
- [ ] Add integration guidance for native forms, accessible names and keyboard interaction, IME, overlay composition, routing, SSR/hydration limits, and individual imports/bundle considerations.
- [ ] Establish a visible documented-version policy and keep it aligned with the installed package before publishing the site.

## Maintaining this file

Before each batch, recheck the package baseline and choose the next three unchecked pages. After the batch, update current counts, completion boxes, actual validation results, unresolved issues, and the next batch. Keep detailed implementation history in commits rather than appending a running activity log here.

When MDV exports or the installed dependency change, reconcile every public component with this inventory, update companion ownership and the schedule, and preserve existing article URLs. Do not mark a component documented merely because it is used in the site shell or another example.
