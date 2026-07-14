export type VersionInfo = {
  id?: number | string
  status?: string
  updatedAt?: string
}

export const RESTORE_HELPER_TEXT =
  'To undo your latest edit, use Undo latest published change. To return to an older snapshot, open that version and use Use this version as current content.'

export function buildRestoreConfirmationDetails({
  currentVersion,
  selectedVersion,
}: {
  currentVersion?: VersionInfo
  selectedVersion?: VersionInfo
}): string[] {
  return [
    `Selected version ID: ${selectedVersion?.id ?? 'Unknown'}`,
    `Current version ID: ${currentVersion?.id ?? 'Unknown'}`,
    `Selected version date: ${selectedVersion?.updatedAt ?? 'Unknown'}`,
    `Selected version status: ${selectedVersion?.status ?? 'Unknown'}`,
    'Warning: all fields will match the selected snapshot.',
    'Version history will remain available.',
  ]
}

export function shouldDisableSelectedVersionRestore({
  currentVersion,
  selectedVersion,
}: {
  currentVersion?: VersionInfo
  selectedVersion?: VersionInfo
}): boolean {
  return Boolean(currentVersion?.id && selectedVersion?.id && String(currentVersion.id) === String(selectedVersion.id))
}

export function getVersionBadgeLabel({
  isCurrent,
  status,
}: {
  isCurrent: boolean
  status?: string
}): string {
  if (isCurrent) return 'Current'
  if (status === 'draft') return 'Draft'
  if (status === 'published') return 'Previously Published'
  return status || 'Version'
}
