# MDV Docs Maintenance

This guide defines the workflow for the standalone documentation site. `AGENTS.md` records collaboration rules, `README.md` covers article authoring, and configuration files define the actual commands and behavior.

## Toolchain and installation

- Use Node **24.22.1** and pnpm **12.14.0**. `package.json` pins the package manager.
- Run commands from the repository root. Keep the pnpm store in its user-level or global location.
- Use the committed lockfile for ordinary setup and CI:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

When adding or updating a dependency, use pnpm and commit `package.json` and `pnpm-lock.yaml` together. Verify that a frozen-lockfile installation succeeds after the update. Do not delete the lockfile or add release-age policy exceptions to work around unrelated dependency errors.

The current Vue tooling uses TypeScript 6 with `vue-tsc` 3. TypeScript 7 is incompatible with the current `vue-tsc` command because it does not export `typescript/lib/tsc`. Upgrade these tools as a compatible combination and run the complete validation gate before changing the supported combination.

The production CSS target is Chrome/Edge 120, Firefox 114, and Safari/iOS 16.4. Keep native `:dir()` selectors: Vite's default Chrome/Edge 111 target lowers them to language selectors, which do not preserve an explicit or inherited `dir="rtl"` in English and Chinese examples. JavaScript keeps Vite's default target. After changing CSS targets or minification, verify scoped RTL in the production preview, including Linear Progress graphic mirroring; a development preview alone does not cover this transformation.

## Change workflow

1. Read the relevant source, localized articles, and existing tests. Identify the scope and expected behavior before editing.
2. Keep changes focused. Use MDV components for shared controls, preserve the custom Vue/Vite site, and register pages through `src/content/registry.ts`.
3. Keep English and Simplified Chinese articles aligned. Share interactive demonstrations rather than duplicating them by locale.
4. For functional fixes, reproduce the failure and add or update a meaningful regression test. For article-only or cosmetic edits, verify the affected content or appearance without adding tests that merely repeat the implementation.
5. Run focused tests during development, then `pnpm check` before submission. Review the diff, verify affected links and examples, and report the actual validation results and any remaining limitations.
6. Commit, push, and deploy only when requested. Keep generated output out of commits.

When an MDV component behaves incorrectly, identify whether the defect belongs to the library or this site's integration. Record reproduction steps and expected behavior. Fix library defects in the separate `mdv` repository under its collaboration rules, then verify the published dependency here. Avoid documentation-level overrides that hide library defects.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the documentation development server. |
| `pnpm test:watch` | Run Vitest in watch mode during development. |
| `pnpm test:unit` | Run all unit and DOM interaction tests once. |
| `pnpm test:unit -- tests/code-block.test.ts` | Run one test file once. |
| `pnpm type-check` | Check application, build-tool, and test TypeScript projects. |
| `pnpm build-only` | Compile production assets into `dist/`. |
| `pnpm build` | Run type checking and the production build. |
| `pnpm check` | Run type checking, unit tests, and the production build in sequence; stop on failure. |
| `pnpm preview` | Serve an existing production build for inspection. |

`pnpm check` is the shared submission gate for local development and CI. `pnpm build` does not run unit tests. A successful build alone does not establish that interactive behavior works.

## Test structure and conventions

| Location | Responsibility |
| --- | --- |
| `tests/*.test.ts` | Behavioral regression suites for Markdown, demo shells, code controls, and article navigation. |
| `tests/fixtures/` | Small input documents needed by integration tests. |
| `tests/setup.ts` | Shared DOM setup, reduced-motion control, and fixture cleanup. |
| `tests/markdown.ts` | Compile Markdown through the actual Vite pipeline for parser assertions. |
| `vitest.config.ts` | Reuse Vite's Vue and Markdown plugins and configure the jsdom environment. |
| `tsconfig.vitest.json` | Type checking for test files and imported Vue components. |

- Import `test`, `expect`, and `vi` from `vitest`. Import `.vue` components directly and mount them with Vue Test Utils. Keep real MDV controls in integration tests unless a test specifically needs to isolate an external boundary.
- Keep tests in `tests/` with the `.test.ts` suffix. Retain fixtures and test configuration in Git. New tests should cover observable behavior, meaningful failure paths, or a concrete regression.
- Share the production Markdown transforms and aliases through Vite configuration. Test mode omits development tools and Tailwind processing. Do not maintain a second Markdown implementation or manually compile and load SFC JavaScript.
- Use `vi.fn`, `vi.spyOn`, and fake timers for deterministic interactions. Await Vue updates and asynchronous actions; avoid arbitrary sleeps and synthetic event timestamp workarounds.
- The shared setup automatically unmounts Vue Test Utils wrappers, clears the test document, restores real timers, and supplies reduced-motion queries. Vitest restores spies and stubbed globals between tests. Fixtures must still dispose external subscriptions, observers, router hooks, and custom resources that Vue does not own.
- jsdom does not implement every browser API. The shared setup uses Node's `Blob` for build-time Shiki because jsdom lacks `Blob.stream()`. Keep any additional mocks narrow and tied to the behavior under test.
- Keep pure source helpers under `build/` or `src/` as appropriate; production code must not import tests or fixtures. Vite starts the application at `index.html`, so test files and development dependencies are outside the production module graph.

Unit tests cannot verify actual layout, hover rendering, touch input, or motion quality. For changes affecting those areas, inspect the relevant page in a browser using light and dark themes, the affected desktop/mobile widths, keyboard focus, and reduced motion as applicable. For Markdown or routing changes, check both locales, section links, and direct page loading. Report browser checks as unverified when they were not performed.

## Git and text files

- Commit source, localized articles, tests, configuration, and the pnpm lockfile.
- Keep `node_modules/`, `dist/`, `coverage/`, caches, and generated reports ignored. Do not ignore `tests/`.
- Write text as UTF-8 with LF line endings. `.editorconfig` defines editor defaults and preserves meaningful Markdown trailing spaces; `.gitattributes` keeps Git text line endings consistent.
- Write maintainer documentation in English. Article text follows its locale, and examples can retain intentional multilingual test inputs.
- Before submission, inspect `git status --short` and the staged diff. Preserve unrelated local changes and describe the concrete behavior changed and the checks actually completed.

## Continuous integration

`.github/workflows/ci.yml` runs on branch pushes and manual workflow dispatches. It uses the same Node and pnpm baseline, installs with `--frozen-lockfile`, and runs `pnpm check`. It cancels an older run when a newer push targets the same branch. The workflow has read-only repository permissions and does not deploy the site.

If a gate fails, reproduce the reported command locally and fix the failing behavior or tooling. Do not hide failures by skipping suites, using `passWithNoTests`, or weakening assertions. After a relevant fix, rerun the affected check and complete the remaining gate. If a system restriction blocks a check, record the limitation without claiming success.
