import { describe, expect, it, vi } from 'vitest'

import { restoreGlobalVersionWithDeployEndpoint } from '../src/endpoints/restoreGlobalVersionWithDeploy'

function makeReq(overrides: Record<string, unknown> = {}) {
  return {
    context: {},
    headers: new Headers({ Origin: 'https://metropinjamanberlesen-payload-cms.easondev.workers.dev' }),
    payload: {
      config: {
        cors: ['https://metropinjamanberlesen-payload-cms.easondev.workers.dev'],
      },
      logger: {
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
      },
    },
    query: {
      populate: {
        websiteLogo: 'true',
      },
    },
    routeParams: {
      id: '26',
    },
    searchParams: new URLSearchParams('depth=2'),
    t: vi.fn((key: string) => `translated:${key}`),
    ...overrides,
  }
}

describe('restore Global version endpoint', () => {
  it('restores the selected Global version and returns a Payload-compatible Admin response', async () => {
    const restoredDoc = {
      _status: 'published',
      footer: {
        copyrightText: '© 2026 Flow. All rights reserved.  ',
      },
      id: 30,
    }
    const restoreVersionOperation = vi.fn().mockResolvedValue(restoredDoc)
    const endpoint = restoreGlobalVersionWithDeployEndpoint(
      { slug: 'site-settings' } as never,
      { restoreVersionOperation: restoreVersionOperation as never },
    )

    const response = await endpoint.handler(makeReq() as never)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://metropinjamanberlesen-payload-cms.easondev.workers.dev')
    expect(body).toEqual({
      doc: restoredDoc,
      message: 'translated:version:restoredSuccessfully',
    })
    expect(restoreVersionOperation).toHaveBeenCalledWith(expect.objectContaining({
      depth: 2,
      globalConfig: { slug: 'site-settings' },
      id: '26',
      populate: { websiteLogo: 'true' },
      req: expect.any(Object),
    }))
  })

  it('returns a controlled 400 when the Admin restore request does not include a version ID', async () => {
    const restoreVersionOperation = vi.fn()
    const endpoint = restoreGlobalVersionWithDeployEndpoint(
      { slug: 'site-settings' } as never,
      { restoreVersionOperation: restoreVersionOperation as never },
    )

    const response = await endpoint.handler(makeReq({ routeParams: {} }) as never)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({ errors: [{ message: 'Missing ID of version to restore.' }] })
    expect(restoreVersionOperation).not.toHaveBeenCalled()
  })

  it('does not return success until the restore operation has completed', async () => {
    const events: string[] = []
    const restoreVersionOperation = vi.fn().mockImplementation(async () => {
      events.push('restore-started')
      await Promise.resolve()
      events.push('restore-completed')
      return { _status: 'published', id: 31 }
    })
    const endpoint = restoreGlobalVersionWithDeployEndpoint(
      { slug: 'site-settings' } as never,
      { restoreVersionOperation: restoreVersionOperation as never },
    )

    const response = await endpoint.handler(makeReq() as never)
    events.push(`response-${response.status}`)

    expect(events).toEqual(['restore-started', 'restore-completed', 'response-200'])
  })
})
