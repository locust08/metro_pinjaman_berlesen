import { describe, expect, it, vi } from 'vitest'

import { defaultPayloadContent } from '../../src/payload/content'
import { seedPayloadContent, type SeedPayload } from '../src/seed/seedContent'

type RecordValue = Record<string, unknown>

function merge(target: RecordValue, source: RecordValue): RecordValue {
  return Object.fromEntries(
    new Set([...Object.keys(target), ...Object.keys(source)]).values().map((key) => {
      const targetValue = target[key]
      const sourceValue = source[key]
      return [key, isRecord(targetValue) && isRecord(sourceValue) ? merge(targetValue, sourceValue) : sourceValue]
    }),
  )
}

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function createPayload(initial: RecordValue): SeedPayload & { updateGlobal: ReturnType<typeof vi.fn> } {
  const content = structuredClone(initial)
  const updateGlobal = vi.fn(async ({ slug, data }: { slug: string; data: RecordValue }) => {
    content[slug] = merge((content[slug] as RecordValue) ?? {}, data)
  })

  return {
    findGlobal: vi.fn(async ({ slug }: { slug: string }) => content[slug]),
    updateGlobal,
  }
}

const homeSeed = [['home-page', defaultPayloadContent.homePage]] as const

describe('canonical content seed', () => {
  it('fills missing and nullish defaults without including existing nested admin values', async () => {
    const payload = createPayload({
      'home-page': {
        hero: {
          mainHeading: 'Admin heading',
          description: null,
        },
      },
    })

    await seedPayloadContent(payload, homeSeed)

    const update = payload.updateGlobal.mock.calls[0][0]
    expect(update.slug).toBe('home-page')
    expect(update.data.hero).toMatchObject({ description: defaultPayloadContent.homePage.hero.description })
    expect(update.data.hero).not.toHaveProperty('mainHeading')
  })

  it('does not update globals after the defaults have already been seeded', async () => {
    const payload = createPayload({ 'home-page': null })

    await seedPayloadContent(payload, homeSeed)
    payload.updateGlobal.mockClear()

    await seedPayloadContent(payload, homeSeed)

    expect(payload.updateGlobal).not.toHaveBeenCalled()
  })
})
