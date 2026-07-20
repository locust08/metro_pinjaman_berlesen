import { describe, expect, it } from 'vitest'

import {
  buildLivePreviewUrl,
  livePreviewMappings,
  mergePreviewGlobal,
  normalizePreviewGlobal,
} from '../src/preview/livePreview'
import { defaultPayloadContent } from '../../src/payload/content'

describe('Payload Live Preview configuration helpers', () => {
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
})
