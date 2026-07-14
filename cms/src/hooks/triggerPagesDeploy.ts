import type { GlobalAfterChangeHook } from 'payload'

export const DEPLOY_HOOK_TIMEOUT_MS = 10_000

let configuredPagesDeployHookUrl: string | undefined

export function configurePagesDeployHookUrl(url: string | undefined): void {
  configuredPagesDeployHookUrl = url
}

export function shouldTriggerPagesDeploy(doc: { _status?: string } | null | undefined): boolean {
  return doc?._status === 'published'
}

function getPagesDeployHookUrl(): string | undefined {
  const processEnvUrl = process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL

  if (processEnvUrl && processEnvUrl !== 'undefined') return processEnvUrl
  return configuredPagesDeployHookUrl
}

export const triggerPagesDeployAfterPublish: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (!shouldTriggerPagesDeploy(doc as { _status?: string })) return doc

  const url = getPagesDeployHookUrl()
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
