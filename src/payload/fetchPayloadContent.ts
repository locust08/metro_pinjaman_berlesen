import { defaultPayloadContent, type PublicPayloadContent } from './content.ts';

function getPublishedContentUrl(): string {
  return process.env.PAYLOAD_PUBLIC_CONTENT_URL
    ?? 'https://metropinjamanberlesen-payload-cms.easondev.workers.dev/api/published-content';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeNullishFallback(fallback: unknown, value: unknown): unknown {
  if (value == null) return fallback;

  if (Array.isArray(fallback) && Array.isArray(value)) {
    return value.map((item, index) => mergeNullishFallback(fallback[index], item));
  }

  if (isRecord(fallback) && isRecord(value)) {
    const keys = new Set([...Object.keys(fallback), ...Object.keys(value)]);
    return Object.fromEntries(
      [...keys].map((key) => [key, mergeNullishFallback(fallback[key], value[key])]),
    );
  }

  return value;
}

export async function fetchPayloadContent(): Promise<PublicPayloadContent> {
  try {
    const response = await fetch(getPublishedContentUrl(), {
      headers: { accept: 'application/json' },
    });

    if (!response.ok) return defaultPayloadContent;

    const content: unknown = await response.json();
    if (!isRecord(content)) return defaultPayloadContent;

    return mergeNullishFallback(defaultPayloadContent, content) as PublicPayloadContent;
  } catch {
    return defaultPayloadContent;
  }
}
