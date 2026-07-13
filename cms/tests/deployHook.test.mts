import { describe, expect, it, vi } from 'vitest'

import { shouldTriggerPagesDeploy, triggerPagesDeployAfterPublish } from '../src/hooks/triggerPagesDeploy'

describe('Cloudflare Pages deploy hook', () => {
  it('does not trigger for draft saves', () => {
    expect(shouldTriggerPagesDeploy({ _status: 'draft' })).toBe(false)
  })

  it('triggers for published content', () => {
    expect(shouldTriggerPagesDeploy({ _status: 'published' })).toBe(true)
  })

  it('calls the deploy hook URL for published content', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 200 }))
    const originalFetch = global.fetch
    const originalUrl = process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL
    global.fetch = fetchMock
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = 'https://example.com/deploy-hook'

    await triggerPagesDeployAfterPublish({ doc: { _status: 'published' }, req: { payload: { logger: console } } } as any)

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/deploy-hook', { method: 'POST' })

    global.fetch = originalFetch
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = originalUrl
  })
})
