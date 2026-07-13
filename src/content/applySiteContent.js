export function getByPath(source, path) {
  return path.split('.').reduce((value, key) => {
    if (value && typeof value === 'object' && key in value) {
      return value[key];
    }
    return undefined;
  }, source);
}

export function deepMerge(fallback, remote) {
  if (fallback === undefined) return remote;
  if (!remote || typeof remote !== 'object') return fallback;

  if (Array.isArray(fallback)) {
    if (!Array.isArray(remote)) return fallback;
    const length = Math.max(fallback.length, remote.length);
    return Array.from({ length }, (_, index) => deepMerge(fallback[index], remote[index]));
  }

  if (Array.isArray(remote)) return remote;

  const result = { ...fallback };

  for (const [key, value] of Object.entries(remote)) {
    const base = result[key];
    result[key] =
      base && typeof base === 'object' && value && typeof value === 'object'
        ? deepMerge(base, value)
        : value;
  }

  return result;
}

export function mergeSiteContent(fallback, remote) {
  return deepMerge(fallback, remote);
}

function isVisibleTextNode(node) {
  if (!node?.nodeValue?.trim()) return false;
  const tagName = node.parentElement?.tagName;
  return !['SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT'].includes(tagName);
}

function textNodesInOrder(root) {
  if (typeof root.createTreeWalker !== 'function') return [];
  const showText = globalThis.NodeFilter?.SHOW_TEXT || 4;
  const walker = root.createTreeWalker(root.body || root, showText);
  const nodes = [];
  let node = walker.nextNode();

  while (node) {
    if (isVisibleTextNode(node)) nodes.push(node);
    node = walker.nextNode();
  }

  return nodes;
}

function applyTextSlots(root, content, pageId) {
  const slots = getByPath(content, `pages.${pageId}.textSlots`);
  if (!Array.isArray(slots)) return;

  textNodesInOrder(root).forEach((node, index) => {
    const slot = slots[index];
    if (slot && typeof slot.text === 'string') {
      node.nodeValue = slot.text;
    }
  });
}

function applyImageSlots(root, content, pageId) {
  const slots = getByPath(content, `pages.${pageId}.imageSlots`);
  if (!Array.isArray(slots)) return;

  root.querySelectorAll('img').forEach((element, index) => {
    const slot = slots[index];
    const image = slot?.image;
    if (!image || typeof image !== 'object') return;
    if (typeof image.src === 'string') {
      element.setAttribute('src', image.src);
    }
    if (typeof image.alt === 'string') {
      element.setAttribute('alt', image.alt);
    }
  });
}

function applyText(root, content) {
  root.querySelectorAll('[data-cms-text]').forEach((element) => {
    const value = getByPath(content, element.getAttribute('data-cms-text'));
    if (typeof value === 'string') {
      element.textContent = value;
    }
  });
}

function applyHtml(root, content) {
  root.querySelectorAll('[data-cms-html]').forEach((element) => {
    const value = getByPath(content, element.getAttribute('data-cms-html'));
    if (typeof value === 'string') {
      element.innerHTML = value;
    }
  });
}

function applyLinks(root, content) {
  root.querySelectorAll('[data-cms-link]').forEach((element) => {
    const value = getByPath(content, element.getAttribute('data-cms-link'));
    if (typeof value === 'string') {
      element.setAttribute('href', value);
    }
  });
}

function applyImages(root, content) {
  root.querySelectorAll('[data-cms-image]').forEach((element) => {
    const value = getByPath(content, element.getAttribute('data-cms-image'));
    if (!value || typeof value !== 'object') return;
    if (typeof value.src === 'string') {
      element.setAttribute('src', value.src);
    }
    if (typeof value.alt === 'string') {
      element.setAttribute('alt', value.alt);
    }
  });
}

export function applySiteContent(root, content, pageId = '') {
  if (pageId) {
    applyTextSlots(root, content, pageId);
    applyImageSlots(root, content, pageId);
  }

  applyText(root, content);
  applyHtml(root, content);
  applyLinks(root, content);
  applyImages(root, content);
}
