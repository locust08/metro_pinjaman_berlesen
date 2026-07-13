import { afterEach, describe, expect, it, vi } from 'vitest'

import { shouldTriggerPagesDeploy, triggerPagesDeployAfterPublish } from '../src/hooks/triggerPagesDeploy'

describe('Cloudflare Pages deploy hook', () => {
  const originalFetch = global.fetch
  const originalUrl = process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL

  afterEach(() => {
    global.fetch = originalFetch
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = originalUrl
    vi.restoreAllMocks()
  })

  it('does not fetch for draft saves', async () => {
    const fetchMock = vi.fn()
    global.fetch = fetchMock
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = 'https://example.com/deploy-hook'

    await expect(triggerPagesDeployAfterPublish({ doc: { _status: 'draft' }, req: { payload: {} } } as any)).resolves.toMatchObject({ _status: 'draft' })

    expect(shouldTriggerPagesDeploy({ _status: 'draft' })).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('triggers for published content', () => {
    expect(shouldTriggerPagesDeploy({ _status: 'published' })).toBe(true)
  })

  it('calls the deploy hook URL for published content', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 200 }))
    global.fetch = fetchMock
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = 'https://example.com/deploy-hook'

    await triggerPagesDeployAfterPublish({ doc: { _status: 'published' }, req: { payload: { logger: console } } } as any)

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/deploy-hook', { method: 'POST' })
  })

  it('logs a rejected deploy request without rejecting the save', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'))
    const error = vi.fn()
    global.fetch = fetchMock
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = 'https://example.com/deploy-hook'

    await expect(triggerPagesDeployAfterPublish({ doc: { _status: 'published' }, req: { payload: { logger: { error } } } } as any)).resolves.toMatchObject({ _status: 'published' })

    expect(error).toHaveBeenCalledWith('Cloudflare Pages deploy hook request failed: offline')
  })

  it('logs a non-OK deploy response without rejecting the save', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 503 }))
    const error = vi.fn()
    global.fetch = fetchMock
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = 'https://example.com/deploy-hook'

    await expect(triggerPagesDeployAfterPublish({ doc: { _status: 'published' }, req: { payload: { logger: { error } } } } as any)).resolves.toMatchObject({ _status: 'published' })

    expect(error).toHaveBeenCalledWith('Cloudflare Pages deploy hook failed with status 503.')
  })
})
