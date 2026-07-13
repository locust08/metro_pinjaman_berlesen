import type { Endpoint } from 'payload'

type MediaValue = {
  alt?: string
  url?: string
}

function normalizeImageSlot(slot: Record<string, unknown>) {
  const image = slot.image as MediaValue | number | string | null | undefined

  if (image && typeof image === 'object') {
    return {
      key: slot.key,
      label: slot.label,
      image: {
        src: image.url || slot.fallbackSrc || '',
        alt: image.alt || slot.fallbackAlt || '',
      },
    }
  }

  return {
    key: slot.key,
    label: slot.label,
    image: {
      src: slot.fallbackSrc || '',
      alt: slot.fallbackAlt || '',
    },
  }
}

function normalizePage(page: Record<string, unknown> | null | undefined) {
  return {
    textSlots: Array.isArray(page?.textSlots) ? page.textSlots : [],
    imageSlots: Array.isArray(page?.imageSlots)
      ? page.imageSlots.map((slot) => normalizeImageSlot(slot as Record<string, unknown>))
      : [],
  }
}

export const siteContentEndpoint: Endpoint = {
  path: '/site-content',
  method: 'get',
  handler: async (req) => {
    const payload = req.payload as unknown as {
      findGlobal: (args: { depth: number; slug: string }) => Promise<unknown>
    }
    const content = (await payload.findGlobal({
      slug: 'site-content',
      depth: 1,
    })) as { pages?: Record<string, Record<string, unknown>> }

    const responseBody = {
      pages: {
        home: normalizePage(content.pages?.home),
        about: normalizePage(content.pages?.about),
        loan: normalizePage(content.pages?.loan),
        howToApply: normalizePage(content.pages?.howToApply),
        contact: normalizePage(content.pages?.contact),
      },
    }

    return Response.json(responseBody, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  },
}
