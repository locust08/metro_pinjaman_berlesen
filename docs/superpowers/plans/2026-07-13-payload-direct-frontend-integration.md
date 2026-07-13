# Payload Direct Frontend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic Payload slot CMS with clear page/section Globals and connect published Payload content directly into the existing Metro Pinjaman Berlesen frontend without changing the rendered layout.

**Architecture:** Keep the root Next app as the public frontend and the `cms/` Payload app as the separate Cloudflare Worker CMS. The frontend currently renders legacy HTML through `src/lib/legacyPage.tsx`; integration will happen through a server-side content adapter that applies explicit field mappings to known HTML sections before static export, never through browser DOM walking. Payload will expose published JSON from six Globals: `Site Settings`, `Home Page`, `About Us Page`, `Loan Page`, `How To Apply Page`, and `Contact Us Page`.

**Tech Stack:** Next.js 15 static export, legacy HTML page imports, Payload CMS 3.82, Cloudflare Workers, Cloudflare Pages, Cloudflare D1, Cloudflare R2, TypeScript, Node test runner, Vitest for CMS where existing.

## Global Constraints

- The latest attachment is the source of truth.
- The current website design, page structure, routes, forms, calculator, GTM/GA4 tracking, Tailwind classes, responsive behavior, animations, spacing, and section order must remain visually unchanged.
- Payload controls headings, paragraphs, button labels, editable content images, contact details, FAQ content, loan information, and SEO content.
- Frontend code controls layout, section order, styling, routes, icons, forms, calculator logic, appointment behavior, and tracking.
- Do not use generic fields such as `Text Slot 01`, `home.text.0`, `homeText1`, `Content Slot`, or `DOM Index`.
- Do not walk the rendered DOM, replace text by order, search text nodes, mutate the page after load, or use `data-cms-*` attributes as the content replacement mechanism.
- Every editable field must map to one clear visible frontend element.
- Admin content edits must not modify GitHub source code.
- Draft content must not appear in normal public requests.
- Existing Payload content must not be reset during normal deployments.
- The admin subdomain remains blocked until `metropinjamanberlesen.com` exists in the Cloudflare account; Worker URL remains the usable CMS URL until DNS is fixed.

---

## File Structure

- Create `docs/payload-frontend-mapping.md`: required mapping document before frontend changes.
- Create `docs/payload-deployment.md`: Cloudflare/GitHub/database/media/deploy hook behavior.
- Create `src/payload/defaults.ts`: bundled default content matching the current frontend.
- Create `src/payload/types.ts`: public frontend content types.
- Create `src/payload/fetchPayloadContent.ts`: published-content fetcher with fallback behavior.
- Create `src/payload/renderLegacyContent.ts`: explicit server-side HTML content mapper.
- Modify `src/lib/legacyPageData.ts`: load page HTML and apply explicit Payload/default content before export.
- Modify `src/lib/legacyPage.tsx`: remove `/js/site-content.js` and keep legacy hydration behavior only.
- Modify `src/pages/*.tsx`: pass page IDs and content fetch options to `loadLegacyPage`.
- Remove or stop using `public/js/site-content.js`, `src/content/applySiteContent.js`, `src/content/defaultSiteContent.js`, `src/content/siteContentSchema.js`, and `scripts/extract-site-content.mjs` after replacement tests pass.
- Create `tests/payload-render.test.mjs`: proves explicit mapping changes intended fields and leaves unrelated HTML unchanged.
- Modify `cms/src/collections/Media.ts`: add `internalName`, keep required `alt`, keep Upload config.
- Replace `cms/src/globals/SiteContent.ts` with six Globals:
  - `cms/src/globals/SiteSettings.ts`
  - `cms/src/globals/HomePage.ts`
  - `cms/src/globals/AboutUsPage.ts`
  - `cms/src/globals/LoanPage.ts`
  - `cms/src/globals/HowToApplyPage.ts`
  - `cms/src/globals/ContactUsPage.ts`
- Create `cms/src/globals/fields/common.ts`: shared field helpers for SEO, buttons, cards, fixed arrays, images, and admin descriptions.
- Replace `cms/src/endpoints/siteContent.ts` with `cms/src/endpoints/publishedContent.ts`: returns all published Globals normalized for the frontend.
- Modify `cms/src/payload.config.ts`: register new Globals/endpoints, remove old `SiteContent`.
- Create `cms/src/seed/defaultContent.ts`: safe default content object matching `src/payload/defaults.ts`.
- Create `cms/src/seed/seedContent.ts`: idempotent manual seed runner.
- Add `cms/src/migrations/<timestamp>_section_globals.ts`: new schema migration after `payload migrate:create`.
- Create `cms/tests/schema.test.mts`: validates Global slugs, no slot fields, array row limits, Media alt required, draft enabled.

---

### Task 1: Architecture And Mapping Documents

**Files:**
- Create: `docs/payload-frontend-mapping.md`
- Create: `docs/payload-deployment.md`

**Interfaces:**
- Produces: human-readable field map used by schema and frontend tasks.
- Produces: deployment decision record for static frontend update behavior.

- [ ] **Step 1: Inspect current page sections from repository HTML**

Run:

```powershell
rg -n "<section|<nav|<footer|<h1|<h2|<h3|loan-estimator|x-data" src\legacy-pages
```

Expected: each legacy page reports the section order used for the mapping.

- [ ] **Step 2: Write `docs/payload-frontend-mapping.md`**

Create the mapping with these columns for every editable field:

```markdown
| Payload Global | Field path | Frontend file | Frontend section | Visible element | Shared | Fallback value |
| --- | --- | --- | --- | --- | --- | --- |
```

Start with these required entries:

```markdown
| Site Settings | header.aboutUsMenuLabel | src/legacy-pages/*.html | Header | About us nav label | Yes | About us |
| Site Settings | header.loanMenuLabel | src/legacy-pages/*.html | Header | Loan nav label | Yes | Loan |
| Site Settings | header.howToApplyMenuLabel | src/legacy-pages/*.html | Header | How to apply nav label | Yes | How to apply |
| Site Settings | header.contactUsMenuLabel | src/legacy-pages/*.html | Header | Contact us nav label | Yes | Contact us |
| Site Settings | header.applyNowButtonLabel | src/legacy-pages/*.html | Header | Apply now button label | Yes | Apply now |
| Home Page | hero.mainHeading | src/legacy-pages/index.html | Hero Section | Main h1 | No | Simple Loans, |
| Home Page | howItWorks.steps[0].title | src/legacy-pages/index.html | How It Works Section | Step 1 title | No | Select Loan |
| Home Page | statistics.items[0].value | src/legacy-pages/index.html | Statistics Strip | Statistic 1 value | No | current HTML value |
| Contact Us Page | faq.items[0].question | src/legacy-pages/contact.html | FAQ Section | First FAQ question | No | current HTML question |
```

Fill the rest from the current HTML, including all fields in the latest brief.

- [ ] **Step 3: Write `docs/payload-deployment.md`**

Document the confirmed architecture:

```markdown
# Payload And Frontend Deployment

## Current Architecture

- Frontend: root Next.js 15 static export, `next.config.js` has `output: 'export'`.
- Frontend hosting: Cloudflare Pages project `metropinjamanberlesen`, output directory `out`, configured in `wrangler.toml`.
- Payload CMS: separate `cms/` Next/Payload app deployed as Cloudflare Worker `metropinjamanberlesen-payload-cms`.
- Database: Cloudflare D1 binding `D1`, database `metropinjamanberlesen_payload`.
- Media storage: Cloudflare R2 binding `R2`, bucket `metropinjamanberlesen-payload-media`.
- Admin domain: Worker URL is active; `admin.metropinjamanberlesen.com` needs the domain zone added to the Cloudflare account before route attachment.

## Update Behavior

The public frontend is fully static. Published Payload edits cannot appear on `metropinjamanberlesen.pages.dev` until either:

1. A Cloudflare Pages deploy hook rebuilds the static site after publish, or
2. The frontend architecture changes to runtime rendering.

This implementation must prepare a Payload after-change hook or documented deploy hook call, but secrets must not be committed.
```

- [ ] **Step 4: Commit docs**

Run:

```powershell
git add docs/payload-frontend-mapping.md docs/payload-deployment.md
git commit -m "Document Payload frontend mapping"
```

Expected: commit succeeds.

---

### Task 2: Shared Content Defaults And Frontend Renderer Tests

**Files:**
- Create: `src/payload/types.ts`
- Create: `src/payload/defaults.ts`
- Create: `src/payload/renderLegacyContent.ts`
- Create: `tests/payload-render.test.mjs`

**Interfaces:**
- Produces: `defaultPayloadContent: PublicPayloadContent`
- Produces: `renderLegacyContent(html: string, pageId: SitePageId, content: PublicPayloadContent): string`
- Consumes: mapping document from Task 1.

- [ ] **Step 1: Define frontend types**

Create `src/payload/types.ts`:

```ts
export type SitePageId = 'home' | 'aboutUs' | 'loan' | 'howToApply' | 'contactUs';

export type ImageValue = {
  src: string;
  alt: string;
};

export type LabeledText = {
  title: string;
  description: string;
};

export type PublicPayloadContent = {
  siteSettings: {
    header: {
      websiteLogo: ImageValue;
      aboutUsMenuLabel: string;
      loanMenuLabel: string;
      howToApplyMenuLabel: string;
      contactUsMenuLabel: string;
      applyNowButtonLabel: string;
    };
    footer: {
      footerLogo: ImageValue;
      pagesColumnHeading: string;
      homeLinkLabel: string;
      aboutUsLinkLabel: string;
      loanLinkLabel: string;
      helpColumnHeading: string;
      howToApplyLinkLabel: string;
      contactUsLinkLabel: string;
      copyrightText: string;
    };
    contactDetails: {
      supportEmail: string;
      displayPhoneNumber: string;
      telephoneLinkNumber: string;
      whatsappNumber: string;
      defaultWhatsappMessage: string;
      businessHours: string;
      officeName: string;
      officeAddress: string;
      wazeUrl: string;
      googleMapsUrl: string;
    };
    formMessages: {
      successfulSubmissionMessage: string;
      failedSubmissionMessage: string;
      sendingMessage: string;
      validationSummaryMessage: string;
    };
  };
  homePage: Record<string, unknown>;
  aboutUsPage: Record<string, unknown>;
  loanPage: Record<string, unknown>;
  howToApplyPage: Record<string, unknown>;
  contactUsPage: Record<string, unknown>;
};
```

- [ ] **Step 2: Add defaults from current frontend**

Create `src/payload/defaults.ts` exporting `defaultPayloadContent`. Values must be copied from `src/legacy-pages/*.html`; do not rewrite template content in this task.

Use this shape for the Home page and repeat equivalent structured objects for other pages:

```ts
import type { PublicPayloadContent } from './types';

export const defaultPayloadContent: PublicPayloadContent = {
  siteSettings: {
    header: {
      websiteLogo: { src: 'flow-assets/logos/flow-logo.svg', alt: '' },
      aboutUsMenuLabel: 'About us',
      loanMenuLabel: 'Loan',
      howToApplyMenuLabel: 'How to apply',
      contactUsMenuLabel: 'Contact us',
      applyNowButtonLabel: 'Apply now',
    },
    footer: {
      footerLogo: { src: 'flow-assets/logos/flow-logo.svg', alt: '' },
      pagesColumnHeading: 'Pages',
      homeLinkLabel: 'Home',
      aboutUsLinkLabel: 'About us',
      loanLinkLabel: 'Loan',
      helpColumnHeading: 'Help',
      howToApplyLinkLabel: 'How to apply',
      contactUsLinkLabel: 'Contact us',
      copyrightText: '© 2026 Flow. All rights reserved.',
    },
    contactDetails: {
      supportEmail: 'metropinjamanberlesan@gmail.com',
      displayPhoneNumber: '+60 11-7007 3191',
      telephoneLinkNumber: '+601170073191',
      whatsappNumber: '601170073191',
      defaultWhatsappMessage:
        'Hi Metro Pinjaman Berlesen, I would like to enquire about a loan appointment.',
      businessHours: '24/7',
      officeName: 'Metro Pinjaman Berlesen',
      officeAddress:
        'Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur',
      wazeUrl:
        'https://www.waze.com/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/jalan-metro-1?to=place.ElpKYWxhbiBNZXRybyAxLCBNZXRybyBQcmltYSwgNTIxMDAgS3VhbGEgTHVtcHVyLCBXaWxheWFoIFBlcnNla3V0dWFuIEt1YWxhIEx1bXB1ciwgTWFsYXlzaWEiLiosChQKEglr0ecfQEbMMRELOdpZeIzxyxIUChIJ35pfkUBGzDERuup-yz1DT3Y',
      googleMapsUrl:
        'https://www.google.com/maps/place/Jalan+Metro+1,+Metro+Prima,+52100+Kuala+Lumpur,+Wilayah+Persekutuan+Kuala+Lumpur/data=!4m2!3m1!1s0x31cc46401fe7d16b:0xcbf18c7859da390b?sa=X&ved=1t:242&ictx=111',
    },
    formMessages: {
      successfulSubmissionMessage: 'Booking submitted.',
      failedSubmissionMessage:
        'Sorry, we could not submit your appointment right now. Please try again or contact us on WhatsApp.',
      sendingMessage: 'Sending...',
      validationSummaryMessage: 'Please complete all required fields.',
    },
  },
  homePage: {},
  aboutUsPage: {},
  loanPage: {},
  howToApplyPage: {},
  contactUsPage: {},
};
```

- [ ] **Step 3: Write failing renderer tests**

Create `tests/payload-render.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLegacyContent } from '../src/payload/renderLegacyContent.ts';
import { defaultPayloadContent } from '../src/payload/defaults.ts';

test('renderLegacyContent updates only explicit home hero fields', () => {
  const html = '<h1 class="keep">Simple Loans,</h1><p class="text-lg text-gray-700 mb-10">Old description</p>';
  const content = structuredClone(defaultPayloadContent);
  content.homePage = {
    hero: {
      mainHeading: 'Fast loans, clear terms',
      description: 'Updated description',
    },
  };

  const output = renderLegacyContent(html, 'home', content);

  assert.match(output, /<h1 class="keep">Fast loans, clear terms<\/h1>/);
  assert.match(output, /<p class="text-lg text-gray-700 mb-10">Updated description<\/p>/);
  assert.doesNotMatch(output, /data-cms/);
});

test('renderLegacyContent leaves unmatched HTML unchanged', () => {
  const html = '<div><span>Keep me</span></div>';
  const output = renderLegacyContent(html, 'home', defaultPayloadContent);
  assert.equal(output, html);
});
```

Run:

```powershell
npm test
```

Expected: fails because `src/payload/renderLegacyContent.ts` does not exist.

- [ ] **Step 4: Implement explicit renderer**

Create `src/payload/renderLegacyContent.ts` with pure functions:

```ts
import type { PublicPayloadContent, SitePageId } from './types';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceFirst(source: string, pattern: RegExp, replacement: string): string {
  return source.replace(pattern, replacement);
}

function replaceTextBetween(source: string, pattern: RegExp, value: unknown): string {
  return replaceFirst(source, pattern, (_match, before, _old, after) => {
    return `${before}${escapeHtml(value)}${after}`;
  });
}

function renderHome(html: string, content: PublicPayloadContent): string {
  const hero = (content.homePage as { hero?: Record<string, unknown> }).hero || {};
  let output = html;

  if (hero.mainHeading != null) {
    output = replaceTextBetween(output, /(<h1 class="font-heading[^"]*">)([\s\S]*?)(<\/h1>)/, hero.mainHeading);
  }

  if (hero.description != null) {
    output = replaceTextBetween(output, /(<p class="text-lg text-gray-700 mb-10">)([\s\S]*?)(<\/p>)/, hero.description);
  }

  return output;
}

export function renderLegacyContent(
  html: string,
  pageId: SitePageId,
  content: PublicPayloadContent,
): string {
  if (pageId === 'home') return renderHome(html, content);
  return html;
}
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test
```

Expected: tests pass.

---

### Task 3: Payload Section Globals Schema

**Files:**
- Modify: `cms/src/collections/Media.ts`
- Delete/replace: `cms/src/globals/SiteContent.ts`
- Create: `cms/src/globals/fields/common.ts`
- Create: `cms/src/globals/SiteSettings.ts`
- Create: `cms/src/globals/HomePage.ts`
- Create: `cms/src/globals/AboutUsPage.ts`
- Create: `cms/src/globals/LoanPage.ts`
- Create: `cms/src/globals/HowToApplyPage.ts`
- Create: `cms/src/globals/ContactUsPage.ts`
- Modify: `cms/src/payload.config.ts`
- Test: `cms/tests/schema.test.mts`

**Interfaces:**
- Produces Global slugs: `site-settings`, `home-page`, `about-us-page`, `loan-page`, `how-to-apply-page`, `contact-us-page`.
- Produces Media fields: `alt`, `internalName`.

- [ ] **Step 1: Add schema tests**

Create `cms/tests/schema.test.mts`:

```ts
import { describe, expect, it } from 'vitest';
import { Media } from '../src/collections/Media';
import { SiteSettings } from '../src/globals/SiteSettings';
import { HomePage } from '../src/globals/HomePage';
import { AboutUsPage } from '../src/globals/AboutUsPage';
import { LoanPage } from '../src/globals/LoanPage';
import { HowToApplyPage } from '../src/globals/HowToApplyPage';
import { ContactUsPage } from '../src/globals/ContactUsPage';

const globals = [SiteSettings, HomePage, AboutUsPage, LoanPage, HowToApplyPage, ContactUsPage];

function stringify(value: unknown) {
  return JSON.stringify(value);
}

describe('Payload section schema', () => {
  it('defines the six required globals', () => {
    expect(globals.map((global) => global.slug)).toEqual([
      'site-settings',
      'home-page',
      'about-us-page',
      'loan-page',
      'how-to-apply-page',
      'contact-us-page',
    ]);
  });

  it('does not expose generic slot fields', () => {
    const schema = stringify(globals);
    expect(schema).not.toContain('Text Slot');
    expect(schema).not.toContain('textSlots');
    expect(schema).not.toContain('imageSlots');
    expect(schema).not.toContain('DOM Index');
  });

  it('requires media alt text', () => {
    const alt = Media.fields.find((field) => 'name' in field && field.name === 'alt');
    expect(alt).toMatchObject({ required: true });
  });

  it('uses fixed rows for home steps and statistics', () => {
    const schema = stringify(HomePage);
    expect(schema).toContain('"minRows":4');
    expect(schema).toContain('"maxRows":4');
    expect(schema).toContain('"minRows":3');
    expect(schema).toContain('"maxRows":3');
  });
});
```

Run:

```powershell
pnpm exec vitest run cms/tests/schema.test.mts
```

Expected: fails until globals exist.

- [ ] **Step 2: Create shared field helpers**

Create `cms/src/globals/fields/common.ts`:

```ts
import type { Field } from 'payload';

export const requiredText = (name: string, label: string, adminDescription?: string): Field => ({
  name,
  label,
  type: 'text',
  required: true,
  admin: adminDescription ? { description: adminDescription } : undefined,
});

export const optionalText = (name: string, label: string, adminDescription?: string): Field => ({
  name,
  label,
  type: 'text',
  admin: adminDescription ? { description: adminDescription } : undefined,
});

export const requiredTextarea = (name: string, label: string, adminDescription?: string): Field => ({
  name,
  label,
  type: 'textarea',
  required: true,
  admin: adminDescription ? { description: adminDescription } : undefined,
});

export const imageUpload = (name: string, label: string, required = false, adminDescription?: string): Field => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  required,
  admin: adminDescription ? { description: adminDescription } : undefined,
});

export const seoFields = (): Field => ({
  name: 'seo',
  label: 'SEO',
  type: 'group',
  fields: [
    optionalText('metaTitle', 'Meta title', 'Recommended length is approximately 50-60 characters.'),
    {
      name: 'metaDescription',
      label: 'Meta description',
      type: 'textarea',
      admin: { description: 'Recommended length is approximately 140-160 characters.' },
    },
    imageUpload('socialSharingImage', 'Social sharing image'),
  ],
});

export const titleDescriptionFields = (titleLabel = 'Title', descriptionLabel = 'Description'): Field[] => [
  requiredText('title', titleLabel),
  requiredTextarea('description', descriptionLabel),
];
```

- [ ] **Step 3: Update Media collection**

Modify `cms/src/collections/Media.ts` fields:

```ts
fields: [
  {
    name: 'alt',
    label: 'Alt text',
    type: 'text',
    required: true,
  },
  {
    name: 'internalName',
    label: 'Internal image name',
    type: 'text',
    admin: {
      description: 'Optional editor-only name to make this image easier to find.',
    },
  },
],
```

- [ ] **Step 4: Create section Globals**

Create the six Global files. Each must set:

```ts
versions: {
  drafts: true,
  maxPerDoc: 20,
},
admin: {
  group: 'Website',
},
access: {
  read: () => true,
},
```

For `HomePage`, include exact tabs:

```ts
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: { group: 'Website' },
  access: { read: () => true },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Hero Section', fields: [/* hero fields */] },
        { label: 'How It Works Section', fields: [/* steps minRows/maxRows 4 */] },
        { label: 'Statistics Strip', fields: [/* statistics minRows/maxRows 4 */] },
        { label: 'Loan Options Section', fields: [/* two explicit groups */] },
        { label: 'Why Choose Us Section', fields: [/* features minRows/maxRows 3 */] },
        { label: 'Ready To Get Started Section', fields: [/* CTA fields */] },
        { label: 'SEO', fields: [seoFields()] },
      ],
    },
  ],
};
```

Repeat the exact tabs from the latest brief for all other page Globals.

- [ ] **Step 5: Register Globals**

Modify `cms/src/payload.config.ts`:

```ts
import { SiteSettings } from './globals/SiteSettings';
import { HomePage } from './globals/HomePage';
import { AboutUsPage } from './globals/AboutUsPage';
import { LoanPage } from './globals/LoanPage';
import { HowToApplyPage } from './globals/HowToApplyPage';
import { ContactUsPage } from './globals/ContactUsPage';
```

Replace:

```ts
globals: [SiteContent],
```

with:

```ts
globals: [SiteSettings, HomePage, AboutUsPage, LoanPage, HowToApplyPage, ContactUsPage],
```

- [ ] **Step 6: Run CMS schema tests**

Run:

```powershell
pnpm exec vitest run cms/tests/schema.test.mts
pnpm run generate:types
pnpm run build
```

Expected: tests pass and Payload builds.

---

### Task 4: Published Content API And Safe Seed

**Files:**
- Create: `cms/src/endpoints/publishedContent.ts`
- Create: `cms/src/seed/defaultContent.ts`
- Create: `cms/src/seed/seedContent.ts`
- Modify: `cms/package.json`
- Modify: `cms/src/payload.config.ts`

**Interfaces:**
- Produces endpoint: `GET /api/published-content`
- Produces script: `pnpm run seed:content`

- [ ] **Step 1: Create default content**

Create `cms/src/seed/defaultContent.ts` mirroring `src/payload/defaults.ts`, including all six Globals. Keep current visible website content unchanged.

- [ ] **Step 2: Create published endpoint**

Create `cms/src/endpoints/publishedContent.ts`:

```ts
import type { Endpoint } from 'payload';

const globalSlugs = [
  ['siteSettings', 'site-settings'],
  ['homePage', 'home-page'],
  ['aboutUsPage', 'about-us-page'],
  ['loanPage', 'loan-page'],
  ['howToApplyPage', 'how-to-apply-page'],
  ['contactUsPage', 'contact-us-page'],
] as const;

export const publishedContentEndpoint: Endpoint = {
  path: '/published-content',
  method: 'get',
  handler: async (req) => {
    const entries = await Promise.all(
      globalSlugs.map(async ([key, slug]) => [
        key,
        await req.payload.findGlobal({
          slug,
          depth: 2,
          draft: false,
        }),
      ]),
    );

    return Response.json(Object.fromEntries(entries), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  },
};
```

- [ ] **Step 3: Register endpoint**

Modify `cms/src/payload.config.ts`:

```ts
import { publishedContentEndpoint } from './endpoints/publishedContent';
```

Set:

```ts
endpoints: [publishedContentEndpoint],
```

- [ ] **Step 4: Add idempotent seed command**

Create `cms/src/seed/seedContent.ts` that logs into Payload local API and writes defaults only for missing fields. Use `findGlobal` first, merge nullish values only, and call `updateGlobal`.

Add to `cms/package.json`:

```json
"seed:content": "cross-env NODE_OPTIONS=--no-deprecation tsx src/seed/seedContent.ts"
```

- [ ] **Step 5: Verify API and seed**

Run:

```powershell
pnpm run seed:content
pnpm run build
```

Expected: seed completes without deleting existing content; build passes.

---

### Task 5: Frontend Fetch And Static Update Strategy

**Files:**
- Create: `src/payload/fetchPayloadContent.ts`
- Modify: `src/lib/legacyPageData.ts`
- Modify: `src/pages/*.tsx`
- Modify: `src/lib/legacyPage.tsx`
- Modify: `docs/payload-deployment.md`

**Interfaces:**
- Consumes: `GET /api/published-content`
- Produces: `loadLegacyPage(fileName: string, pageId: SitePageId): Promise<LegacyPageContent>`

- [ ] **Step 1: Add fetch helper**

Create `src/payload/fetchPayloadContent.ts`:

```ts
import { defaultPayloadContent } from './defaults';
import type { PublicPayloadContent } from './types';

const endpoint =
  process.env.PAYLOAD_PUBLIC_CONTENT_URL ||
  'https://metropinjamanberlesen-payload-cms.easondev.workers.dev/api/published-content';

export async function fetchPayloadContent(): Promise<PublicPayloadContent> {
  try {
    const response = await fetch(endpoint, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) return defaultPayloadContent;

    const remote = (await response.json()) as Partial<PublicPayloadContent>;

    return {
      ...defaultPayloadContent,
      ...remote,
      siteSettings: {
        ...defaultPayloadContent.siteSettings,
        ...(remote.siteSettings || {}),
      },
    };
  } catch {
    return defaultPayloadContent;
  }
}
```

- [ ] **Step 2: Make legacy loader async**

Modify `src/lib/legacyPageData.ts`:

```ts
import { fetchPayloadContent } from '../payload/fetchPayloadContent';
import { renderLegacyContent } from '../payload/renderLegacyContent';
import type { SitePageId } from '../payload/types';
```

Change signature:

```ts
export async function loadLegacyPage(fileName: string, pageId: SitePageId): Promise<LegacyPageContent> {
```

Before return:

```ts
const content = await fetchPayloadContent();
const renderedBodyHtml = renderLegacyContent(bodyHtml, pageId, content);
```

Return `bodyHtml: renderedBodyHtml`.

- [ ] **Step 3: Update pages**

Change each `getStaticProps` to async:

```ts
export async function getStaticProps() {
  return { props: await loadLegacyPage('index.html', 'home') };
}
```

Use page IDs: `home`, `aboutUs`, `loan`, `howToApply`, `contactUs`.

- [ ] **Step 4: Remove browser CMS script injection**

Modify `src/lib/legacyPage.tsx` to remove:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `window.__METRO_PAGE_ID__=${JSON.stringify(pageId)};`,
  }}
/>
<script src="/js/site-content.js" defer />
```

Also remove `pageId` from `LegacyPageProps` if unused after page updates.

- [ ] **Step 5: Document update behavior**

Update `docs/payload-deployment.md`:

```markdown
Because the frontend is `output: 'export'`, Payload edits are included when Cloudflare Pages rebuilds the static export. To make admin publish update production automatically, configure a Cloudflare Pages Deploy Hook secret in Payload and call it after publishing. Until that hook exists, run the frontend deployment after CMS content changes.
```

- [ ] **Step 6: Run frontend tests/build**

Run:

```powershell
npm test
npm run type-check
npm run build
```

Expected: tests/type-check/build pass.

---

### Task 6: Full Verification And Cleanup

**Files:**
- Delete or stop shipping: `public/js/site-content.js`
- Delete or stop using: `src/content/*`, `scripts/extract-site-content.mjs`
- Modify tests accordingly.

**Interfaces:**
- Produces clean branch with no generic slot UI or client-side replacement.

- [ ] **Step 1: Remove obsolete slot runtime**

Delete:

```text
public/js/site-content.js
src/content/applySiteContent.js
src/content/defaultSiteContent.js
src/content/siteContentSchema.js
scripts/extract-site-content.mjs
tests/site-content.test.mjs
```

Only do this after `tests/payload-render.test.mjs` covers the new path.

- [ ] **Step 2: Verify no generic slots remain**

Run:

```powershell
rg -n "Text Slot|textSlots|imageSlots|home\\.text|site-content|data-cms|DOM Index" src public cms tests scripts
```

Expected: no matches except old migration files or documentation explicitly saying the old approach is rejected.

- [ ] **Step 3: Build CMS and frontend**

Run:

```powershell
npm test
npm run type-check
npm run build
pnpm --dir cms run build
```

Expected: all pass. If `npm run lint` still fails because Next 15 removed `next lint`, record that and do not claim lint passed.

- [ ] **Step 4: Visual parity check**

Start local frontend:

```powershell
npm run build
npx serve out -l 4173
```

Compare desktop and mobile screenshots for:

```text
/
/about_us.html
/loan.html
/how_to_apply.html
/contact.html
```

Expected: no intentional layout differences from the restored production site.

- [ ] **Step 5: Commit final work**

Run:

```powershell
git add .
git commit -m "Implement section-based Payload frontend integration"
git push
```

Expected: branch pushes to `origin/codex/payload-fixed-layout-cms`.

---

## Self-Review Checklist

- Latest attachment requires full integration; Tasks 1-6 cover mapping, schema, seed, frontend fetch, deployment docs, and verification.
- No frontend layout changes are planned.
- No generic slot fields are allowed.
- No browser DOM mutation path remains.
- Static frontend update limitation is documented and handled through deploy hook documentation rather than guessing runtime behavior.
- Draft privacy is handled by the published-content endpoint using `draft: false`.
- The plan does not require exposing secrets.
