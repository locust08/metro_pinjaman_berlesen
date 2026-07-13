import type { Field, GlobalConfig } from 'payload'

import { defaultSiteContent } from '../siteContent/defaultSiteContent'

type PageId = keyof typeof defaultSiteContent.pages

function textSlotsField(pageId: PageId): Field {
  return {
    name: 'textSlots',
    type: 'array',
    label: 'Editable Text',
    defaultValue: defaultSiteContent.pages[pageId].textSlots,
    admin: {
      description: 'Text slots follow the public page order. Edit the text value only.',
    },
    fields: [
      {
        name: 'key',
        type: 'text',
        required: true,
        admin: {
          readOnly: true,
        },
      },
      {
        name: 'label',
        type: 'text',
        required: true,
        admin: {
          readOnly: true,
        },
      },
      {
        name: 'text',
        type: 'textarea',
        required: true,
      },
    ],
  }
}

function imageSlotsField(pageId: PageId): Field {
  return {
    name: 'imageSlots',
    type: 'array',
    label: 'Editable Images',
    defaultValue: defaultSiteContent.pages[pageId].imageSlots.map((slot) => ({
      key: slot.key,
      label: slot.label,
      fallbackSrc: slot.image.src,
      fallbackAlt: slot.image.alt,
    })),
    admin: {
      description: 'Image slots follow the public page image order.',
    },
    fields: [
      {
        name: 'key',
        type: 'text',
        required: true,
        admin: {
          readOnly: true,
        },
      },
      {
        name: 'label',
        type: 'text',
        required: true,
        admin: {
          readOnly: true,
        },
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'fallbackSrc',
        type: 'text',
        admin: {
          readOnly: true,
        },
      },
      {
        name: 'fallbackAlt',
        type: 'text',
        admin: {
          readOnly: true,
        },
      },
    ],
  }
}

function pageGroup(name: PageId, label: string): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [textSlotsField(name), imageSlotsField(name)],
  }
}

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  label: 'Site Content',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Website',
  },
  fields: [
    {
      name: 'pages',
      type: 'group',
      fields: [
        pageGroup('home', 'Home'),
        pageGroup('about', 'About Us'),
        pageGroup('loan', 'Loan'),
        pageGroup('howToApply', 'How To Apply'),
        pageGroup('contact', 'Contact Us'),
      ],
    },
  ],
}
