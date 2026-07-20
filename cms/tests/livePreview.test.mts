import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import {
  buildLivePreviewUrl,
  livePreviewMappings,
  mergePreviewGlobal,
  normalizePreviewGlobal,
} from '../src/preview/livePreview'
import { defaultPayloadContent } from '../../src/payload/content'

describe('Payload Live Preview configuration helpers', () => {
  const rootDir = path.resolve(process.cwd(), '..')

  it('maps every editable Global to the intended Metro preview page', () => {
    expect(Object.fromEntries(Object.entries(livePreviewMappings).map(([slug, mapping]) => [slug, mapping.page]))).toMatchObject({
      'about-us-page': 'about_us',
      'contact-us-page': 'contact',
      'home-page': 'home',
      'how-to-apply-page': 'how_to_apply',
      'loan-page': 'loan',
      'site-settings': 'home',
    })
  })

  it('builds same-origin authenticated preview URLs', () => {
    expect(buildLivePreviewUrl('home-page', 'https://metropinjamanberlesen-payload-cms.easondev.workers.dev')).toBe(
      'https://metropinjamanberlesen-payload-cms.easondev.workers.dev/preview/home',
    )
    expect(buildLivePreviewUrl('site-settings', 'https://cms.example.test/')).toBe('https://cms.example.test/preview/home')
    expect(buildLivePreviewUrl('unknown-global', 'https://cms.example.test')).toBeUndefined()
  })

  it('normalizes media relationships and array text rows for live form state', () => {
    const normalized = normalizePreviewGlobal({
      eligibility: {
        items: [{ text: 'Open to Malaysians' }],
      },
      requiredDocuments: {
        image: { alt: 'Documents', url: '/api/media/file/documents.webp' },
      },
    }, 'howToApplyPage', 'https://cms.example.test')

    expect(normalized).toMatchObject({
      eligibility: { items: ['Open to Malaysians'] },
      requiredDocuments: {
        image: {
          alt: 'Documents',
          src: 'https://cms.example.test/api/media/file/documents.webp',
        },
      },
    })
  })

  it('merges live Global form state without exposing drafts to the public content defaults', () => {
    const content = mergePreviewGlobal(defaultPayloadContent, 'homePage', {
      hero: {
        mainHeading: 'Typing in Payload Admin',
      },
    })

    expect((content.homePage as any).hero).toMatchObject({
      mainHeading: 'Typing in Payload Admin',
    })
    expect((defaultPayloadContent.homePage as any).hero).toMatchObject({
      mainHeading: 'Pay Off Your Debts',
    })
  })

  it('loads the same Metro font and CSS assets as the published frontend', () => {
    const previewLayout = fs.readFileSync(path.join(process.cwd(), 'src/app/(frontend)/layout.tsx'), 'utf8')
    const publicDocument = fs.readFileSync(path.join(rootDir, 'src/pages/_document.tsx'), 'utf8')

    expect(previewLayout).toContain('fonts.googleapis.com/css?family=Inter:400,500,600,700,800,900|Plus+Jakarta+Sans')
    expect(previewLayout).toContain('fonts.googleapis.com/css2?family=Figtree')
    expect(previewLayout).toContain('metropinjamanberlesen.pages.dev/css/tailwind/tailwind.min.css')
    expect(previewLayout).toContain('metropinjamanberlesen.pages.dev/css/main.css')
    expect(previewLayout).toContain('className="antialiased bg-body text-body font-body"')
    expect(publicDocument).toContain('/css/tailwind/tailwind.min.css')
    expect(publicDocument).toContain('/css/main.css')
  })

  it('does not load the CMS starter stylesheet or default typography in Live Preview', () => {
    const previewLayout = fs.readFileSync(path.join(process.cwd(), 'src/app/(frontend)/layout.tsx'), 'utf8')

    expect(previewLayout).not.toContain("import './styles.css'")
    expect(previewLayout).not.toContain('font-family: system-ui')
    expect(previewLayout).not.toContain('<main>{children}</main>')
  })

  it('keeps Ready To Get Started CTA markup shared with the public legacy renderer', () => {
    const homeTemplate = fs.readFileSync(path.join(rootDir, 'src/legacy-pages/index.html'), 'utf8')
    const previewPage = fs.readFileSync(path.join(process.cwd(), 'src/app/(frontend)/preview/[page]/page.tsx'), 'utf8')
    const previewClient = fs.readFileSync(path.join(process.cwd(), 'src/app/(frontend)/preview/[page]/MetroLivePreviewClient.tsx'), 'utf8')

    expect(homeTemplate).toContain('id="home-ready-to-get-started-heading"')
    expect(homeTemplate).toContain('class="metro-balanced-cta-heading font-heading text-5xl xs:text-7xl tracking-tight mb-6 text-teal-900"')
    expect(homeTemplate).toContain('id="home-ready-to-get-started-apply-label"')
    expect(previewPage).toContain('legacyContentBindings')
    expect(previewClient).not.toContain('Ready to get started?')
    expect(previewClient).not.toContain('home-ready-to-get-started-heading')
    expect(previewClient).not.toContain('className=')
  })
})
