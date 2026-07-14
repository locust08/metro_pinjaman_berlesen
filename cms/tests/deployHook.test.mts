import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  configurePagesDeployHookUrl,
  DEPLOY_HOOK_TIMEOUT_MS,
  shouldTriggerPagesDeploy,
  triggerPagesDeployAfterPublish,
} from '../src/hooks/triggerPagesDeploy'

describe('Cloudflare Pages deploy hook', () => {
  const originalFetch = global.fetch
  const originalUrl = process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL

  afterEach(() => {
    vi.useRealTimers()
    global.fetch = originalFetch
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = originalUrl
    configurePagesDeployHookUrl(undefined)
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

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/deploy-hook',
      expect.objectContaining({ method: 'POST', signal: expect.any(AbortSignal) }),
    )
  })

  it('uses the configured Worker secret binding when process env is unavailable', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 200 }))
    global.fetch = fetchMock
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = undefined
    configurePagesDeployHookUrl('https://example.com/worker-binding-deploy-hook')

    await triggerPagesDeployAfterPublish({ doc: { _status: 'published' }, req: { payload: { logger: console } } } as any)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/worker-binding-deploy-hook',
      expect.objectContaining({ method: 'POST', signal: expect.any(AbortSignal) }),
    )
  })

  it('logs a rejected deploy request without rejecting the save', async () => {
    const secretUrl = 'https://example.com/deploy-hook?token=fake-secret'
    const fetchMock = vi.fn().mockRejectedValue(new Error(`request failed for ${secretUrl}`))
    const error = vi.fn()
    global.fetch = fetchMock
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = secretUrl

    await expect(triggerPagesDeployAfterPublish({ doc: { _status: 'published' }, req: { payload: { logger: { error } } } } as any)).resolves.toMatchObject({ _status: 'published' })

    expect(error).toHaveBeenCalledWith('Cloudflare Pages deploy hook request failed.')
    expect(error).not.toHaveBeenCalledWith(expect.stringContaining('fake-secret'))
  })

  it('logs a non-OK deploy response without rejecting the save', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 503 }))
    const error = vi.fn()
    global.fetch = fetchMock
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = 'https://example.com/deploy-hook'

    await expect(triggerPagesDeployAfterPublish({ doc: { _status: 'published' }, req: { payload: { logger: { error } } } } as any)).resolves.toMatchObject({ _status: 'published' })

    expect(error).toHaveBeenCalledWith('Cloudflare Pages deploy hook failed with status 503.')
  })

  it('aborts a deploy hook request that exceeds the timeout without rejecting the save', async () => {
    vi.useFakeTimers()
    const error = vi.fn()
    const fetchMock = vi.fn((_url: string, options: RequestInit) => new Promise<Response>((_resolve, reject) => {
      options.signal?.addEventListener('abort', () => reject(options.signal?.reason))
    }))
    global.fetch = fetchMock as typeof fetch
    process.env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL = 'https://example.com/deploy-hook'

    const result = triggerPagesDeployAfterPublish({
      doc: { _status: 'published' },
      req: { payload: { logger: { error } } },
    } as any)
    await vi.advanceTimersByTimeAsync(DEPLOY_HOOK_TIMEOUT_MS)

    await expect(result).resolves.toMatchObject({ _status: 'published' })
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true)
    expect(error).toHaveBeenCalledWith('Cloudflare Pages deploy hook request failed.')
  })
})
