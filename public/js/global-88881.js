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
  window.__metroTrackedForms = window.__metroTrackedForms || new WeakMap();

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

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "metro-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function storageGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      return "";
    }
  }

  function storageSet(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {
      // Storage can be blocked by privacy settings; tracking still works without persistence.
    }
  }

  function persistentId(storage, key) {
    var value = storageGet(storage, key);
    if (value) return value;
    value = uuid();
    storageSet(storage, key, value);
    return value;
  }

  function queryValue(names) {
    var params = new URLSearchParams(window.location.search);
    for (var i = 0; i < names.length; i += 1) {
      var value = params.get(names[i]);
      if (value) return value;
    }
    return "";
  }

  function deviceType() {
    var width = window.innerWidth || document.documentElement.clientWidth || 0;
    var ua = navigator.userAgent || "";
    if (/ipad|tablet/i.test(ua) || (width >= 768 && width <= 1024 && /mobile/i.test(ua))) return "tablet";
    if (/mobile|android|iphone|ipod/i.test(ua) || width < 768) return "mobile";
    return "desktop";
  }

  function platformFromAttribution(payload) {
    var source = String(payload.utm_source || "").toLowerCase();
    var referrer = String(payload.referrer || "").toLowerCase();
    var clickId = String(payload.platform_click_id || "").toLowerCase();
    if (clickId.indexOf("fbclid=") === 0 || source.indexOf("facebook") >= 0 || referrer.indexOf("facebook") >= 0) return "Facebook";
    if (clickId.indexOf("ttclid=") === 0 || source.indexOf("tiktok") >= 0 || referrer.indexOf("tiktok") >= 0) return "TikTok";
    if (clickId.indexOf("gclid=") === 0 || clickId.indexOf("gbraid=") === 0 || clickId.indexOf("wbraid=") === 0 || source.indexOf("google") >= 0 || referrer.indexOf("google") >= 0) return "Google";
    if (clickId.indexOf("msclkid=") === 0 || source.indexOf("bing") >= 0 || referrer.indexOf("bing") >= 0) return "Bing";
    if (source.indexOf("whatsapp") >= 0 || referrer.indexOf("whatsapp") >= 0) return "WhatsApp";
    if (!source && !referrer) return "Direct";
    return payload.platform || "";
  }

  function attributionPayload() {
    var platformClickId =
      queryValue(["gclid"]) ? "gclid=" + queryValue(["gclid"]) :
      queryValue(["fbclid"]) ? "fbclid=" + queryValue(["fbclid"]) :
      queryValue(["ttclid"]) ? "ttclid=" + queryValue(["ttclid"]) :
      queryValue(["msclkid"]) ? "msclkid=" + queryValue(["msclkid"]) :
      queryValue(["wbraid"]) ? "wbraid=" + queryValue(["wbraid"]) :
      queryValue(["gbraid"]) ? "gbraid=" + queryValue(["gbraid"]) :
      "";
    var payload = {
      visitor_id: persistentId(window.localStorage, "metro_visitor_id"),
      session_id: persistentId(window.sessionStorage, "metro_session_id"),
      event_time: new Date().toISOString(),
      referrer: document.referrer || "",
      utm_source: queryValue(["utm_source"]),
      utm_medium: queryValue(["utm_medium"]),
      utm_campaign: queryValue(["utm_campaign"]),
      utm_content: queryValue(["utm_content"]),
      utm_term: queryValue(["utm_term"]),
      platform_click_id: platformClickId,
      device_type: deviceType(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      user_agent: navigator.userAgent || ""
    };
    payload.platform = platformFromAttribution(payload);
    return payload;
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
    var payload = Object.assign({ event: eventName }, currentPagePayload(), attributionPayload(), eventParams || {});
    var eventKey = normalizedEventKey(payload);
    var now = Date.now();

    if (window.__metroRecentEvents[eventKey] && now - window.__metroRecentEvents[eventKey] < 5000) {
      return;
    }
    window.__metroRecentEvents[eventKey] = now;

    sendVisitorEvent(payload);

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

  function sendVisitorEvent(payload) {
    if (["localhost", "127.0.0.1"].indexOf(window.location.hostname) >= 0) return;

    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      var blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/events", blob)) return;
    }

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      keepalive: true
    }).catch(function() {});
  }

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

  function ctaType(target, url) {
    var text = cleanText(target.textContent || target.getAttribute("aria-label") || "");
    if (/apply|application/i.test(text)) return "application";
    if (/rate|loan|learn|view all/i.test(text)) return "loan_interest";
    if (/contact|get in touch|submit|book/i.test(text)) return "contact";
    if (url && url !== "#") return "link";
    return "";
  }

  function initPageViewTracking() {
    window.metroTrack("page_view");
  }

  function initConditionalClickTracking() {
    document.addEventListener("click", function(event) {
      var target = event.target.closest("a[href], button, [role='link'], [role='button']");
      if (!target) return;

      var url = elementUrl(target);
      var eventName = eventNameForUrl(url);
      if (recentlyTrackedElement(target, 5000)) return;
      var text = cleanText(target.textContent || target.getAttribute("aria-label") || "");

      if (eventName) {
        window.metroTrack(eventName, {
          link_url: url,
          link_text: text
        });
        return;
      }

      var type = ctaType(target, url);
      if (!type) return;

      window.metroTrack("cta_click", {
        cta_text: text,
        cta_url: url,
        cta_type: type,
        link_url: url,
        link_text: text
      });
    });
  }

  function formName(form) {
    if (form.querySelector("[value='Personal Loan'], [name='loan-type']")) return "Loan application form";
    if (form.querySelector("input[type='date'], select")) return "Contact appointment booking";
    return cleanText(form.getAttribute("aria-label") || form.id || "Website form");
  }

  function formId(form) {
    if (form.querySelector("input[type='date'], select")) return "contact_booking";
    if (form.querySelector("[name='loan-type']")) return "how_to_apply_form";
    return form.id || "website_form";
  }

  function initFormTracking() {
    document.addEventListener("focusin", function(event) {
      var form = event.target.closest && event.target.closest("form");
      if (!form || window.__metroTrackedForms.get(form)) return;
      window.__metroTrackedForms.set(form, true);
      window.metroTrack("form_start", {
        form_id: formId(form),
        form_name: formName(form)
      });
    });

    document.addEventListener("change", function(event) {
      var target = event.target;
      if (!target || !target.matches || !target.matches("select")) return;
      var selected = target.options && target.selectedIndex >= 0 ? target.options[target.selectedIndex].text : target.value;
      if (!/loan/i.test(target.name || target.closest("div")?.previousElementSibling?.textContent || "") && !/Personal Loan|Business Loan|Home Loan|Auto Loan/i.test(selected || "")) return;
      window.metroTrack("loan_type_select", {
        form_id: formId(target.closest("form") || document.createElement("form")),
        loan_type: selected
      });
    });
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }

    return new Promise(function(resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-1000px";
      textarea.style.left = "-1000px";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  function initCopyButtons() {
    document.addEventListener("click", function(event) {
      var button = event.target.closest("[data-copy-value]");
      if (!button) return;

      var value = button.getAttribute("data-copy-value") || "";
      if (!value) return;

      var originalText = button.getAttribute("data-copy-original") || button.textContent || "⧉";
      window.clearTimeout(button.__metroCopyTimer);
      button.setAttribute("data-copy-original", originalText);
      button.textContent = "✓";
      button.setAttribute("aria-label", "Copied");
      button.setAttribute("title", "Copied");

      copyText(value).catch(function() {});

      button.__metroCopyTimer = window.setTimeout(function() {
        button.textContent = originalText;
        button.setAttribute("aria-label", "Copy phone number");
        button.setAttribute("title", "Copy phone number");
      }, 1800);
    });
  }

  loadGtm();
  loadGa4Fallback();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      initPageViewTracking();
      initConditionalClickTracking();
      initFormTracking();
      initCopyButtons();
    });
  } else {
    initPageViewTracking();
    initConditionalClickTracking();
    initFormTracking();
    initCopyButtons();
  }
})();
