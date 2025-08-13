async function loadFragment(mountId, url) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  try {
    // Prefix fragment URL with the same base the page is using
    const base = window.SITE_BASE || "./";
    const res = await fetch(base + url, { cache: "no-cache" });
    const html = await res.text();
    mount.innerHTML = html;

    // After injecting header, set the active nav link
    if (mountId === "site-header") {
      const links = mount.querySelectorAll(".nav__links a");
      const path = window.location.pathname;
      const isHome =
        /(?:^|\/)index\.html?$/.test(path) ||
        /\/$/.test(path) ||                 // handles /logan-portfolio/
        (window.location.hash && path.endsWith("/")); // anchor-only on home

      links.forEach(a => {
        const href = a.getAttribute("href") || "";
        const toHome = href === "index.html" || href.startsWith("index.html#");
        const toWork = href === "portfolio.html";
        if ((isHome && toHome) || (!isHome && path.endsWith("portfolio.html") && toWork)) {
          a.setAttribute("aria-current", "page");
        }
      });
    }
  } catch (e) {
    console.warn("Failed to load fragment:", url, e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Note: now we pass only the relative fragment path; includes.js will prefix with SITE_BASE
  loadFragment("site-header", "partials/header.html");
  loadFragment("site-footer", "partials/footer.html");
});
