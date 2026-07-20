'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useEffect, useMemo, useRef } from 'react'

import type { PublicPayloadContent } from '../../../../../../src/payload/content'
import type { LegacyContentBinding } from '../../../../../../src/payload/renderLegacyContent'
import { mergePreviewGlobal } from '../../../../preview/livePreview'

type Props = {
  bindings: LegacyContentBinding[]
  bodyClassName: string
  globalKey: keyof PublicPayloadContent
  initialContent: PublicPayloadContent
  initialGlobal: unknown
  initialHtml: string
  pageFile: string
  serverURL: string
}

function getValue(content: PublicPayloadContent, path: string): unknown {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .reduce<unknown>((value, key) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined), content)
}

function getSafeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const candidate = value.trim()
  if (!candidate || /[\u0000-\u001f\u007f]/.test(candidate) || /^[\\/]{2}/.test(candidate)) return undefined

  try {
    const parsed = new URL(candidate, window.location.origin)
    if (parsed.origin === window.location.origin) return candidate
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') return candidate
  } catch {
    return undefined
  }

  return undefined
}

function applyBinding(binding: LegacyContentBinding, content: PublicPayloadContent): void {
  const element = document.getElementById(binding.id)
  if (!element) return

  const value = getValue(content, binding.path)
  if (value == null) return

  if (binding.kind === 'image' && typeof value === 'object' && 'src' in value) {
    const image = value as { alt?: string; src?: string }
    const safeSrc = getSafeUrl(image.src)
    if (safeSrc) element.setAttribute('src', safeSrc)
    element.setAttribute('alt', image.alt || '')
    return
  }

  if (binding.kind === 'href') {
    const safeHref = getSafeUrl(value)
    if (safeHref) element.setAttribute('href', safeHref)
    return
  }

  if (binding.kind === 'counter') {
    const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(String(value).trim())
    if (match) {
      element.setAttribute('data-target', match[1])
      element.setAttribute('data-suffix', match[2])
      element.textContent = `${match[1]}${match[2]}`
    }
    return
  }

  element.textContent = String(value)
}

export function MetroLivePreviewClient({
  bindings,
  bodyClassName,
  globalKey,
  initialContent,
  initialGlobal,
  initialHtml,
  pageFile,
  serverURL,
}: Props) {
  const pageRef = useRef<HTMLDivElement>(null)
  const { data } = useLivePreview<Record<string, unknown>>({
    depth: 1,
    initialData: initialGlobal as Record<string, unknown>,
    serverURL,
  })

  const liveContent = useMemo(
    () => mergePreviewGlobal(initialContent, globalKey, data, serverURL),
    [data, globalKey, initialContent, serverURL],
  )

  useEffect(() => {
    document.body.className = bodyClassName
    document.body.dataset.metroLivePreview = 'true'
  }, [bodyClassName])

  useEffect(() => {
    const pageBindings = bindings.filter((binding) => binding.pages.includes(pageFile as never))
    pageBindings.forEach((binding) => applyBinding(binding, liveContent))
  }, [bindings, liveContent, pageFile])

  return <div ref={pageRef} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: initialHtml }} />
}
