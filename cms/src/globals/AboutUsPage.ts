import type { GlobalConfig } from 'payload'

import { fixedRowArray, imageUpload, requiredText, requiredTextarea, section, seoFields, tab, tabs, titleDescriptionFields, versioning } from './fields/common'
import { triggerPagesDeployAfterPublish } from '../hooks/triggerPagesDeploy'

export const AboutUsPage: GlobalConfig = {
  slug: 'about-us-page', label: 'About Us Page', access: { read: () => true }, admin: { group: 'Pages' }, versions: versioning,
  hooks: { afterChange: [triggerPagesDeployAfterPublish] },
  fields: [tabs([
    tab('SEO', [section('seo', 'SEO', seoFields())]),
    tab('Hero', [section('hero', 'Hero', [imageUpload('backgroundImage', 'Background image'), requiredText('mainHeading', 'Main heading'), requiredTextarea('description', 'Description')])]),
    tab('Who We Are', [section('whoWeAre', 'Who we are', [imageUpload('image', 'Image'), requiredText('heading', 'Heading'), fixedRowArray('paragraphs', 'Paragraphs', 2, [requiredTextarea('text', 'Text')]), fixedRowArray('statistics', 'Statistics', 3, [requiredText('value', 'Value'), requiredText('label', 'Label')])])]),
    tab('Why Choose Us', [section('whyChooseUs', 'Why choose us', [requiredText('heading', 'Heading'), requiredTextarea('description', 'Description'), fixedRowArray('features', 'Features', 6, titleDescriptionFields())])]),
    tab('Trust & Security', [section('trustAndSecurity', 'Trust and security', [requiredText('heading', 'Heading'), requiredTextarea('description', 'Description'), fixedRowArray('items', 'Items', 3, titleDescriptionFields()), imageUpload('image', 'Image')])]),
    tab('Who We Help', [section('whoWeHelp', 'Who we help', [requiredText('heading', 'Heading'), requiredTextarea('description', 'Description'), fixedRowArray('cards', 'Cards', 4, [imageUpload('image', 'Image'), ...titleDescriptionFields()])])]),
    tab('Ready To Get Started', [section('readyToGetStarted', 'Ready to get started', [requiredText('heading', 'Heading'), requiredTextarea('description', 'Description'), requiredText('applyButtonLabel', 'Apply button label'), requiredText('advisorButtonLabel', 'Advisor button label')])]),
  ])],
}
