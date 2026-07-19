# Second Final-Review Fix Report

Date: 2026-07-13

Status: DONE_WITH_CONCERNS

## Scope Completed

1. HTML-entity-obfuscated URL schemes
   - URL values are decoded before validation and assignment.
   - Leading and trailing C0 controls/whitespace are normalized; remaining controls and network-path forms are rejected.
   - `href` remains limited to HTTP, HTTPS, mailto, tel, and same-origin relative paths.
   - Image `src` remains limited to HTTP, HTTPS, and same-origin relative paths.
   - Numeric, named, encoded control-character, and raw whitespace/control regressions prove unsafe overrides preserve the legacy `href` and `src`.

2. Current six-Global D1 schema
   - Added generated forward migration `20260713_134849_payload_six_globals` without rewriting the previously applied migration.
   - The migration creates all six current Global tables, nested array tables, six draft/version roots, nested version tables, and the current Media `internal_name` column.
   - The forward migration intentionally leaves `site_content` and its legacy slot tables untouched so existing content is not dropped blindly.
   - The generated JSON snapshot represents the current schema, and a follow-up Payload `migrate:create --skip-empty` run found no remaining schema delta.

3. Static-build Payload fetch timeout
   - Added a 10-second `AbortController` timeout to the published-content request.
   - The timer is cleared in `finally`, and abort/network failures continue to return canonical defaults.
   - A pending-request regression advances mocked time, observes the request signal abort, and verifies fallback content.

## TDD Evidence

- Initial frontend focused run: the entity-obfuscated URL regression failed because `jav&#x61;script:` replaced the safe legacy URL; the fetch regressions failed because no abort signal existed.
- Initial migration focused run: 2 tests failed because `20260713_014914` was still the latest migration and represented only the retired slot schema.
- Focused URL sanitizer: exit 0; 3 passed, 0 failed.
- Focused fetch timeout: exit 0; 1 passed, 0 failed.
- Focused migration safety: exit 0; 2 passed, 0 failed.
- Payload empty schema-diff proof: exit 0; generated UP and DOWN comparisons completed and `--skip-empty` emitted no migration.

## Required Verification Results

- `npm test`: exit 0; 18 passed, 0 failed, 0 skipped.
- `npm run type-check`: exit 0; `tsc --noEmit` completed without diagnostics.
- `npm run build`: exit 0; production build compiled and exported all 12 static/SSG routes.
- `pnpm --dir cms exec vitest run`: exit 0; 5 files passed and 1 environment-gated file skipped; 20 tests passed and 1 skipped.
- `pnpm --dir cms run build`: exit 0; production build compiled, type-checked, and generated all 7 CMS routes.
- `git diff --check`: exit 0; no whitespace errors.
- `git diff --check 1839e70ba7c1d9c234fc0563bd2734133d7a76a3`: exit 0; no whole-range whitespace errors.

## Concerns And Incomplete Checks

- The CMS API integration test remains skipped without the live local CMS environment and credentials.
- The forward migration was generated and schema-diff verified locally but was not applied to remote D1; no remote database or user content was changed.
- Legacy slot tables are intentionally retained as archival data and are no longer part of Payload's active schema snapshot.
- Root Node tests emit the existing module-type warning; the root build emits the existing multiple-lockfile warning.
- CMS build emits existing unused-variable and logger-cast warnings plus expected unused-argument warnings in generated migrations; build exit remains 0.
- No secrets were added, printed, or committed.
