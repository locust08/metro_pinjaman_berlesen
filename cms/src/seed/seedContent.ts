import { getPayload } from 'payload'

import { defaultPayloadContent } from '../../../src/payload/content'
import config from '../payload.config'

type RecordValue = Record<string, unknown>

const globalSeeds = [
  ['site-settings', defaultPayloadContent.siteSettings],
  ['home-page', defaultPayloadContent.homePage],
  ['about-us-page', defaultPayloadContent.aboutUsPage],
  ['loan-page', defaultPayloadContent.loanPage],
  ['how-to-apply-page', defaultPayloadContent.howToApplyPage],
  ['contact-us-page', defaultPayloadContent.contactUsPage],
] as const

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCanonicalImage(value: unknown): value is { src: string; alt: string } {
  return isRecord(value) && typeof value.src === 'string' && typeof value.alt === 'string'
}

function toPayloadValue(value: unknown): unknown {
  if (isCanonicalImage(value)) return undefined

  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'string' ? { text: item } : toPayloadValue(item)))
  }

  if (!isRecord(value)) return value

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, child]) => [key, toPayloadValue(child)] as const)
      .filter(([, child]) => child !== undefined),
  )
}

function missingValues(existing: unknown, defaults: unknown): unknown {
  if (existing === null || existing === undefined) return defaults
  if (!isRecord(existing) || !isRecord(defaults)) return undefined

  const missing = Object.entries(defaults)
    .map(([key, defaultValue]) => [key, missingValues(existing[key], defaultValue)] as const)
    .filter(([, value]) => value !== undefined)

  return missing.length > 0 ? Object.fromEntries(missing) : undefined
}

async function seedContent() {
  const payload = await getPayload({ config })

  for (const [slug, canonicalContent] of globalSeeds) {
    const existing = await payload.findGlobal({ slug, depth: 0, draft: false })
    const defaults = toPayloadValue(canonicalContent)
    const data = missingValues(existing, defaults)

    if (data !== undefined) {
      await payload.updateGlobal({ slug, data: data as RecordValue })
    }
  }
}

seedContent().catch((error) => {
  console.error('Unable to seed default CMS content.', error)
  process.exitCode = 1
})
