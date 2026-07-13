import { describe, expect, it } from 'vitest'

import { Media } from '../src/collections/Media'
import { AboutUsPage } from '../src/globals/AboutUsPage'
import { ContactUsPage } from '../src/globals/ContactUsPage'
import { HomePage } from '../src/globals/HomePage'
import { HowToApplyPage } from '../src/globals/HowToApplyPage'
import { LoanPage } from '../src/globals/LoanPage'
import { SiteSettings } from '../src/globals/SiteSettings'

const globals = [SiteSettings, HomePage, AboutUsPage, LoanPage, HowToApplyPage, ContactUsPage]

function stringify(value: unknown) {
  return JSON.stringify(value)
}

describe('Payload section schema', () => {
  it('defines the six required globals', () => {
    expect(globals.map((global) => global.slug)).toEqual([
      'site-settings',
      'home-page',
      'about-us-page',
      'loan-page',
      'how-to-apply-page',
      'contact-us-page',
    ])
  })

  it('does not expose generic slot fields', () => {
    const schema = stringify(globals)
    expect(schema).not.toContain(['Text', 'Slot'].join(' '))
    expect(schema).not.toContain(['text', 'Slots'].join(''))
    expect(schema).not.toContain(['image', 'Slots'].join(''))
    expect(schema).not.toContain(['DOM', 'Index'].join(' '))
  })

  it('requires media alt text', () => {
    const alt = Media.fields.find((field) => 'name' in field && field.name === 'alt')
    expect(alt).toMatchObject({ required: true })
  })

  it('uses fixed rows for home steps and statistics', () => {
    const schema = stringify(HomePage)
    expect(schema).toContain('"minRows":4')
    expect(schema).toContain('"maxRows":4')
    expect(schema).toContain('"minRows":3')
    expect(schema).toContain('"maxRows":3')
  })

  it('enables drafts and versions for every global', () => {
    globals.forEach((global) => {
      expect(global.versions).toMatchObject({ drafts: true, max: 20 })
    })
  })
})
