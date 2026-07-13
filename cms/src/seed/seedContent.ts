import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defaultPayloadContent } from '../../../src/payload/content'

type RecordValue = Record<string, unknown>

export type SeedPayload = {
  findGlobal: (args: { depth: number; draft: boolean; slug: string }) => Promise<unknown>
  updateGlobal: (args: { data: RecordValue; draft: boolean; slug: string }) => Promise<unknown>
}

export const globalSeeds = [
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

export async function seedPayloadContent(
  payload: SeedPayload,
  seeds: readonly (readonly [string, unknown])[] = globalSeeds,
) {
  for (const [slug, canonicalContent] of seeds) {
    const existing = await payload.findGlobal({ slug, depth: 0, draft: true })
    const defaults = toPayloadValue(canonicalContent)
    const data = missingValues(existing, defaults)

    if (data !== undefined) {
      await payload.updateGlobal({
        slug,
        data: data as RecordValue,
        draft: isRecord(existing) && existing._status === 'draft',
      })
    }
  }
}

async function seedContent() {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('../payload.config'),
  ])
  const payload = await getPayload({ config })
  await seedPayloadContent(payload as unknown as SeedPayload)
}

const executedFile = process.argv[1]

if (executedFile && path.resolve(executedFile) === fileURLToPath(import.meta.url)) seedContent().catch((error) => {
  console.error('Unable to seed default CMS content.', error)
  process.exitCode = 1
})
