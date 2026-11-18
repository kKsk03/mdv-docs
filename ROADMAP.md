# Documentation Roadmap

Updated: 2026-11-18. Documentation dependency: **@mdv-ui/mdv 0.1.5**.

This is the local checklist for documenting MDV in this repository. Use it to select, implement, and review three component pages at a time. Read [AGENTS.md](./AGENTS.md) for project decisions and [MAINTENANCE.md](./MAINTENANCE.md) for validation procedures.

## Inventory and current status

The inventory was checked against the sibling library's `src/index.ts`, `COMPONENTS.md`, `ROADMAP.md`, and playground catalog, and the installed package's public declarations and component sources.

- The library exports **67 public Vue components**. All 67 are assigned exactly once to **41 documentation pages** below.
- **5 pages are complete:** App Bar, Autocomplete, Badge, Button, and Checkbox. **36 pages remain**, arranged into **12 batches of 3**.
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

- [x] Implement stable A-Z component ordering in the registry and update navigation regression coverage. Both locales now use AppBar, Autocomplete, Badge, Button, Checkbox; future entries are sorted automatically.

## Component checklist (A-Z)

The leading component name is the page's sidebar label and sorting key. Slugs below are relative to `/<locale>/components/`; Button and Checkbox retain their existing URLs.

- [x] **MdvAppBar** — `app-bar`. Includes `MdvAppBarScaffold`. Covers sizes, appearance, title alignment, images, scrolling, and scaffold/navigation composition.
- [x] **MdvAutocomplete** — `autocomplete`. Covers editable suggestions, free-text values, local filtering, application-managed remote search, loading, and form behavior.
- [x] **MdvBadge** — `badge`. Covers small dots, large content, counts, placement, accessible naming, and composition with interactive content.
- [ ] **MdvBottomSheet** — `bottom-sheet`. Includes `MdvBottomSheetScaffold`. Cover modal and standard layouts, height states, gestures, scrolling, focus, and close behavior.
- [x] **MdvButton** — `button`. Existing reference page covering variants, sizes, shapes, colors, icons, links, loading, disabled states, and API.
- [ ] **MdvButtonGroup** — `button-group`. Includes `MdvButtonGroupItem`. Cover standard/connected layouts, actions, independent toggles, selection, sizing, and keyboard behavior.
- [ ] **MdvCard** — `card`. Cover outlined/filled/elevated variants, content slots, internal actions, whole-card actions/links, disabled states, and semantics.
- [ ] **MdvCarousel** — `carousel`. Cover supported layouts, media, item keys, controlled navigation, alternative controls, dragging, keyboard operation, and reduced motion.
- [x] **MdvCheckbox** — `checkbox`. Covers boolean/array models, indeterminate state, select-all, labels, colors, disabled/error states, forms, and API.
- [ ] **MdvChip** — `chip`. Includes `MdvChipSet`. Cover chip variants, selection, removal, leading/trailing content, colors, wrapping, and keyboard behavior.
- [ ] **MdvCircularProgress** — `circular-progress`. Cover determinate/indeterminate states, straight/wavy appearance, sizing, progress values, and accessible labels.
- [ ] **MdvDatePicker** — `date-picker`. Cover single-date values, supported layouts, text/calendar entry, date restrictions, locale labels, keyboard behavior, and forms.
- [ ] **MdvDateRangePicker** — `date-range-picker`. Cover complete ranges, supported modal/fullscreen layouts, range restrictions, entry, validation, and forms.
- [ ] **MdvDialog** — `dialog`. Cover content/actions, controlled opening, close policy, async confirmation, focus restoration, scrolling, forms, and nested overlays.
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
| **2 — next** | `MdvBottomSheet`, `MdvButtonGroup`, `MdvCard` |
| 3 | `MdvCarousel`, `MdvChip`, `MdvCircularProgress` |
| 4 | `MdvDatePicker`, `MdvDateRangePicker`, `MdvDialog` |
| 5 | `MdvDivider`, `MdvFab`, `MdvFabMenu` |
| 6 | `MdvFullscreenDialog`, `MdvIcon`, `MdvIconButton` |
| 7 | `MdvLinearProgress`, `MdvList`, `MdvLoadingIndicator` |
| 8 | `MdvMenu`, `MdvNavigationBar`, `MdvNavigationDrawer` |
| 9 | `MdvNavigationRail`, `MdvRadio`, `MdvSearchBar` |
| 10 | `MdvSegmentedButton`, `MdvSelect`, `MdvSideSheet` |
| 11 | `MdvSlider`, `MdvSnackbar`, `MdvSplitButton` |
| 12 | `MdvSwitch`, `MdvTabs`, `MdvTextField` |
| 13 | `MdvTimePicker`, `MdvToolbar`, `MdvTooltip` |

## Latest completed batch

Batch 1 adds aligned English and Chinese articles for App Bar (including Scaffold), Autocomplete, and Badge, with 17 shared English demos, matching source fences, API and slot tables, events, methods, native attributes, and accessibility guidance. Examples use the installed MDV 0.1.5 APIs.

- Navigation is sorted automatically by the full English component name, ignoring `Mdv`; regression coverage checks the order and localized badges in both languages.
- Ordinary article tables now use `DocsTable`, sharing the MDV surface, cell spacing, dividers, and keyboard-accessible horizontal scrolling with API/Slots tables. Both localized App Bar height and scroll-behavior tables use the wrapper; desktop light/dark and 390px overflow checks passed.
- Fixed a documentation integration issue found during browser review: article typography was overriding live App Bar heading sizes, weight, and margins. Prose element styles now exclude demo previews, preserving MDV rendering without library overrides.
- `pnpm check` was blocked by the `run-s` launcher with `spawn EPERM`. Running its stages separately succeeded: `pnpm type-check`, `pnpm test:unit` (11 files, 82 tests), and `pnpm build-only`. The production build also passed after the typography correction.
- Production-preview browser checks covered all six direct locale routes, language switching on the current page, heading navigation, highlighted source expansion, API tables, light/dark presentation, and 390px/1280px layouts. All six pages fit the narrow content region; code and API overflow stays inside its own wrapper. No browser warnings or errors were captured.
- Interactive browser checks covered all four App Bar scroll modes, collapse/reverse scrolling, and its own Scaffold back-to-top action; Autocomplete filtering, disabled suggestions, keyboard selection, free text, simulated loading/empty results, required validation, model submission, and reset; Badge count formatting, clearing/restoring the indicator, and preserving button state when hidden.
- Behavior tests cover stale-search cancellation and unmount cleanup, Autocomplete form submission/reset, Badge state composition, and reduced-motion handling for the App Bar demo's back-to-top action. Real touch, screen readers, IME composition, browser reduced-motion settings, RTL, and custom local themes remain unverified in this batch.

Next batch: **MdvBottomSheet** (including Scaffold), **MdvButtonGroup** (including Item), and **MdvCard**.

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
