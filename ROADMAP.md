# Documentation Roadmap

Updated: 2026-11-19. Documentation dependency: **@mdv-ui/mdv 0.1.5**.

This is the local checklist for documenting MDV in this repository. Use it to select, implement, and review three component pages at a time. Read [AGENTS.md](./AGENTS.md) for project decisions and [MAINTENANCE.md](./MAINTENANCE.md) for validation procedures.

## Inventory and current status

The inventory was checked against the sibling library's `src/index.ts`, `COMPONENTS.md`, `ROADMAP.md`, and playground catalog, and the installed package's public declarations and component sources.

- The library exports **67 public Vue components**. All 67 are assigned exactly once to **41 documentation pages** below.
- **14 pages are complete:** App Bar, Autocomplete, Badge, Bottom Sheet, Button, Button Group, Card, Carousel, Checkbox, Chip, Circular Progress, Date Picker, Date Range Picker, and Dialog. **27 pages remain**, arranged into **9 batches of 3**.
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
- [ ] **MdvDivider** — `divider`. Cover horizontal/vertical orientation, insets, decorative/semantic use, sizing, and RTL.
- [ ] **MdvFab** — `fab`. Includes `MdvExtendedFab`. Cover sizes, colors, icons/labels, native actions/links, placement, extended expansion, and scroll behavior.
- [ ] **MdvFabMenu** — `fab-menu`. Includes `MdvFabMenuItem`. Cover expressive/baseline presentation, triggers, action items, selection/close events, positioning, and keyboard/focus behavior.
- [ ] **MdvFullscreenDialog** — `fullscreen-dialog`. Cover top/bottom actions, long content, async submission, close policy, focus, and nested confirmation.
- [ ] **MdvIcon** — `icon`. Cover the optional icon-data dependency, individual imports, local SVG rendering, sizes, colors, and decorative/meaningful icons.
- [ ] **MdvIconButton** — `icon-button`. Cover variants, sizes, widths, shapes, actions/toggles, icons, loading/disabled states, colors, and accessible names.
- [ ] **MdvLinearProgress** — `linear-progress`. Cover determinate/indeterminate states, straight/wavy appearance, sizing, progress values, and accessible labels.
- [ ] **MdvList** — `list`. Includes `MdvListItem` and `MdvListSubheader`. Cover expressive/baseline variants, standard/segmented layouts, content slots, selection, independent actions, and dividers.
- [ ] **MdvLoadingIndicator** — `loading-indicator`. Cover supported appearances, sizing, animation/pause behavior, reduced motion, and loading announcements.
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
| **5 — next** | `MdvDivider`, `MdvFab`, `MdvFabMenu` |
| 6 | `MdvFullscreenDialog`, `MdvIcon`, `MdvIconButton` |
| 7 | `MdvLinearProgress`, `MdvList`, `MdvLoadingIndicator` |
| 8 | `MdvMenu`, `MdvNavigationBar`, `MdvNavigationDrawer` |
| 9 | `MdvNavigationRail`, `MdvRadio`, `MdvSearchBar` |
| 10 | `MdvSegmentedButton`, `MdvSelect`, `MdvSideSheet` |
| 11 | `MdvSlider`, `MdvSnackbar`, `MdvSplitButton` |
| 12 | `MdvSwitch`, `MdvTabs`, `MdvTextField` |
| 13 | `MdvTimePicker`, `MdvToolbar`, `MdvTooltip` |

## Latest completed batch

Batch 4 adds aligned English and Chinese articles for Date Picker, Date Range Picker, and Dialog, with 19 shared English demos and 38 matching displayed-source fences. Each page covers installed MDV 0.1.5 props/defaults, slots, models/events, methods, public types, native attributes, and accessibility. Navigation includes all 14 pages, sorted A-Z without the Mdv prefix, with localized badges and distinct icons.

- Date Picker examples cover responsive/explicit layouts, input/calendar views, constraints and field states, locale formatting versus interface labels, controlled date/close acceptance, custom triggers, and native submission/custom validity/reset. The article records the fixed 360px docked layout boundary and distinguishes accepted values, panel drafts, confirmation, close acceptance, and animation completion.
- Date Range Picker examples cover inclusive complete pairs, modal/fullscreen and text views, unavailable dates inside a range, reversed/incomplete input, parent rejection, separate ISO form fields, fieldset disabling, and reset. Each date demo includes a complete English labels object and can be copied independently.
- Dialog examples cover action results, rejected closure, retained/destroyed internal state, asynchronous guards, ordinary and native dialog forms, long content, nested dialogs, and local dark themes. The guide documents the default alertdialog role and explicitly uses role="dialog" for complex forms/content; close() acceptance is separate from the closed event.
- Added ten behavior tests for date entry/acceptance, native serialization/validation/reset, range constraints, Dialog results/focus, parent rejection/content lifecycle, async guards, native forms, and nesting. Both locales' navigation assertions include all 14 pages. `pnpm check` was blocked by the existing run-s launcher restriction (spawn EPERM); its stages passed separately: `pnpm type-check`, `pnpm test:unit` (14 files, 109 tests), and `pnpm build-only`. The build reports a 508.42 kB main JavaScript chunk (168.53 kB gzip), above Vite's 500 kB warning threshold; bundle optimization remains separate work.
- Production-preview checks covered all six localized routes, locale switching, localized A-Z navigation, heading/compact-outline navigation, highlighted source expansion, API/slot tables, 1280px desktop and 390px layouts, and light/dark presentation. Wide source and tables kept overflow inside their wrappers after page transitions settled. No page warnings or errors were captured.
- Browser interactions verified single-date arrow/Enter confirmation, invalid/valid modal input, range draft completeness and saving, mobile fullscreen calendars/input, and rejecting a controlled close once before accepting dismissal. Dialog checks covered action results, native required-form validation and saving, asynchronous dismissal, nested Escape/focus restoration with local theme inheritance, mobile sizing, and long-body overflow with available actions. Native dialog-form results, content destruction, and date form/reset edge cases additionally passed DOM tests with narrow mocks for jsdom's missing native dialog methods.
- No library defect was reproduced in this batch, and no library files were changed. Real touch gestures/keyboards, screen readers, IME, browser reduced-motion settings, forced colors, RTL, responsive migration while open, and cross-browser combinations remain unverified. Reduced-motion queries were enabled for relevant DOM tests; those tests do not establish visual motion quality.

Next batch: **MdvDivider**, **MdvFab** (including ExtendedFab), and **MdvFabMenu**.

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
