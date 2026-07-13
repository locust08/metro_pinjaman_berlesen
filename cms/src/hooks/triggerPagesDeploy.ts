import type { GlobalAfterChangeHook } from 'payload'

export const DEPLOY_HOOK_TIMEOUT_MS = 10_000

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

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEPLOY_HOOK_TIMEOUT_MS)

  try {
    const response = await fetch(url, { method: 'POST', signal: controller.signal })
    if (!response.ok) {
      req.payload.logger?.error?.(`Cloudflare Pages deploy hook failed with status ${response.status}.`)
    }
  } catch {
    req.payload.logger?.error?.('Cloudflare Pages deploy hook request failed.')
  } finally {
    clearTimeout(timeout)
  }

  return doc
}
