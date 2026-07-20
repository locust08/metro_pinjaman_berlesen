import { headers as getHeaders } from 'next/headers.js'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '../../../../payload.config'
import { defaultPayloadContent, type PublicPayloadContent } from '../../../../../../src/payload/content'
import { legacyContentBindings } from '../../../../../../src/payload/renderLegacyContent'
import { normalizeForFrontend } from '../../../../endpoints/publishedContent'
import { getLivePreviewMapping, mergePreviewWithFallback } from '../../../../preview/livePreview'
import { MetroLivePreviewClient } from './MetroLivePreviewClient'

type Props = {
  params: Promise<{ page: string }>
}

export const dynamic = 'force-dynamic'

const publishedFrontendOrigin = 'https://metropinjamanberlesen.pages.dev'

function matchFirst(source: string, pattern: RegExp): string {
  return pattern.exec(source)?.[1]?.trim() || ''
}

async function loadPublishedContent(payload: Awaited<ReturnType<typeof getPayload>>, serverURL: string): Promise<PublicPayloadContent> {
  const values = await Promise.all([
    payload.findGlobal({ depth: 1, draft: false, slug: 'site-settings' }),
    payload.findGlobal({ depth: 1, draft: false, slug: 'home-page' }),
    payload.findGlobal({ depth: 1, draft: false, slug: 'about-us-page' }),
    payload.findGlobal({ depth: 1, draft: false, slug: 'loan-page' }),
    payload.findGlobal({ depth: 1, draft: false, slug: 'how-to-apply-page' }),
    payload.findGlobal({ depth: 1, draft: false, slug: 'contact-us-page' }),
  ])

  return mergePreviewWithFallback(defaultPayloadContent, {
    aboutUsPage: normalizeForFrontend(values[2], serverURL, ['aboutUsPage']),
    contactUsPage: normalizeForFrontend(values[5], serverURL, ['contactUsPage']),
    homePage: normalizeForFrontend(values[1], serverURL, ['homePage']),
    howToApplyPage: normalizeForFrontend(values[4], serverURL, ['howToApplyPage']),
    loanPage: normalizeForFrontend(values[3], serverURL, ['loanPage']),
    siteSettings: normalizeForFrontend(values[0], serverURL, ['siteSettings']),
  }) as PublicPayloadContent
}

async function loadPublishedPageHtml(fileName: string): Promise<{ bodyClassName: string; bodyHtml: string }> {
  const pathname = fileName === 'index.html' ? '/' : `/${fileName}`
  const response = await fetch(`${publishedFrontendOrigin}${pathname}`, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Unable to load published Metro page for Live Preview: ${response.status}`)
  }

  const html = await response.text()

  return {
    bodyClassName: matchFirst(html, /<body[^>]*class=["']([^"']*)["'][^>]*>/i),
    bodyHtml: matchFirst(html, /<body[^>]*>([\s\S]*?)<\/body>/i),
  }
}

export default async function MetroLivePreviewPage({ params }: Props) {
  const { page } = await params
  const mapping = getLivePreviewMapping(page)
  if (!mapping) notFound()

  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return (
      <main style={{ fontFamily: 'system-ui, sans-serif', margin: '64px auto', maxWidth: 680, padding: 24 }}>
        <h1>Authentication required</h1>
        <p>This Metro Live Preview route is available only inside an authenticated Payload Admin session.</p>
      </main>
    )
  }

  const serverURL = payloadConfig.serverURL
  const content = await loadPublishedContent(payload, serverURL)
  const { bodyClassName, bodyHtml } = await loadPublishedPageHtml(mapping.fileName)
  const initialGlobal = content[mapping.globalKey]

  return (
    <MetroLivePreviewClient
      bindings={legacyContentBindings}
      bodyClassName={bodyClassName}
      globalKey={mapping.globalKey}
      initialContent={content}
      initialGlobal={initialGlobal}
      initialHtml={bodyHtml}
      pageFile={mapping.fileName}
      serverURL={serverURL}
    />
  )
}
