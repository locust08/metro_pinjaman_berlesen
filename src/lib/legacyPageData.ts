import fs from 'fs';
import path from 'path';
import type { LegacyPageProps } from './legacyPage';

const legacyPageDir = path.join(process.cwd(), 'src', 'legacy-pages');

function matchFirst(source: string, pattern: RegExp): string {
  return pattern.exec(source)?.[1]?.trim() || '';
}

export function loadLegacyPage(fileName: string): LegacyPageProps {
  const html = fs.readFileSync(path.join(legacyPageDir, fileName), 'utf8');
  const title = matchFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const bodyClassName = matchFirst(html, /<body[^>]*class=["']([^"']*)["'][^>]*>/i);
  const bodyHtml = matchFirst(html, /<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!bodyHtml) {
    throw new Error(`Could not extract body HTML from ${fileName}`);
  }

  return {
    title,
    bodyClassName,
    bodyHtml,
  };
}
