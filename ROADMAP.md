# Documentation Roadmap

Updated: 2026-11-19. Documentation dependency: **@mdv-ui/mdv 0.1.5**.

This is the local checklist for documenting MDV in this repository. Use it to select, implement, and review three component pages at a time. Read [AGENTS.md](./AGENTS.md) for project decisions and [MAINTENANCE.md](./MAINTENANCE.md) for validation procedures.

## Inventory and current status

The inventory was checked against the sibling library's `src/index.ts`, `COMPONENTS.md`, `ROADMAP.md`, and playground catalog, and the installed package's public declarations and component sources.

- The library exports **67 public Vue components**. All 67 are assigned exactly once to **41 documentation pages** below.
- **32 pages are complete:** App Bar, Autocomplete, Badge, Bottom Sheet, Button, Button Group, Card, Carousel, Checkbox, Chip, Circular Progress, Date Picker, Date Range Picker, Dialog, Divider, Fab, Fab Menu, Fullscreen Dialog, Icon, Icon Button, Linear Progress, List, Loading Indicator, Menu, Navigation Bar, Navigation Drawer, Navigation Rail, Radio, Search Bar, Segmented Button, Select, and Side Sheet. **9 pages remain**, arranged into **3 batches of 3**.
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
- [x] **MdvMenu** — `menu`. Includes `MdvContextMenu`, `MdvMenuGroup`, and `MdvMenuItem`. Covers ordinary/context triggers, variants, grouped surfaces, strict-value selection, controlled requests, cancellation, three-level flyout/push navigation, scrolling, themes, keyboard operation, and modal focus composition.
- [x] **MdvNavigationBar** — `navigation-bar`. Includes `MdvNavigationBarItem`. Covers automatic/explicit item orientation, fixed-anchor containment, application-owned destination state, real router links, disabled callback checks, active icons, badges, safe-area ownership, themes, and RTL.
- [x] **MdvNavigationDrawer** — `navigation-drawer`. Includes `MdvModalNavigationDrawer`, `MdvNavigationDrawerGroup`, and `MdvNavigationDrawerItem`. Covers standard/modal layouts, headings/disclosures/badges, controlled updates, close policy and guards, content retention, responsive replacement, App Bar adjacency, swipe rules, themes, RTL, keyboard navigation, and focus.
- [x] **MdvNavigationRail** — `navigation-rail`. Includes `MdvModalNavigationRail` and `MdvNavigationRailItem`. Cover collapsed/expanded presentation, standard/modal layouts, alignment, labels, badges, scrolling, and focus.
- [x] **MdvRadio** — `radio`. Includes `MdvRadioGroup`. Cover standalone/group models, mutual exclusion, orientation, labels, colors, disabled/error states, keyboard navigation, and form validation.
- [x] **MdvSearchBar** — `search-bar`. Includes `MdvSearchView` and `MdvSearchAppBar`. Cover contained/divided appearance, docked/fullscreen results, controlled input/opening, IME, result slots, focus, and App Bar composition.
- [x] **MdvSegmentedButton** — `segmented-button`. Includes `MdvSegmentedButtonItem`. Covers classic single/multiple selection, interaction constraints, strict values, densities, full-width overflow, icons, controlled rejection/cancellation, keyboard rules, native/external forms, and reset.
- [x] **MdvSelect** — `select`. Covers typed single-choice models, filled/outlined fields, expressive/baseline listboxes, custom options, controlled value/open requests, disabled/error states, explicit clearing, application-managed loading/retry, native forms, validation, and reset. Records the current empty-popup localization limitation.
- [x] **MdvSideSheet** — `side-sheet`. Includes `MdvSideSheetScaffold`. Covers modal/standard layouts, logical placement, attached/detached appearance, actual main-area resizing, independent scrolling, close policies/guards, native dialog forms, content retention, gestures, focus, local themes, RTL, and nested overlays.
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
| 8 — complete | `MdvMenu`, `MdvNavigationBar`, `MdvNavigationDrawer` |
| 9 — complete | `MdvNavigationRail`, `MdvRadio`, `MdvSearchBar` |
| 10 — complete | `MdvSegmentedButton`, `MdvSelect`, `MdvSideSheet` |
| **11 — next** | `MdvSlider`, `MdvSnackbar`, `MdvSplitButton` |
| 12 | `MdvSwitch`, `MdvTabs`, `MdvTextField` |
| 13 | `MdvTimePicker`, `MdvToolbar`, `MdvTooltip` |

## Latest completed batch

Batch 10 adds aligned English and Chinese articles for Segmented Button, Select, and Side Sheet, with 18 shared English demos and 36 displayed-source fences synchronized with their live components. The 13 reviewed installed MDV 0.1.5 component, helper, and type files match the sibling source after line-ending normalization. Navigation includes all 32 pages, sorted A-Z without the Mdv prefix, with localized badges and distinct icons.

- Segmented Button covers single/multiple models, optional clearing and last-value protection, strict values, density and minimum targets, equal widths and local overflow, leading/selected/icon-only slots, controlled rejection and native cancellation, Tab/arrow selection differences, local themes and RTL, disabled fieldsets, external forms, repeated-name submission, initial-snapshot reset, both APIs/methods, and all four exported types. Articles distinguish interaction requirements from native validation and link to Expressive Button Group.
- Select covers the public 0.1.5 API, typed values and label presentation, filled/outlined fields, expressive/baseline listboxes, supporting text and custom options, independent value/open acceptance, select-event semantics, explicit clearing, loading/cancellation/failure/retry owned by the application, form association, one-value submission, empty-value/native/custom validation, reset cleanup, keyboard/typeahead rules, local themes, RTL, methods, and all seven public Select types. No undocumented loading or clearable props are presented as public capabilities.
- Side Sheet covers Modal and Standard with separate slot ownership, attached/detached surfaces, logical placement and width limits, real main-area resizing and independent scrolling, explicit Standard focus, close policies and rejection, retained/destroyed child state, asynchronous Keep/Discard/Save decisions, native dialog form validation/results, nested Dialog/Select composition, local themes, RTL, gesture scope, all props/events/methods, and seven exported types.
- Added 16 behavior tests for segmented selection/navigation/cancellation/strict values and form reset, Select keyboard and typed values, clear/error semantics, controlled requests, loading cancellation/retry/cleanup, external forms and custom-error reset, sheet focus/back/results, Standard focus and availability, close rejection/policy, retained/destroyed state, async guards, dialog forms, and nested focus restoration. Both locales' drawer assertions include all 32 pages.
- Validation: the shared `pnpm check` launcher remains blocked by spawn EPERM. Its stages passed separately: `pnpm type-check`, `pnpm test:unit` (20 files, 182 tests), and `pnpm build-only` (711 modules). The main JavaScript chunk is approximately 637 kB (200 kB gzip), still above Vite's existing 500 kB warning threshold; bundle optimization remains separate work. Source-fence parity and UTF-8/LF checks are part of the final review.
- Production-preview checks covered all six localized routes, outlines/API/slot tables, 1280px desktop and 390px mobile layouts without page/demo horizontal overflow, segmented mouse selection and multiple selection, Select keyboard commit/disabled skipping/strict values, desktop pointer opening and a locally dark RTL baseline popup. Side Sheet checks covered actual Standard resizing (522px main area to about 287px beside a 235px track on desktop; 296px to 116px beside 180px on mobile), independent main/panel scrolling, explicit focus, Modal autofocus, application back navigation, action close results and focus restoration, Keep/Discard behavior, and mobile native form validation and FormData submission. The sibling library was not modified.
- Real touch/swipe, screen readers, forced colors, browser reduced-motion settings, visual-viewport keyboards, SSR/hydration, KeepAlive, and cross-browser combinations remain unverified. Theme/RTL demos for Segmented Button and Side Sheet are implemented but not exhaustively exercised in the browser. Tests use reduced motion and do not establish motion quality. Browser automation initially required one retry after origin auto-review timed out; background animation completion sometimes outlived an action window, so settled state was checked separately. No animation timing claim is based on those waits.

Next batch: **MdvSlider**, **MdvSnackbar** (including Provider and useSnackbar), and **MdvSplitButton**.

## Open MDV integration feedback

- **NavigationBarItem disabled link callbacks (MDV 0.1.5):** use a custom RouterLink slot and bind its `navigate` callback to a NavigationBarItem with both `href` and `disabled`. Clicking the disabled anchor removes native href navigation but still invokes the supplied callback, allowing router navigation. Expected: a disabled destination blocks activation listeners as the other MDV navigation items do. The installed and sibling sources both forward listeners without a disabled activation guard. The docs demo now checks the disabled state before calling `navigate`, and its regression test verifies the route remains unchanged. The localized articles explain this current callback limitation. This is an application-level callback check, not a CSS override; a library fix and package-consumer verification remain open under MDV's collaboration workflow.

- **Radio Group reported-validity residue (MDV 0.1.5, reproduced in production preview):** open the Radio page's external-form demo with no selection and activate Report validity; then select Express and submit. FormData contains delivery=express and every native radio is valid, while the originally required Standard input retains aria-invalid=true and the mdv-radio--error class after the group clears its own error. Expected: all grouped option error/ARIA states resynchronize after correction or reset. MdvRadio retains its own reported nativeInvalid flag and does not refresh it in grouped onUpdated handling. The articles expose this limitation and the docs do not hide it with CSS. A library fix remains open.
- **Radio Group class forwarding (MDV 0.1.5, source-confirmed):** pass a class to MdvRadioGroup. inheritAttrs is false, rootAttrs removes class, and the fieldset class binding contains only library classes, so the caller's class is dropped; style is forwarded explicitly. Expected: ordinary root class attributes are merged consistently. Articles recommend a surrounding layout container pending library review; no internal styling override is added.
- **Search View internal region localization (MDV 0.1.5, source- and browser-confirmed):** open an English SearchView with English placeholder/label, clearLabel, backLabel, and statusText. Its internal results region still has the fixed Chinese accessible name 搜索建议与结果. Expected: applications can localize this internal accessible name through an agreed library API or locale capability. Existing props do not change it. Articles distinguish this limitation from the configurable Chinese defaults; a library API decision remains open.
- **Select empty-list localization (MDV 0.1.5, source-confirmed):** open a Select whose options array is empty in an English application. The shared control's fallback status is 没有匹配项, while the public MdvSelectProps/MdvSelectBaseProps do not expose noOptionsText (it is public only on Autocomplete). Expected: the empty status has an agreed localization API. The articles describe the limitation and the option-loading example supplies application-owned status/disabled policy. No undocumented pass-through prop or CSS workaround is used; a library API decision remains open.

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
