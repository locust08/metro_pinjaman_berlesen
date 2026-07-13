import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applySiteContent,
  mergeSiteContent,
} from '../src/content/applySiteContent.js';
import { defaultSiteContent } from '../src/content/defaultSiteContent.js';

function createNode(attrs = {}) {
  return {
    textContent: '',
    innerHTML: '',
    attributes: { ...attrs },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    getAttribute(name) {
      return this.attributes[name] || '';
    },
  };
}

function createRoot(nodes) {
  return {
    querySelectorAll(selector) {
      const attr = selector.match(/\[([^\]]+)\]/)?.[1];
      if (!attr) return [];
      return nodes.filter((node) => Object.prototype.hasOwnProperty.call(node.attributes, attr));
    },
  };
}

test('mergeSiteContent keeps fallback values when remote content is unavailable', () => {
  const merged = mergeSiteContent(defaultSiteContent, null);

  assert.equal(merged.site.navbar.items[0].label, defaultSiteContent.site.navbar.items[0].label);
  assert.equal(merged.pages.home.hero.heading, defaultSiteContent.pages.home.hero.heading);
});

test('mergeSiteContent overlays remote values without dropping sibling fallback values', () => {
  const merged = mergeSiteContent(defaultSiteContent, {
    pages: {
      home: {
        hero: {
          heading: 'Fast loans for real life',
        },
      },
    },
  });

  assert.equal(merged.pages.home.hero.heading, 'Fast loans for real life');
  assert.equal(merged.pages.home.hero.body, defaultSiteContent.pages.home.hero.body);
});

test('applySiteContent replaces text, html, links, and image slots by stable CMS keys', () => {
  const textNode = createNode({ 'data-cms-text': 'pages.home.hero.heading' });
  const htmlNode = createNode({ 'data-cms-html': 'pages.home.hero.body' });
  const linkNode = createNode({
    'data-cms-link': 'site.navbar.cta.href',
    'data-cms-text': 'site.navbar.cta.label',
  });
  const imageNode = createNode({ 'data-cms-image': 'pages.home.hero.image' });
  const root = createRoot([textNode, htmlNode, linkNode, imageNode]);
  const content = mergeSiteContent(defaultSiteContent, {
    site: { navbar: { cta: { label: 'Start application', href: 'contact.html' } } },
    pages: {
      home: {
        hero: {
          heading: 'Fast loans for real life',
          body: 'Updated CMS body',
          image: { src: 'https://cdn.example.com/home.jpg', alt: 'Customer at desk' },
        },
      },
    },
  });

  applySiteContent(root, content, 'home');

  assert.equal(textNode.textContent, 'Fast loans for real life');
  assert.equal(htmlNode.innerHTML, 'Updated CMS body');
  assert.equal(linkNode.textContent, 'Start application');
  assert.equal(linkNode.attributes.href, 'contact.html');
  assert.equal(imageNode.attributes.src, 'https://cdn.example.com/home.jpg');
  assert.equal(imageNode.attributes.alt, 'Customer at desk');
});
