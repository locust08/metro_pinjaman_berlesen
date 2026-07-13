import type { GlobalAfterChangeHook } from 'payload'

export function shouldTriggerPagesDeploy(doc: { _status?: string } | null | undefined): boolean {
  return doc?._status === 'published'
}

export const triggerPagesDeployAfterPublish: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (!shouldTriggerPagesDeploy(doc as { _status?: string })) return doc

  const url = process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL
  if (!url) {
    req.payload.logger?.warn?.('CLOUDFLARE_PAGES_DEPLOY_HOOK_URL is not configured; skipping frontend rebuild.')
    return doc
  }

  try {
    const response = await fetch(url, { method: 'POST' })
    if (!response.ok) {
      req.payload.logger?.error?.(`Cloudflare Pages deploy hook failed with status ${response.status}.`)
    }
  } catch (error) {
    req.payload.logger?.error?.(
      `Cloudflare Pages deploy hook request failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  return doc
}
