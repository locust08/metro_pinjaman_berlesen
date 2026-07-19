import { defaultPayloadContent, type PublicPayloadContent } from './content.ts';

const PAYLOAD_FETCH_TIMEOUT_MS = 10_000;

function getPublishedContentUrl(): string {
  return process.env.PAYLOAD_PUBLIC_CONTENT_URL
    ?? 'https://metropinjamanberlesen-payload-cms.easondev.workers.dev/api/published-content';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mergePublishedContentWithFallback(fallback: unknown, value: unknown): unknown {
  if (value == null) return fallback;

  if (Array.isArray(fallback) && Array.isArray(value)) {
    return value.map((item, index) => mergePublishedContentWithFallback(fallback[index], item));
  }

  if (isRecord(fallback) && isRecord(value)) {
    const keys = new Set([...Object.keys(fallback), ...Object.keys(value)]);
    return Object.fromEntries(
      [...keys].map((key) => [key, mergePublishedContentWithFallback(fallback[key], value[key])]),
    );
  }

  return value;
}

export async function fetchPayloadContent(): Promise<PublicPayloadContent> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PAYLOAD_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(getPublishedContentUrl(), {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) return defaultPayloadContent;

    const content: unknown = await response.json();
    if (!isRecord(content)) return defaultPayloadContent;

    return mergePublishedContentWithFallback(defaultPayloadContent, content) as PublicPayloadContent;
  } catch {
    return defaultPayloadContent;
  } finally {
    clearTimeout(timeout);
  }
}
