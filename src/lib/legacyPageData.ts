import fs from 'fs';
import path from 'path';
import { fetchPayloadContent } from '../payload/fetchPayloadContent';
import { renderLegacyContent } from '../payload/renderLegacyContent';
import type { SitePageId } from '../payload/content';
import type { LegacyPageContent } from './legacyPage';

const legacyPageDir = path.join(process.cwd(), 'src', 'legacy-pages');

function matchFirst(source: string, pattern: RegExp): string {
  return pattern.exec(source)?.[1]?.trim() || '';
}

export async function loadLegacyPage(fileName: string, pageId: SitePageId): Promise<LegacyPageContent> {
  const html = fs.readFileSync(path.join(legacyPageDir, fileName), 'utf8');
  const title = matchFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const bodyClassName = matchFirst(html, /<body[^>]*class=["']([^"']*)["'][^>]*>/i);
  const bodyHtml = matchFirst(html, /<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!bodyHtml) {
    throw new Error(`Could not extract body HTML from ${fileName}`);
  }

  const content = await fetchPayloadContent();

  return {
    title,
    bodyClassName,
    bodyHtml: renderLegacyContent(bodyHtml, pageId, content),
  };
}
