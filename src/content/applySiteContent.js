export function getByPath(source, path) {
  return path.split('.').reduce((value, key) => {
    if (value && typeof value === 'object' && key in value) {
      return value[key];
    }
    return undefined;
  }, source);
}

export function deepMerge(fallback, remote) {
  if (!remote || typeof remote !== 'object' || Array.isArray(remote)) return fallback;

  const result = Array.isArray(fallback) ? [...fallback] : { ...fallback };

  for (const [key, value] of Object.entries(remote)) {
    const base = result[key];
    result[key] =
      base && typeof base === 'object' && !Array.isArray(base) && value && typeof value === 'object' && !Array.isArray(value)
        ? deepMerge(base, value)
        : value;
  }

  return result;
}

export function mergeSiteContent(fallback, remote) {
  return deepMerge(fallback, remote);
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

export function applySiteContent(root, content) {
  applyText(root, content);
  applyHtml(root, content);
  applyLinks(root, content);
  applyImages(root, content);
}
