// /assets/js/include.js — error-free injection + header menu wiring (no inline script exec)

async function inject(selector, url) {
  const mount = document.querySelector(selector);
  if (!mount) return null;

  try {
    const ver = window.INCLUDE_VERSION || "1";
    const res = await fetch(`${url}?v=${ver}`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = (await res.text()) || "";
    if (!html.trim()) throw new Error("Empty include");

    // Parse safely
    const tpl = document.createElement("template");
    tpl.innerHTML = html;

    // Strip <script> tags to avoid parse/runtime errors
    tpl.content.querySelectorAll("script").forEach((s) => s.remove());

    // Replace placeholder with included content
    mount.replaceWith(...tpl.content.childNodes);
    return document;
  } catch (e) {
    // Quiet breadcrumb instead of throwing
    mount.replaceWith(document.createComment(`include failed: ${url} — ${e.message}`));
    return null;
  }
}

function wireHeaderMenu() {
  const header = document.getElementById("uvSiteHeader");
  if (!header) return;

  // ⬅️ prevents double-binding (open→close blink)
  if (header.dataset.menuWired === "1") return;
  header.dataset.menuWired = "1";

  const btn = header.querySelector("#uvNavToggle");
  const overlay = header.querySelector("#uvOverlay");
  const panel = header.querySelector("#uvMobilePanel");
  if (!btn || !overlay || !panel) return;

  const setPanelTop = () => {
    const h = header.offsetHeight || 128;
    panel.style.top = h + "px";
    panel.style.maxHeight = `calc(100dvh - ${h}px)`;
  };
  setPanelTop();
  window.addEventListener("resize", setPanelTop, { passive: true });

  // ensure we clear any inline display:none / .hidden
  const show = (el) => {
    el.hidden = false;
    el.style.display = "";
    el.classList.remove("hidden");
  };
  const hide = (el) => {
    el.hidden = true;
    el.style.display = "none";
    el.classList.add("hidden");
  };

  let suppressCloseUntil = 0;

  const open = () => {
    setPanelTop();
    header.classList.add("uv-open");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Close menu");
    show(overlay);
    show(panel);
    suppressCloseUntil = Date.now() + 250; // ignore the release of the opening click
    const first = panel.querySelector("a, button");
    first && first.focus({ preventScroll: true });
  };

  const close = () => {
    header.classList.remove("uv-open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
    setTimeout(() => {
      hide(overlay);
      hide(panel);
    }, 200);
    btn.focus({ preventScroll: true });
  };

  // ⬅️ stop default + bubbling so the same click can’t immediately close it
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    header.classList.contains("uv-open") ? close() : open();
  });

  overlay.addEventListener("click", (e) => {
    if (Date.now() < suppressCloseUntil) return;
    e.preventDefault();
    e.stopPropagation();
    close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("uv-open")) close();
  });
}

function highlightActiveNav() {
  const root = document.getElementById("uvSiteHeader");
  if (!root) return;
  const path = location.pathname.replace(/index\.html$/, "");
  root.querySelectorAll("[data-nav] a, nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").replace(/index\.html$/, "");
    if (href === path || (href === "/" && path === "/")) {
      a.setAttribute("aria-current", "page");
      a.classList.add("font-semibold", "underline", "underline-offset-4", "menu-item-active");
    }
  });
}

function setYear() {
  const span = document.querySelector("#year");
  if (span) span.textContent = new Date().getFullYear();
}

// Boot: inject, then wire
(async () => {
  await inject("#site-header", "/header.html");
  wireHeaderMenu(); // <- attach burger behavior after header is in the DOM
  highlightActiveNav();

  await inject("#site-footer", "/footer.html");
  setYear();

  document.documentElement.classList.add("uv-hydrated");
})();

// General Fade in Animation script.
  const callback = function (entries) {
      entries.forEach((entry) => {
      if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
      }
      else {
          entry.target.classList.remove("animate-fadeIn");
      }
      });
  };
  const observer = new IntersectionObserver(callback);
  const targets = document.querySelectorAll(".fade-in");
  targets.forEach(function (target) {
      target.classList.add("opacity-0");
      observer.observe(target); 
  });
