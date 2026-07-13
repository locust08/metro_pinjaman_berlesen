import { describe, expect, it } from 'vitest'

import { normalizeForFrontend } from '../src/endpoints/publishedContent'

describe('published content media normalization', () => {
  it('makes uploaded media URLs absolute to the configured CMS origin', () => {
    expect(normalizeForFrontend(
      { id: 4, url: '/api/media/file/example.png', alt: 'Example' },
      'https://cms.example.test',
    )).toEqual({
      src: 'https://cms.example.test/api/media/file/example.png',
      alt: 'Example',
    })
  })

  it('preserves already absolute media URLs', () => {
    expect(normalizeForFrontend(
      { url: 'https://images.example.test/example.png', alt: 'Example' },
      'https://cms.example.test',
    )).toEqual({
      src: 'https://images.example.test/example.png',
      alt: 'Example',
    })
  })
})
