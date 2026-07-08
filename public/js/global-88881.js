(function() {
  if (window.__metroAnalyticsInitialized) {
    return;
  }
  window.__metroAnalyticsInitialized = true;

  var config = window.metroAnalyticsConfig || {
    gtmId: "GTM-PFSGCN88",
    ga4MeasurementId: "G-2R37LT2QLR"
  };
  var gtmId = config.gtmId || config.gtmContainerId || "";
  var ga4MeasurementId = config.ga4MeasurementId || "";
  var hasGtm = /^GTM-[A-Z0-9]+$/i.test(gtmId);
  var hasGa4 = /^G-[A-Z0-9]+$/i.test(ga4MeasurementId);

  window.dataLayer = window.dataLayer || [];
  window.__metroRecentEvents = window.__metroRecentEvents || {};
  window.__metroRecentElements = window.__metroRecentElements || new WeakMap();

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function appendScript(src) {
    if (!src || document.querySelector('script[src="' + src + '"]')) return;
    var script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function loadGtm() {
    if (!hasGtm) return;
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js"
    });
    appendScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId));
  }

  function loadGa4Fallback() {
    if (hasGtm || !hasGa4) return;
    window.gtag = window.gtag || gtag;
    appendScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4MeasurementId));
    window.gtag("js", new Date());
    window.gtag("config", ga4MeasurementId);
  }

  function cleanText(text) {
    return (text || "").trim().replace(/\s+/g, " ");
  }

  function currentPagePayload() {
    return {
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title
    };
  }

  function recentlyTrackedElement(element, lockMs) {
    if (!element) return false;
    var now = Date.now();
    var trackedAt = window.__metroRecentElements.get(element) || 0;
    if (now - trackedAt < lockMs) return true;
    window.__metroRecentElements.set(element, now);
    return false;
  }

  function normalizedEventKey(payload) {
    return [
      payload.event || "",
      payload.link_url || "",
      payload.form_id || "",
      payload.page_path || ""
    ].join("|").toLowerCase();
  }

  window.metroTrack = function(eventName, eventParams) {
    if (!eventName) return;
    var payload = Object.assign({ event: eventName }, currentPagePayload(), eventParams || {});
    var eventKey = normalizedEventKey(payload);
    var now = Date.now();

    if (window.__metroRecentEvents[eventKey] && now - window.__metroRecentEvents[eventKey] < 5000) {
      return;
    }
    window.__metroRecentEvents[eventKey] = now;

    if (hasGtm) {
      window.dataLayer.push(payload);
      return;
    }

    if (hasGa4 && typeof window.gtag === "function") {
      var ga4Payload = Object.assign({}, payload);
      delete ga4Payload.event;
      window.gtag("event", eventName, ga4Payload);
    }
  };

  function elementUrl(element) {
    if (!element) return "";
    if (element.matches("a[href]")) return element.getAttribute("href") || "";
    var attrs = Array.prototype.map.call(element.attributes || [], function(attr) {
      return attr.value;
    }).join(" ");
    var match = attrs.match(/(?:https?:\/\/|whatsapp:\/\/|waze:\/\/)[^\s'")]+/i);
    return match ? match[0] : "";
  }

  function eventNameForUrl(url) {
    if (/wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp:\/\//i.test(url)) return "whatsapp_click";
    if (/google\.com\/maps|maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(url)) return "google_maps_click";
    if (/waze\.com|ul\.waze\.com|waze:\/\//i.test(url)) return "waze_click";
    return "";
  }

  function initConditionalClickTracking() {
    document.addEventListener("click", function(event) {
      var target = event.target.closest("a[href], [role='link']");
      if (!target) return;

      var url = elementUrl(target);
      var eventName = eventNameForUrl(url);
      if (!eventName) return;
      if (recentlyTrackedElement(target, 5000)) return;

      window.metroTrack(eventName, {
        link_url: url,
        link_text: cleanText(target.textContent || target.getAttribute("aria-label") || "")
      });
    });
  }

  loadGtm();
  loadGa4Fallback();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConditionalClickTracking);
  } else {
    initConditionalClickTracking();
  }
})();
