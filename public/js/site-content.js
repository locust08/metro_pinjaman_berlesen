(function () {
  var pageId = window.__METRO_PAGE_ID__;
  if (!pageId) return;

  var endpoints = window.METRO_CMS_CONTENT_URL
    ? [window.METRO_CMS_CONTENT_URL]
    : [
        'https://admin.metropinjamanberlesen.com/api/site-content',
        'https://metropinjamanberlesen-payload-cms.easondev.workers.dev/api/site-content',
      ];

  function getByPath(source, path) {
    return path.split('.').reduce(function (value, key) {
      if (value && typeof value === 'object' && key in value) return value[key];
      return undefined;
    }, source);
  }

  function isVisibleTextNode(node) {
    if (!node || !node.nodeValue || !node.nodeValue.trim()) return false;
    var tagName = node.parentElement && node.parentElement.tagName;
    return ['SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT'].indexOf(tagName) === -1;
  }

  function textNodesInOrder(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var node = walker.nextNode();

    while (node) {
      if (isVisibleTextNode(node)) nodes.push(node);
      node = walker.nextNode();
    }

    return nodes;
  }

  function applyTextSlots(content) {
    var slots = getByPath(content, 'pages.' + pageId + '.textSlots');
    if (!Array.isArray(slots)) return;

    textNodesInOrder(document.body).forEach(function (node, index) {
      var slot = slots[index];
      if (slot && typeof slot.text === 'string') {
        node.nodeValue = slot.text;
      }
    });
  }

  function applyImageSlots(content) {
    var slots = getByPath(content, 'pages.' + pageId + '.imageSlots');
    if (!Array.isArray(slots)) return;

    document.querySelectorAll('img').forEach(function (element, index) {
      var slot = slots[index];
      var image = slot && slot.image;
      if (!image || typeof image !== 'object') return;
      if (typeof image.src === 'string') element.setAttribute('src', image.src);
      if (typeof image.alt === 'string') element.setAttribute('alt', image.alt);
    });
  }

  function applyKeyedFields(content) {
    document.querySelectorAll('[data-cms-text]').forEach(function (element) {
      var value = getByPath(content, element.getAttribute('data-cms-text'));
      if (typeof value === 'string') element.textContent = value;
    });

    document.querySelectorAll('[data-cms-link]').forEach(function (element) {
      var value = getByPath(content, element.getAttribute('data-cms-link'));
      if (typeof value === 'string') element.setAttribute('href', value);
    });

    document.querySelectorAll('[data-cms-image]').forEach(function (element) {
      var value = getByPath(content, element.getAttribute('data-cms-image'));
      if (!value || typeof value !== 'object') return;
      if (typeof value.src === 'string') element.setAttribute('src', value.src);
      if (typeof value.alt === 'string') element.setAttribute('alt', value.alt);
    });
  }

  function fetchContent(index) {
    var endpoint = endpoints[index];
    if (!endpoint) return Promise.reject(new Error('CMS content unavailable'));

    return fetch(endpoint, { headers: { accept: 'application/json' } }).then(function (response) {
      if (!response.ok) throw new Error('CMS content unavailable');
      return response.json();
    });
  }

  function fetchContentWithFallback(index) {
    if (index >= endpoints.length) return Promise.reject(new Error('CMS content unavailable'));

    return fetchContent(index).catch(function () {
      return fetchContentWithFallback(index + 1);
    });
  }

  fetchContentWithFallback(0)
    .then(function (content) {
      applyTextSlots(content);
      applyImageSlots(content);
      applyKeyedFields(content);
    })
    .catch(function () {
      // Keep bundled HTML visible if the CMS is unavailable.
    });
})();
