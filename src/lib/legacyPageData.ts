import fs from 'fs';
import path from 'path';
import { fetchPayloadContent } from '../payload/fetchPayloadContent.ts';
import { renderLegacyContent } from '../payload/renderLegacyContent.ts';
import type { PublicPayloadContent, SitePageId } from '../payload/content.ts';
import type { LegacyPageContent } from './legacyPage.tsx';

const legacyPageDir = path.join(process.cwd(), 'src', 'legacy-pages');

function matchFirst(source: string, pattern: RegExp): string {
  return pattern.exec(source)?.[1]?.trim() || '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getPageSeo(content: PublicPayloadContent, pageId: SitePageId) {
  const page = {
    home: content.homePage,
    aboutUs: content.aboutUsPage,
    loan: content.loanPage,
    howToApply: content.howToApplyPage,
    contactUs: content.contactUsPage,
  }[pageId];
  const seo = isRecord(page) && isRecord(page.seo) ? page.seo : {};

  return {
    title: typeof seo.title === 'string' ? seo.title : '',
    description: typeof seo.description === 'string' ? seo.description : '',
  };
}

export async function loadLegacyPage(fileName: string, pageId: SitePageId): Promise<LegacyPageContent> {
  const html = fs.readFileSync(path.join(legacyPageDir, fileName), 'utf8');
  const fallbackTitle = matchFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const bodyClassName = matchFirst(html, /<body[^>]*class=["']([^"']*)["'][^>]*>/i);
  const bodyHtml = matchFirst(html, /<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!bodyHtml) {
    throw new Error(`Could not extract body HTML from ${fileName}`);
  }

  const content = await fetchPayloadContent();
  const seo = getPageSeo(content, pageId);

  return {
    title: seo.title || fallbackTitle,
    description: seo.description,
    bodyClassName,
    bodyHtml: renderLegacyContent(bodyHtml, pageId, content),
  };
}
