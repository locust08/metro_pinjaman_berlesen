import { describe, expect, it } from 'vitest'

import {
  buildRestoreConfirmationDetails,
  getVersionBadgeLabel,
  RESTORE_HELPER_TEXT,
  shouldDisableSelectedVersionRestore,
} from '../src/admin/versionHistoryUx'

describe('Payload version history UX helpers', () => {
  it('explains when to use undo latest versus selected snapshot restore', () => {
    expect(RESTORE_HELPER_TEXT).toContain('To undo your latest edit, use Undo latest published change.')
    expect(RESTORE_HELPER_TEXT).toContain('To return to an older snapshot')
    expect(RESTORE_HELPER_TEXT).toContain('Use this version as current content')
  })

  it('builds confirmation details with selected and current version metadata', () => {
    const details = buildRestoreConfirmationDetails({
      currentVersion: { id: 42 },
      selectedVersion: {
        id: 41,
        status: 'published',
        updatedAt: '2026-07-14T15:30:00.000Z',
      },
    })

    expect(details).toEqual(expect.arrayContaining([
      'Selected version ID: 41',
      'Current version ID: 42',
      'Selected version date: 2026-07-14T15:30:00.000Z',
      'Selected version status: published',
      'Warning: all fields will match the selected snapshot.',
      'Version history will remain available.',
    ]))
  })

  it('disables selected snapshot restore when viewing the current version', () => {
    expect(shouldDisableSelectedVersionRestore({
      currentVersion: { id: 42 },
      selectedVersion: { id: 42 },
    })).toBe(true)

    expect(shouldDisableSelectedVersionRestore({
      currentVersion: { id: 42 },
      selectedVersion: { id: 41 },
    })).toBe(false)
  })

  it('uses clear version badge labels', () => {
    expect(getVersionBadgeLabel({ isCurrent: true, status: 'published' })).toBe('Current')
    expect(getVersionBadgeLabel({ isCurrent: false, status: 'draft' })).toBe('Draft')
    expect(getVersionBadgeLabel({ isCurrent: false, status: 'published' })).toBe('Previously Published')
  })
})
