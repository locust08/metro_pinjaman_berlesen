import { defaultPayloadContent, type PublicPayloadContent } from './content.ts';

const PAYLOAD_FETCH_TIMEOUT_MS = 10_000;

function getPublishedContentUrl(): string {
  return process.env.PAYLOAD_PUBLIC_CONTENT_URL
    ?? 'https://metropinjamanberlesen-payload-cms.easondev.workers.dev/api/published-content';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const staleTemplateContentPatterns = [
  /LoanEase/i,
  /green energy/i,
  /Powering Tomorrow/i,
  /The Future of Green Energy/i,
  /Get the funds you need with competitive rates/i,
  /^Simple Loans,?$/i,
  /^Check Your Rate$/i,
  /^Learn More$/i,
  /^Get your loan in four simple steps\.?$/i,
  /^Select Loan$/i,
  /^Apply Online$/i,
  /^Get Approved$/i,
  /^Choose the perfect loan to match your goals\.?$/i,
  /^Lending you trust, building your future\.?$/i,
  /^Get Your Loan in Simple Steps$/i,
  /^© 2026 Flow\b/i,
];

function isStaleTemplateString(value: string): boolean {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return staleTemplateContentPatterns.some((pattern) => pattern.test(normalized));
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

  if (typeof value === 'string' && isStaleTemplateString(value)) {
    return typeof fallback === 'string' ? fallback : '';
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
