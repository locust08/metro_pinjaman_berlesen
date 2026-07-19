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

function getRecordPath(root: unknown, keys: Array<number | string>): unknown {
  return keys.reduce<unknown>((current, key) => {
    if (typeof key === 'number') return Array.isArray(current) ? current[key] : undefined;
    return isRecord(current) ? current[key] : undefined;
  }, root);
}

function getImageSrc(content: PublicPayloadContent, keys: Array<number | string>): string {
  const image = getRecordPath(content, keys);
  if (!isRecord(image)) return '';

  return typeof image.src === 'string' ? image.src : '';
}

function replaceLeftoverLegacyAssetPaths(bodyHtml: string, content: PublicPayloadContent): string {
  const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  const imageReplacements: Record<string, string> = {
    'flow-assets/metro/home-hero-adviser.webp': getImageSrc(content, ['homePage', 'hero', 'images', 'leftTop']),
    'flow-assets/metro/home-personal-documents.webp': getImageSrc(content, ['homePage', 'hero', 'images', 'rightTop']),
    'flow-assets/metro/home-business-cafe.webp': getImageSrc(content, ['homePage', 'hero', 'images', 'bottomLeft']),
    'flow-assets/metro/required-documents-closeup.webp': getImageSrc(content, ['homePage', 'hero', 'images', 'bottomRight']),
    'flow-assets/metro/personal-loan-consultation.webp': getImageSrc(content, ['homePage', 'loanOptions', 'cards', 0, 'image']),
    'flow-assets/metro/business-financing-documents.webp': getImageSrc(content, ['homePage', 'loanOptions', 'cards', 1, 'image']),
    'flow-assets/metro/home-why-adviser-files.webp': getImageSrc(content, ['homePage', 'whyChooseUs', 'image']),
    'flow-assets/metro/customer-support-consultation.webp': getImageSrc(content, ['aboutUsPage', 'hero', 'image']),
    'flow-assets/metro/about-company-adviser.webp': getImageSrc(content, ['aboutUsPage', 'whoWeAre', 'image']),
    'flow-assets/metro/who-help-phone-support.webp': getImageSrc(content, ['aboutUsPage', 'whoWeHelp', 'cards', 0, 'image']),
    'flow-assets/metro/who-help-food-business.webp': getImageSrc(content, ['aboutUsPage', 'whoWeHelp', 'cards', 1, 'image']),
    'flow-assets/metro/who-help-document-prep.webp': getImageSrc(content, ['aboutUsPage', 'whoWeHelp', 'cards', 2, 'image']),
    'flow-assets/metro/loan-hero-adviser.webp': getImageSrc(content, ['loanPage', 'hero', 'image']),
    'flow-assets/metro/loan-personal-applicant.webp': getImageSrc(content, ['loanPage', 'personalLoan', 'features', 0, 'image']),
    'flow-assets/metro/loan-repayment-advice.webp': getImageSrc(content, ['loanPage', 'personalLoan', 'features', 1, 'image']),
    'flow-assets/metro/loan-business-retail.webp': getImageSrc(content, ['loanPage', 'businessLoan', 'features', 0, 'image']),
    'flow-assets/metro/loan-business-workshop.webp': getImageSrc(content, ['loanPage', 'businessLoan', 'features', 1, 'image']),
    'flow-assets/metro/how-apply-documents.webp': getImageSrc(content, ['howToApplyPage', 'requiredDocuments', 'image']),
    'flow-assets/metro/contact-phone-support.webp': getImageSrc(content, ['contactUsPage', 'contactForm', 'image']),
  };

  let rendered = bodyHtml;
  for (const [legacySrc, payloadSrc] of Object.entries(imageReplacements)) {
    if (payloadSrc) rendered = rendered.replaceAll(legacySrc, payloadSrc);
  }

  return rendered
    .replaceAll('flow-assets/footer/waves-lines-left-bottom.png', transparentPixel)
    .replaceAll('flow-assets/pricing/waves-right-top.png', transparentPixel);
}

export async function loadLegacyPage(fileName: string, pageId: SitePageId): Promise<LegacyPageContent> {
  const html = fs.readFileSync(path.join(legacyPageDir, fileName), 'utf8');
  const fallbackTitle = matchFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const fallbackDescription = matchFirst(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
  const bodyClassName = matchFirst(html, /<body[^>]*class=["']([^"']*)["'][^>]*>/i);
  const bodyHtml = matchFirst(html, /<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!bodyHtml) {
    throw new Error(`Could not extract body HTML from ${fileName}`);
  }

  const content = await fetchPayloadContent();
  const seo = getPageSeo(content, pageId);

  return {
    title: seo.title || fallbackTitle,
    description: seo.description || fallbackDescription,
    metaDescription: seo.description || fallbackDescription,
    bodyClassName,
    bodyHtml: replaceLeftoverLegacyAssetPaths(renderLegacyContent(bodyHtml, pageId, content), content),
  };
}
