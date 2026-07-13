import type { Endpoint } from 'payload'

type MediaValue = {
  alt?: string
  url?: string
}

const globalSlugs = [
  ['siteSettings', 'site-settings'],
  ['homePage', 'home-page'],
  ['aboutUsPage', 'about-us-page'],
  ['loanPage', 'loan-page'],
  ['howToApplyPage', 'how-to-apply-page'],
  ['contactUsPage', 'contact-us-page'],
] as const

function isMediaValue(value: unknown): value is MediaValue {
  return typeof value === 'object' && value !== null && ('url' in value || 'alt' in value)
}

function normalizeForFrontend(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeForFrontend)

  if (isMediaValue(value)) {
    return {
      src: value.url ?? '',
      alt: value.alt ?? '',
    }
  }

  if (typeof value !== 'object' || value === null) return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !['id', 'createdAt', 'updatedAt', '_status'].includes(key))
      .map(([key, child]) => [key, normalizeForFrontend(child)]),
  )
}

export const publishedContentEndpoint: Endpoint = {
  path: '/published-content',
  method: 'get',
  handler: async (req) => {
    const payload = req.payload as unknown as {
      findGlobal: (args: { depth: number; draft: boolean; slug: string }) => Promise<unknown>
    }
    const values = await Promise.all(
      globalSlugs.map(([, slug]) => payload.findGlobal({ slug, depth: 1, draft: false })),
    )

    const responseBody = Object.fromEntries(
      globalSlugs.map(([key], index) => [key, normalizeForFrontend(values[index])]),
    )

    return Response.json(responseBody, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  },
}
