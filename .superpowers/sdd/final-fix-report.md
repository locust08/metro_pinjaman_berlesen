# Final Whole-Branch Review Fix Report

Date: 2026-07-13

Status: DONE_WITH_CONCERNS

## Scope Completed

1. Stored XSS and unsafe URL bindings
   - Editor text is HTML-escaped before it is passed to `node-html-parser`.
   - `href` values allow only HTTP, HTTPS, mailto, tel, or same-origin relative paths.
   - Image `src` values allow only HTTP, HTTPS, or same-origin relative paths.
   - Unsafe CMS URL overrides leave the safe legacy attribute unchanged.
   - Regression coverage proves hostile `<script>` and `<img onerror>` text cannot create nodes and cannot increase the number of legacy scripts recreated by `legacyPage.tsx`.

2. Payload media origins
   - Added public, non-secret `PAYLOAD_PUBLIC_SERVER_URL` configuration with the current Worker URL as fallback.
   - Payload `serverURL` uses the same configuration.
   - `/api/media/file/...` values are normalized to absolute CMS-origin URLs in the published endpoint.

3. SEO production output
   - `loadLegacyPage` now selects each page's merged Payload/default SEO title and description.
   - `LegacyPage` sends both values to Next Head during static generation.
   - Integration coverage exercises the path through `loadLegacyPage`.

4. Inactive editor fields
   - Wired all four home statistic values to the existing animated counter targets without changing counter behavior.
   - Wired all five SEO descriptions through `LegacyPageContent.description` and Next Head.
   - Removed ten fields that could not map one-to-one without changing forms, links, or composite text: telephone target, WhatsApp target/message, business hours, four form-state messages, phone-card description, and still-have-questions description.
   - Updated Payload schemas, canonical defaults, generated Payload types, mapping documentation, and schema tests. No editor field remains documented as inactive.

5. Draft-aware seed behavior
   - Seed reads the latest Global state with `draft: true`.
   - Pending draft updates are written with `draft: true`; published or uninitialized content retains published seed behavior.
   - Existing nested admin values are omitted from seed updates.

6. Deploy hook timeout
   - Added a 10-second AbortController timeout.
   - Timeout, network, and non-OK failures remain redacted, non-throwing, and do not roll back saved content.

7. Whole-range whitespace
   - Removed trailing generated declaration whitespace and space-before-tab indentation from the two generated SQL migration templates.
   - Both working-diff and whole-range `git diff --check` complete with exit code 0 and no whitespace errors.

## TDD Evidence

- Frontend regressions initially failed on executable-node creation, unsafe URL replacement, missing counter targets, and the absent SEO Head property.
- CMS regressions initially failed on relative media URLs, exposed inactive fields, published-only seed reads/writes, and the missing deploy abort.
- Focused green runs:
  - `node --test tests/payload-render.test.mjs tests/legacy-page-data.test.mjs`: exit 0; 9 passed, 0 failed.
  - `pnpm --dir cms exec vitest run tests/schema.test.mts tests/publishedContent.test.mts tests/seedContent.test.mts tests/deployHook.test.mts`: exit 0; 4 files passed, 18 tests passed.

## Required Verification Results

- `npm test`: exit 0; 15 passed, 0 failed, 0 skipped.
- `npm run type-check`: exit 0; `tsc --noEmit` completed without diagnostics.
- `npm run build`: exit 0; production build compiled and exported all 12 static/SSG routes.
- `pnpm --dir cms exec vitest run`: exit 0; 4 files passed and 1 environment-gated file skipped; 18 tests passed and 1 skipped.
- `pnpm --dir cms run build`: exit 0; production build compiled, type-checked, and generated all 7 CMS routes.
- `git diff --check`: exit 0; no whitespace errors.
- `git diff --check 1839e70ba7c1d9c234fc0563bd2734133d7a76a3`: exit 0; no whole-range whitespace errors.
- `pnpm --dir cms run generate:types:payload`: exit 0; generated `cms/src/payload-types.ts`.

## Concerns And Warnings

- Root Node tests emit the pre-existing `MODULE_TYPELESS_PACKAGE_JSON` warning.
- Root Next build emits the pre-existing multiple-lockfile workspace-root warning.
- CMS build emits pre-existing lint warnings in `src/app/my-route/route.ts`, generated migrations, and the existing logger cast in `src/payload.config.ts`; build exit remains 0.
- The CMS API integration test remains skipped when `PAYLOAD_SECRET`/live local CMS environment is unavailable. No live D1 seed or live deploy-hook request was performed; deterministic mocked coverage passed.
- No secrets were added, printed, or logged. The deploy-hook URL remains environment-only.
