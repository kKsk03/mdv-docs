# MDV UI Documentation

The documentation site is a Vue 3 and Vite application. It uses MDV components for the shared interface and compiles Markdown files as Vue pages so articles can include reusable live examples.

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
- `src/components/docs/demos/` contains Vue examples that can be shared by both language versions.
- `src/locales/` contains translations for navigation and other short interface text.

To add a page, add its localized Markdown files, register the page and its route slug in `registry.ts`, then link it from the relevant article or demonstration. Keep article presentation rules under `.docs-prose` so they do not affect the MDV application shell or controls.

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

## Validation

```sh
pnpm check
```

This runs type checking, Vitest, and the production build in sequence. CI runs the same command on pushes and manual workflow dispatches.

Use `pnpm test:watch` while developing, or `pnpm test:unit -- tests/code-block.test.ts` to run a specific suite once. Tests and fixtures live in `tests/` and are committed with the application; generated output stays ignored.
