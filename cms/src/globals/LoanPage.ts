import type { GlobalConfig } from 'payload'

import { fixedRowArray, imageUpload, requiredText, requiredTextarea, section, seoFields, tab, tabs, titleDescriptionFields, versioning } from './fields/common'
import { triggerPagesDeployAfterPublish } from '../hooks/triggerPagesDeploy'

const loanFeatureFields = [imageUpload('image', 'Image'), ...titleDescriptionFields()]
const requirementFields = [requiredTextarea('text', 'Requirement')]

const loanSection = (name: 'personalLoan' | 'businessLoan', label: string, requirementRows: number) =>
  section(name, label, [
    requiredText('heading', 'Heading'),
    requiredTextarea('description', 'Description'),
    requiredText('applyButtonLabel', 'Apply button label'),
    requiredText('whatsappButtonLabel', 'WhatsApp button label'),
    fixedRowArray('features', 'Features', 2, loanFeatureFields),
    section('requirements', 'Required documents', [
      imageUpload('image', 'Image'),
      requiredText('heading', 'Heading'),
      fixedRowArray('items', 'Requirements', requirementRows, requirementFields),
    ]),
  ])

export const LoanPage: GlobalConfig = {
  slug: 'loan-page', label: 'Loan Page', access: { read: () => true }, admin: { group: 'Pages' }, versions: versioning,
  hooks: { afterChange: [triggerPagesDeployAfterPublish] },
  fields: [tabs([
    tab('SEO', [section('seo', 'SEO', seoFields())]),
    tab('Hero', [section('hero', 'Hero', [requiredText('mainHeading', 'Main heading'), requiredTextarea('description', 'Description'), requiredText('primaryButtonLabel', 'Primary button label'), requiredText('secondaryButtonLabel', 'Secondary button label'), imageUpload('image', 'Image')])]),
    tab('Personal Loan', [loanSection('personalLoan', 'Personal loan', 3)]),
    tab('Business Loan', [loanSection('businessLoan', 'Business loan', 5)]),
    tab('Loan Comparison', [section('comparison', 'Loan comparison', [
      requiredText('heading', 'Heading'), requiredTextarea('description', 'Description'), requiredText('tableHeading', 'Table heading'),
      section('personalColumn', 'Personal loan column', [requiredText('title', 'Title'), requiredText('subtitle', 'Subtitle')]),
      section('businessColumn', 'Business loan column', [requiredText('title', 'Title'), requiredText('subtitle', 'Subtitle')]),
      fixedRowArray('rows', 'Comparison rows', 7, [requiredText('label', 'Label'), requiredTextarea('personalValue', 'Personal loan value'), requiredTextarea('businessValue', 'Business loan value')]),
      requiredText('loanDetailsHeading', 'Loan details heading'), requiredText('applicationNeedsHeading', 'Application needs heading'),
    ])]),
    tab('Interest Rates & Repayment', [section('interestRates', 'Interest rates and repayment', [requiredText('heading', 'Heading'), requiredTextarea('description', 'Description'), fixedRowArray('features', 'Features', 3, titleDescriptionFields())]), section('estimator', 'Repayment estimator', [requiredText('heading', 'Heading'), requiredTextarea('disclaimer', 'Disclaimer')])]),
  ])],
}
