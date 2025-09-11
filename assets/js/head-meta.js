(function () {
  var DEF = {
    title: "Axxent Partners",
    description: "Axxent Loyalty—Universal Value for enterprise rewards.",
    image: "/assets/img/og-image.svg",
    url: location.origin + location.pathname,
    twitterCard: "summary_large_image",
    themeColor: "#0d47a1",
    version: "3",
  };
  var META = Object.assign({}, DEF, window.PAGE_META || {});
  var head = document.head;

  function sel(s) {
    return head.querySelector(s);
  }
  function once(selector, tag, attrs) {
    var el = sel(selector);
    if (!el) {
      el = document.createElement(tag);
      head.appendChild(el);
    }
    for (var k in attrs) {
      if (attrs[k] !== null && attrs[k] !== undefined) el.setAttribute(k, attrs[k]);
    }
    return el;
  }
  function upsertMeta(by, key, content) {
    var q = by === "name" ? 'meta[name="' + key + '"]' : 'meta[property="' + key + '"]';
    var el = sel(q);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(by, key);
      head.appendChild(el);
    }
    el.setAttribute("content", content);
  }
  // Anti-FOUC: hide until /assets/css/tailwind.css is ready, then reveal.
  (function () {
    var html = document.documentElement;
    html.classList.add('tw-wait');

    function reveal() { html.classList.remove('tw-wait'); }

    // Reveal when the Tailwind link reports loaded
    var link = document.getElementById('twcss');
    if (link && link.addEventListener) link.addEventListener('load', reveal);

    // Extra safety: reveal at window load and after a short timeout (cached CSS may skip 'load')
    window.addEventListener('load', reveal);
    setTimeout(reveal, 2000);
  })();

  document.title = META.title;
  once("meta[charset]", "meta", { charset: "utf-8" });
  once('meta[name="viewport"]', "meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1",
  });

  upsertMeta("name", "description", META.description);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:title", META.title);
  upsertMeta("property", "og:description", META.description);
  upsertMeta("property", "og:image", META.image);
  upsertMeta("property", "og:url", META.url);

  upsertMeta("name", "twitter:card", META.twitterCard);
  upsertMeta("name", "twitter:title", META.title);
  upsertMeta("name", "twitter:description", META.description);
  upsertMeta("name", "twitter:image", META.image);

  upsertMeta("name", "theme-color", META.themeColor);

  (function () {
    var V = encodeURIComponent(META.version || "1");
    var COLOR = META.themeColor;
    var ICON_SET = [
      { rel: "shortcut icon", type: "image/x-icon", href: "/assets/img/favicon.ico?v=" + V },
      { rel: "icon", type: "image/x-icon", href: "/assets/img/favicon.ico?v=" + V },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/assets/img/favicon-32x32.png?v=" + V,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/assets/img/favicon-16x16.png?v=" + V,
      },
      { rel: "icon", type: "image/svg+xml", href: "/assets/img/favicon.svg?v=" + V },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/assets/img/apple-touch-icon.png?v=" + V,
      },
      { rel: "mask-icon", href: "/assets/img/mask-icon.svg", color: COLOR },
      { rel: "manifest", href: "/assets/img/site.webmanifest" },
    ];
    Array.prototype.forEach.call(
      document.querySelectorAll(
        'link[rel="icon"],link[rel="shortcut icon"],link[rel="apple-touch-icon"],link[rel="mask-icon"],link[rel="manifest"]'
      ),
      function (n) {
        n.parentNode && n.parentNode.removeChild(n);
      }
    );
    ICON_SET.forEach(function (cfg) {
      var el = document.createElement("link");
      for (var k in cfg) {
        if (cfg[k] !== null && cfg[k] !== undefined) el.setAttribute(k, cfg[k]);
      }
      head.appendChild(el);
    });
  })();

  once('link[rel="preconnect"][href="https://fonts.googleapis.com"]', "link", {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  });
  once('link[rel="preconnect"][href="https://fonts.gstatic.com"]', "link", {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossorigin: "",
  });
  once('link[rel="stylesheet"][href*="fonts.googleapis.com/css2?family=Inter"]', "link", {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
  });


  once('link[rel="stylesheet"][href="/assets/css/brand.css"]', "link", {
    rel: "stylesheet",
    href: "/assets/css/brand.css",
  });
  once('link[rel="stylesheet"][href="/assets/css/glow.css"]', "link", {
    rel: "stylesheet",
    href: "/assets/css/glow.css",
  });
})();
