# MDV UI Documentation

The documentation site is a Vue 3 and Vite application. It uses MDV components for the shared interface and compiles Markdown files as Vue pages so articles can include reusable live examples.

See [ROADMAP.md](./ROADMAP.md) for the complete component coverage checklist, A-Z navigation rule, and batches of three documentation pages.

## Development

Use Node **24.22.1** and pnpm **12.14.0**. See [MAINTENANCE.md](./MAINTENANCE.md) for the development, testing, and submission workflow.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The site is available at `/en-US/...` and `/zh-CN/...`. Opening `/` selects the saved language preference, then falls back to the browser language.

## Content structure

- `src/content/registry.ts` defines localized navigation, page titles, URLs, and Markdown loaders.
- `src/content/en-US/` and `src/content/zh-CN/` contain the articles for each language.
- `src/components/docs/demos/<component>/<example>.vue` contains Vue examples shared by both language versions, such as `button/variant.vue` and `button/size.vue`.
- `src/locales/` contains translations for navigation and other short interface text.

To add a page, add its localized Markdown files, register the page and its route slug in `registry.ts`, then link it from the relevant article or demonstration. Keep article presentation rules under `.docs-prose` so they do not affect the MDV application shell or controls.

The drawer lists **Introduction** and **Setup** directly, followed by a divider and a collapsible **Components** group. Its children are automatically sorted A-Z by their full English component names, ignoring the `Mdv` prefix, with the same order in both locales. There are no static section headings or intermediate component groups. The group and page items use distinct icons. Define the hierarchy in `navigationItems`; routes are derived from the same registry, and navigating to a child page reveals its group.

The drawer and the Introduction component grid use the same English component names, such as `AppBar`. Outside the English locale, show the translated title as a drawer badge and card subtitle. The article title itself remains localized. The Introduction routes render `src/views/IntroductionPage.vue` without the article layout or outline. The root URL opens this landing page for the preferred locale.

At 768px and above, the App Bar shows separate **Color palette**, **Theme**, and **Language** buttons. On smaller screens, choose **More options → Color palette** to open the same swatches in a dialog. Theme and Language stay in separate push submenus. The 20 fixed swatches apply immediately and save the selection in the browser. **Default** restores the original colors. Light, dark, and system mode are independent of the palette, and changing the language keeps the current documentation page. Crossing the breakpoint closes the previous layout's panels.

### Heading links

Markdown headings automatically receive IDs and a `#` permalink in the left gutter, preserving the heading text's original alignment. Permalinks fade in when hovering a heading or focusing its link with the keyboard. Click the permalink to update the URL, or use the browser's **Copy link address** action to share a link directly to that section. Native fragment links and opening a section URL scroll smoothly inside the MDV scaffold after its Markdown page loads. Reduced-motion preferences disable smooth scrolling and permalink fades.

Manual scrolling updates the URL fragment to the heading at the top of the reading area, including the last section at the bottom of the article. These updates replace the current router location without adding browser history entries or moving the viewport. Anchor navigation keeps its requested fragment throughout smooth scrolling; tracking resumes when scrolling finishes or the reader interrupts it.

Reference a heading using an ordinary Markdown fragment link:

```md
## Code block title

[Jump to this section](#code-block-title)
[Open a section on another page](/en-US/getting-started/setup#1-install-the-package)
```

IDs keep Chinese characters, normalize and lowercase Latin text, remove punctuation, and replace whitespace or underscores with hyphens. For example, `Code block title` becomes `code-block-title`, and `代码块标题` remains `代码块标题`. Repeated IDs within a page receive `-1`, `-2`, and subsequent suffixes. Renaming a heading can change its URL; use the generated permalink when sharing or referencing it.

### Page outline

The shared **On this page** outline is generated automatically from the article's Markdown headings. Use one H1 for the article title, H2 for sections, and H3 for nested sections:

```md
# Button

## Color

### Custom colors

## API

### Props

### Slots
```

H3 entries appear below their nearest H2 with a small indentation. H4 through H6 remain valid link targets and highlight their nearest listed section. Headings inside live Vue demonstrations and hidden content are excluded; no per-page outline configuration is needed.

At viewport widths of 1280px and above, the outline stays on the right while reading. On narrower screens it becomes a collapsible panel before the article and closes after selecting a section. Its height and chevron animate together using the same MDV motion tokens as Example code; collapsed links are excluded from keyboard navigation and assistive technology. Section navigation waits for the compact collapse to finish so smooth scrolling uses the article's final position. Reopening the outline or leaving the page cancels a pending selection. Reduced-motion preferences disable these transitions. Pages without H2 or H3 headings have no outline. Links share the existing smooth scrolling and URL fragment tracking. One outlined selection indicator moves between entries and adjusts its width and height using MDV's 500ms standard easing, matching the Material Design 3 site. Layout changes reposition it immediately, and reduced-motion preferences disable the transition. Changing the page or language refreshes the entries automatically.

### Code formatting

Use backticks for inline code, such as `pnpm`. Inline code uses MDV's secondary-container background and on-secondary-container text, matching the selected sidebar item and following the active theme.

For syntax highlighting, add a language identifier to a fenced code block:

````md
```sh
pnpm add @mdv-ui/mdv
```
````

Shiki highlights fenced code during Vite's Markdown compilation, so its highlighter and language data stay out of the browser bundle. Use language identifiers such as `sh`, `ts`, `vue`, `css`, or `json`; omit the identifier or use `text` for plain text. Both light and dark token colors are generated together, and article CSS selects them through MDV's inherited `color-scheme`, including system mode.

Append `:line-numbers` to a fence's language identifier to enable a numbered gutter:

````md
```ts:line-numbers
// Enable line numbers
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```
````

Line numbers start at 1 and include blank lines. The gutter follows the active theme, stays in place while long code lines scroll horizontally, and is excluded from text selection, clipboard copying, and screen readers. Numbering is off by default and can be enabled independently for standalone fences or any fence inside a code-tab group; the language label still shows only the language name. Use `text:line-numbers` for numbered plain text.

Group alternative commands or files with `::: code-tabs` and `@tab` labels:

````md
::: code-tabs
@tab npm
```sh
npm install @mdv-ui/mdv
```

@tab pnpm
```sh
pnpm add @mdv-ui/mdv
```
:::
````

Each tab needs a nonempty label followed by exactly one fenced code block. Labels are literal text, including filenames such as `config.js` and `config.ts`. Each group selects its first tab independently; arrow keys, Home, and End move and activate tabs. Tab strips and long code lines scroll horizontally on narrow screens.

The Vite Markdown pipeline automatically imports local code wrappers only when used. Both standalone fences and tabbed fences use MDV's filled-card surface and corner tokens, theme colors, and language-label styling. The language label sits in the upper-right padding above the first code line, avoiding overlap during horizontal scrolling without adding a toolbar row. At desktop widths (768px and above) with a fine pointer and hover support, hover the top-right control area or focus its button with the keyboard to crossfade the language label into an MDV copy button; moving away fades back to the label. Mobile and touch devices show only the language label, with copy actions hidden from display and keyboard navigation. Reduced-motion settings disable the fade. Successful copying changes the clipboard icon and shows localized feedback for two seconds. Copying uses the current fence's plain text, without syntax markup or surrounding interface text.

Code tabs are a local text-only adaptation of MDV Primary Tabs, including primary-colored selection, state layers, ripples, keyboard navigation, and a rounded spring indicator sized to the text label; articles do not need component imports. See `THIRD_PARTY_NOTICES.md` for retained source notices.

### Component demonstrations

Use `DemoBlock` as the shared shell for component examples. The default slot contains the live preview, and the `source` slot contains ordinary Markdown code fences. Keep a blank line before and after the fence inside the slot:

````md
<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ButtonVariantDemo from '@/components/docs/demos/button/variant.vue'
</script>

<DemoBlock>
  <ButtonVariantDemo />
  <template #source>

```vue
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <MdvButton>Filled</MdvButton>
</template>
```

  </template>
</DemoBlock>
````

The article heading names the example. The shell supplies the outlined container, preview spacing, divider, and centered **Example code** button. Expanding reveals code between the divider and the button, pushing the button and following content down smoothly. It retains the preview and source nodes when collapsed, removes hidden code from interaction and screen readers, and disables motion for reduced-motion preferences. Each shell expands independently.

The preview stretches its content across the available width using a single `minmax(0, 1fr)` grid column. Article typography excludes preview descendants, preserving component heading sizes, spacing, links, and native element styles. Demo components can wrap their controls within that width; do not shrink wrapping groups to their labels' intrinsic widths, which can cause short Chinese labels to wrap before the container is actually full.

Fences in the source slot use the same build-time syntax highlighting, line numbers, language labels, and copy controls as article code blocks. Keep reusable demo components focused on the preview; place explanatory source snippets in the localized articles and update them alongside changes to the live example.

Use the Button page as the editorial reference: introduce the component in a sentence, show the common case first, and explain each example briefly. Keep complete API tables and constraints that affect usage. Avoid stretching the article into a test matrix or repeating the same behavior in both prose and the API. Keep package baselines, investigation notes, and validation results in the roadmap rather than repeating them on each component page.

### Content tables

Wrap ordinary Markdown tables in `DocsTable` for the shared MDV surface, rounded border, header background, cell padding, and row/column dividers. Leave blank lines between the component tags and Markdown so the table is parsed correctly:

````md
<script setup lang="ts">
import DocsTable from '@/components/docs/DocsTable.vue'
</script>

<DocsTable label="App Bar heights">

| Size | Without subtitle | With subtitle |
| --- | --- | --- |
| Small | 64px | 64px |
| Medium flexible | 112px | 136px |

</DocsTable>
````

Set `label` to a localized, descriptive name for the keyboard-accessible scroll region. Inline code, links, and other Markdown formatting remain available in cells. Tables fill the available width; their default minimum width of `24rem` scrolls inside the wrapper on narrow screens. Use `min-width` to override that minimum when the content needs it. Native HTML tables can also go in the default slot.

`ApiTable` and `SlotsTable` reuse this shell and `docs-table.css`; their metadata columns and description rows remain in `api-table.css`. Do not leave article tables unwrapped or duplicate the shell styles per page.

### API and slot tables

Use `src/components/docs/ApiTable.vue` for props and `SlotsTable.vue` for slots. Both accept an `items` array, display each description below its metadata, and use MDV theme tokens. Keep localized descriptions in the article. Table headers follow the active site locale automatically.

```md
<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'

const props: ApiTableItem[] = [
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Fills the parent width.' },
]

const slots: SlotTableItem[] = [
  { name: 'default', description: 'The button label.' },
]
</script>

## Props

<ApiTable :items="props" />

## Slots

<SlotsTable :items="slots" />
```

`ApiTableItem` uses `name` for the JavaScript prop name, `type` for its displayed type, and optional `default` and `description` strings. Write default values as code literals, such as `"'filled'"` or `'false'`; omitted defaults display an em dash. The template attribute is derived automatically (`fullWidth` becomes `full-width`); supply `attribute` only when it needs a different spelling. These are Vue props, so the table does not include a Web Components `Reflect` column. `SlotTableItem` uses `name` and an optional `description`.

For formatted descriptions, add a named slot using the item's exact JavaScript name. It replaces the plain `description` string. Both tables support this pattern, including scoped access to the item as `{ item }`. Keep blank lines around Markdown content and put the slot tags at the start of the line so the closing tag is not parsed as part of a Markdown list:

```md
<ApiTable :items="props">
<template #description-fullWidth>

Set `full-width` to fill the available width.

- The default is `false`.
- The width follows the parent container.

</template>
</ApiTable>
```

The props table scrolls horizontally within its rounded container on narrow screens. The scroll region is keyboard-focusable, and native captions and headers associate descriptions with their prop or slot names. Text values are rendered as text; use Markdown slots rather than raw HTML strings. See the localized Button articles for a complete example.

## Validation

```sh
pnpm check
```

This runs type checking, Vitest, and the production build in sequence. CI runs the same command on pushes and manual workflow dispatches.

Use `pnpm test:watch` while developing, or `pnpm test:unit -- tests/code-block.test.ts` to run a specific suite once. Tests and fixtures live in `tests/` and are committed with the application; generated output stays ignored.
