import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'node-html-parser'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { normalizeForFrontend } from '../src/endpoints/publishedContent'
import { defaultPayloadContent } from '../../src/payload/content'
import { fetchPayloadContent } from '../../src/payload/fetchPayloadContent'
import { renderLegacyContent } from '../../src/payload/renderLegacyContent'

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('published content media normalization', () => {
  it('makes uploaded media URLs absolute to the configured CMS origin', () => {
    expect(normalizeForFrontend(
      { id: 4, url: '/api/media/file/example.png', alt: 'Example' },
      'https://cms.example.test',
    )).toEqual({
      src: 'https://cms.example.test/api/media/file/example.png',
      alt: 'Example',
    })
  })

  it('preserves already absolute media URLs', () => {
    expect(normalizeForFrontend(
      { url: 'https://images.example.test/example.png', alt: 'Example' },
      'https://cms.example.test',
    )).toEqual({
      src: 'https://images.example.test/example.png',
      alt: 'Example',
    })
  })

  it('renders seeded single-text array rows as text through the published content flow', async () => {
    const payloadResponse = structuredClone(defaultPayloadContent) as unknown as {
      aboutUsPage: { whoWeAre: { paragraphs: Array<{ text: string }> } }
      loanPage: {
        personalLoan: { requirements: { items: Array<{ text: string }> } }
        businessLoan: { requirements: { items: Array<{ text: string }> } }
      }
      howToApplyPage: { eligibility: { items: Array<{ text: string }> } }
    }
    const expectedRows = {
      paragraphs: ['Payload about paragraph one', 'Payload about paragraph two'],
      personalRequirements: ['Payload personal requirement one', 'Payload personal requirement two', 'Payload personal requirement three'],
      businessRequirements: ['Payload business requirement one', 'Payload business requirement two', 'Payload business requirement three', 'Payload business requirement four', 'Payload business requirement five'],
      eligibility: ['Payload eligibility one', 'Payload eligibility two', 'Payload eligibility three', 'Payload eligibility four'],
    }

    payloadResponse.aboutUsPage.whoWeAre.paragraphs = expectedRows.paragraphs.map((text) => ({ text }))
    payloadResponse.loanPage.personalLoan.requirements.items = expectedRows.personalRequirements.map((text) => ({ text }))
    payloadResponse.loanPage.businessLoan.requirements.items = expectedRows.businessRequirements.map((text) => ({ text }))
    payloadResponse.howToApplyPage.eligibility.items = expectedRows.eligibility.map((text) => ({ text }))

    vi.stubEnv('PAYLOAD_PUBLIC_CONTENT_URL', 'https://cms.example.test/api/published-content')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(
      normalizeForFrontend(payloadResponse, 'https://cms.example.test'),
    ))))

    const content = await fetchPayloadContent()
    const templates = {
      aboutUs: fs.readFileSync(path.join(workspaceRoot, 'src/legacy-pages/about_us.html'), 'utf8'),
      loan: fs.readFileSync(path.join(workspaceRoot, 'src/legacy-pages/loan.html'), 'utf8'),
      howToApply: fs.readFileSync(path.join(workspaceRoot, 'src/legacy-pages/how_to_apply.html'), 'utf8'),
    }
    const renderedAbout = renderLegacyContent(templates.aboutUs, 'aboutUs', content)
    const renderedLoan = renderLegacyContent(templates.loan, 'loan', content)
    const renderedHowToApply = renderLegacyContent(templates.howToApply, 'howToApply', content)

    expect([renderedAbout, renderedLoan, renderedHowToApply].join('')).not.toContain('[object Object]')
    expect(parse(renderedAbout).querySelector('#about-us-who-we-are-paragraph-1')?.text.trim()).toBe(expectedRows.paragraphs[0])
    expect(parse(renderedAbout).querySelector('#about-us-who-we-are-paragraph-2')?.text.trim()).toBe(expectedRows.paragraphs[1])
    expect(expectedRows.personalRequirements.map((_, index) => parse(renderedLoan).querySelector(`#loan-personal-requirement-${index + 1}`)?.text.trim())).toEqual(expectedRows.personalRequirements)
    expect(expectedRows.businessRequirements.map((_, index) => parse(renderedLoan).querySelector(`#loan-business-requirement-${index + 1}`)?.text.trim())).toEqual(expectedRows.businessRequirements)
    expect(expectedRows.eligibility.map((_, index) => parse(renderedHowToApply).querySelector(`#how-to-apply-eligibility-${index + 1}`)?.text.trim())).toEqual(expectedRows.eligibility)
  })
})
