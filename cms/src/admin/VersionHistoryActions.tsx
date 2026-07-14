'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  buildRestoreConfirmationDetails,
  getVersionBadgeLabel,
  RESTORE_HELPER_TEXT,
  shouldDisableSelectedVersionRestore,
  type VersionInfo,
} from './versionHistoryUx'

type VersionActionInfo = {
  currentVersion?: VersionInfo
  isCurrentVersion?: boolean
  restoredFromVersion?: VersionInfo
  selectedVersion?: VersionInfo
  warnings?: string[]
}

function getGlobalSlugFromPath(pathname: string): string | undefined {
  return pathname.match(/\/admin\/globals\/([^/?#]+)/)?.[1]
}

function getSelectedVersionIdFromPath(pathname: string): string | undefined {
  return pathname.match(/\/versions\/([^/?#]+)/)?.[1]
}

async function fetchJson<TData = unknown>(url: string, init?: RequestInit): Promise<TData> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const data = await response.json().catch(() => ({})) as {
    errors?: Array<{ message?: string }>
    message?: string
  }
  if (!response.ok) {
    const message = data?.errors?.[0]?.message || data?.message || 'Request failed.'
    throw new Error(message)
  }
  return data as TData
}

function confirmRestore(info: { currentVersion?: VersionInfo; selectedVersion?: VersionInfo }) {
  return window.confirm(buildRestoreConfirmationDetails(info).join('\n'))
}

export default function VersionHistoryActions() {
  const [selectedInfo, setSelectedInfo] = useState<VersionActionInfo | null>(null)
  const [undoInfo, setUndoInfo] = useState<VersionActionInfo | null>(null)
  const [message, setMessage] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const pathname = typeof window === 'undefined' ? '' : window.location.pathname
  const globalSlug = useMemo(() => getGlobalSlugFromPath(pathname), [pathname])
  const selectedVersionId = useMemo(() => getSelectedVersionIdFromPath(pathname), [pathname])
  const baseUrl = globalSlug ? `/api/globals/${globalSlug}` : undefined

  useEffect(() => {
    if (!baseUrl) return

    fetchJson<VersionActionInfo>(`${baseUrl}/undo-latest-published-change`)
      .then(setUndoInfo)
      .catch(() => setUndoInfo(null))

    if (selectedVersionId) {
      fetchJson<VersionActionInfo>(`${baseUrl}/versions/${selectedVersionId}/restore-info`)
        .then(setSelectedInfo)
        .catch(() => setSelectedInfo(null))
    }
  }, [baseUrl, selectedVersionId])

  useEffect(() => {
    if (!selectedInfo) return

    const nativeButtons = Array.from(document.querySelectorAll('button'))
      .filter((button) => button.textContent?.trim() === 'Restore this version')

    nativeButtons.forEach((button) => {
      button.textContent = 'Use this version as current content'
      button.setAttribute('aria-hidden', 'true')
      button.setAttribute('data-version-history-native-restore', 'hidden')
      button.setAttribute('disabled', 'true')
      button.setAttribute('tabindex', '-1')
      button.style.display = 'none'
    })
  }, [selectedInfo])

  if (!baseUrl) return null

  const isVersionPage = Boolean(selectedVersionId)
  const selectedRestoreDisabled = selectedInfo
    ? shouldDisableSelectedVersionRestore({
      currentVersion: selectedInfo.currentVersion,
      selectedVersion: selectedInfo.selectedVersion,
    })
    : true

  async function undoLatest() {
    if (!baseUrl || !undoInfo?.currentVersion || !undoInfo.restoredFromVersion) return
    if (!confirmRestore({
      currentVersion: undoInfo.currentVersion,
      selectedVersion: undoInfo.restoredFromVersion,
    })) return

    setIsBusy(true)
    setMessage('')
    try {
      await fetchJson(`${baseUrl}/undo-latest-published-change`, { method: 'POST' })
      setMessage('Undo restored the previous published version. The Preview rebuild has been triggered.')
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Undo failed.')
    } finally {
      setIsBusy(false)
    }
  }

  async function restoreSelected() {
    if (!baseUrl || !selectedVersionId || !selectedInfo?.selectedVersion) return
    if (!confirmRestore({
      currentVersion: selectedInfo.currentVersion,
      selectedVersion: selectedInfo.selectedVersion,
    })) return

    setIsBusy(true)
    setMessage('')
    try {
      await fetchJson(`${baseUrl}/versions/${selectedVersionId}`, { method: 'POST' })
      setMessage('Selected version is now current content. The Preview rebuild has been triggered.')
      window.location.href = `/admin/globals/${globalSlug}`
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Restore failed.')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div style={{
      border: '1px solid var(--theme-elevation-200)',
      borderRadius: 4,
      marginBottom: 16,
      padding: 12,
    }}>
      <p style={{ margin: '0 0 10px' }}>{RESTORE_HELPER_TEXT}</p>
      {undoInfo?.currentVersion && undoInfo.restoredFromVersion ? (
        <button disabled={isBusy} onClick={undoLatest} type="button">
          Undo latest published change
        </button>
      ) : null}
      {isVersionPage && selectedInfo?.selectedVersion ? (
        <div style={{ marginTop: 10 }}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>{getVersionBadgeLabel({
              isCurrent: Boolean(selectedInfo.isCurrentVersion),
              status: selectedInfo.selectedVersion.status,
            })}</strong>
            {' '}
            version {selectedInfo.selectedVersion.id}
          </p>
          <button disabled={isBusy || selectedRestoreDisabled} onClick={restoreSelected} type="button">
            Use this version as current content
          </button>
        </div>
      ) : null}
      {message ? <p style={{ margin: '10px 0 0' }}>{message}</p> : null}
    </div>
  )
}
