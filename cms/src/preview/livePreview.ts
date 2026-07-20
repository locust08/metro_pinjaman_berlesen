import type { PublicPayloadContent, SitePageId } from '../../../src/payload/content'
import { defaultPayloadContent } from '../../../src/payload/content'
import { DEFAULT_PAYLOAD_PUBLIC_SERVER_URL, normalizeForFrontend } from '../endpoints/publishedContent'

export type LivePreviewPage = 'about_us' | 'contact' | 'home' | 'how_to_apply' | 'loan'
export type PreviewGlobalSlug =
  | 'about-us-page'
  | 'contact-us-page'
  | 'home-page'
  | 'how-to-apply-page'
  | 'loan-page'
  | 'site-settings'

export type LivePreviewMapping = {
  fileName: 'about_us.html' | 'contact.html' | 'how_to_apply.html' | 'index.html' | 'loan.html'
  globalKey: keyof PublicPayloadContent
  page: LivePreviewPage
  pageId: SitePageId
  slug: PreviewGlobalSlug
}

export const livePreviewMappings: Record<PreviewGlobalSlug, LivePreviewMapping> = {
  'site-settings': {
    fileName: 'index.html',
    globalKey: 'siteSettings',
    page: 'home',
    pageId: 'home',
    slug: 'site-settings',
  },
  'home-page': {
    fileName: 'index.html',
    globalKey: 'homePage',
    page: 'home',
    pageId: 'home',
    slug: 'home-page',
  },
  'about-us-page': {
    fileName: 'about_us.html',
    globalKey: 'aboutUsPage',
    page: 'about_us',
    pageId: 'aboutUs',
    slug: 'about-us-page',
  },
  'loan-page': {
    fileName: 'loan.html',
    globalKey: 'loanPage',
    page: 'loan',
    pageId: 'loan',
    slug: 'loan-page',
  },
  'how-to-apply-page': {
    fileName: 'how_to_apply.html',
    globalKey: 'howToApplyPage',
    page: 'how_to_apply',
    pageId: 'howToApply',
    slug: 'how-to-apply-page',
  },
  'contact-us-page': {
    fileName: 'contact.html',
    globalKey: 'contactUsPage',
    page: 'contact',
    pageId: 'contactUs',
    slug: 'contact-us-page',
  },
}

export const livePreviewPages = Object.fromEntries(
  Object.values(livePreviewMappings).map((mapping) => [mapping.page, mapping]),
) as Record<LivePreviewPage, LivePreviewMapping>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function mergePreviewWithFallback(fallback: unknown, value: unknown): unknown {
  if (value == null) return fallback

  if (Array.isArray(fallback) && Array.isArray(value)) {
    return value.map((item, index) => mergePreviewWithFallback(fallback[index], item))
  }

  if (isRecord(fallback) && isRecord(value)) {
    const keys = new Set([...Object.keys(fallback), ...Object.keys(value)])
    return Object.fromEntries(
      [...keys].map((key) => [key, mergePreviewWithFallback(fallback[key], value[key])]),
    )
  }

  return value
}

export function getLivePreviewMapping(page: string | undefined): LivePreviewMapping | undefined {
  if (!page) return undefined
  return livePreviewPages[page as LivePreviewPage]
}

export function buildLivePreviewUrl(slug: string | undefined, serverURL = DEFAULT_PAYLOAD_PUBLIC_SERVER_URL): string | undefined {
  const mapping = livePreviewMappings[slug as PreviewGlobalSlug]
  if (!mapping) return undefined

  return `${serverURL.replace(/\/$/, '')}/preview/${mapping.page}`
}

export function normalizePreviewGlobal(value: unknown, key: keyof PublicPayloadContent, serverURL = DEFAULT_PAYLOAD_PUBLIC_SERVER_URL): unknown {
  return normalizeForFrontend(value, serverURL, [key])
}

export function mergePreviewGlobal(
  content: PublicPayloadContent,
  key: keyof PublicPayloadContent,
  value: unknown,
  serverURL = DEFAULT_PAYLOAD_PUBLIC_SERVER_URL,
): PublicPayloadContent {
  return mergePreviewWithFallback(content, {
    [key]: normalizePreviewGlobal(value, key, serverURL),
  }) as PublicPayloadContent
}

export function mergePreviewContent(value: unknown, key: keyof PublicPayloadContent): PublicPayloadContent {
  return mergePreviewWithFallback(defaultPayloadContent, { [key]: value }) as PublicPayloadContent
}
