import type { GlobalConfig } from 'payload'

import { imageUpload, optionalText, requiredText, requiredTextarea, section, tab, tabs, versioning } from './fields/common'
import { triggerPagesDeployAfterPublish } from '../hooks/triggerPagesDeploy'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: { read: () => true },
  admin: { group: 'Website' },
  versions: versioning,
  hooks: { afterChange: [triggerPagesDeployAfterPublish] },
  fields: [tabs([
    tab('Header', [
      section('header', 'Header', [
        imageUpload('websiteLogo', 'Website logo'),
        imageUpload('mobileDrawerLogo', 'Mobile drawer logo'),
        requiredText('aboutUsMenuLabel', 'About us menu label'),
        requiredText('loanMenuLabel', 'Loan menu label'),
        requiredText('howToApplyMenuLabel', 'How to apply menu label'),
        requiredText('contactUsMenuLabel', 'Contact us menu label'),
        requiredText('applyNowButtonLabel', 'Apply now button label'),
        requiredText('loginButtonLabel', 'Login button label'),
        requiredText('newsletterLabel', 'Newsletter label'),
      ]),
    ]),
    tab('Footer', [
      section('footer', 'Footer', [
        imageUpload('footerLogo', 'Footer logo'),
        requiredText('pagesColumnHeading', 'Pages column heading'),
        requiredText('homeLinkLabel', 'Home link label'),
        requiredText('aboutUsLinkLabel', 'About us link label'),
        requiredText('loanLinkLabel', 'Loan link label'),
        requiredText('helpColumnHeading', 'Help column heading'),
        requiredText('howToApplyLinkLabel', 'How to apply link label'),
        requiredText('contactUsLinkLabel', 'Contact us link label'),
        requiredText('copyrightText', 'Copyright text'),
      ]),
    ]),
    tab('Contact Details', [
      section('contactDetails', 'Contact details', [
        requiredText('supportEmail', 'Support email'),
        requiredText('displayPhoneNumber', 'Display phone number'),
        requiredText('telephoneLinkNumber', 'Telephone link number'),
        requiredText('whatsappNumber', 'WhatsApp number'),
        requiredTextarea('defaultWhatsappMessage', 'Default WhatsApp message'),
        requiredText('businessHours', 'Business hours'),
        requiredText('officeName', 'Office name'),
        requiredTextarea('officeAddress', 'Office address'),
        optionalText('wazeUrl', 'Waze URL'),
        optionalText('googleMapsUrl', 'Google Maps URL'),
      ]),
    ]),
    tab('Form Messages', [
      section('formMessages', 'Form messages', [
        requiredText('sendingMessage', 'Sending message'),
        requiredText('successfulSubmissionMessage', 'Successful submission message'),
        requiredTextarea('failedSubmissionMessage', 'Failed submission message'),
        requiredText('validationSummaryMessage', 'Validation summary message'),
      ]),
    ]),
  ])],
}
