/**
 * active-nav.js
 * - Keeps the neon underline (aria-current) in sync with page/section.
 * - Button behavior and portfolio filters.
 */

window.initActiveNav = function () {
  /* --------------------------
   * Helpers
   * -------------------------- */
  const $desktopNav = document.querySelector(".nav__links");
  const $mobileNav = document.querySelector(".mobile-nav");

  const normalizeHref = (href) => {
    if (!href) return "";
    // strip leading ./ or /, keep hash, remove trailing slash
    return href.replace(/^(\.\/|\/)/, "").replace(/\/$/, "");
  };

  const applyActiveToList = (nodeList, targetHref) => {
    nodeList.forEach((node) => {
      node.removeAttribute("aria-current");
      const href = node.getAttribute("href") || node.dataset.href || "";
      if (normalizeHref(href) === normalizeHref(targetHref)) {
        node.setAttribute("aria-current", "page");
      }
    });
  };

  const applyActive = (targetHref) => {
    if ($desktopNav)
      applyActiveToList(
        $desktopNav.querySelectorAll("a, summary[data-href]"),
        targetHref
      );
    if ($mobileNav)
      applyActiveToList(
        $mobileNav.querySelectorAll("a, summary[data-href]"),
        targetHref
      );
  };

  const pageName = () => (location.pathname.split("/").pop() || "index.html");

  /* --------------------------
   * Initial highlight
   * -------------------------- */
  const setInitialActive = () => {
    const page = pageName();
    const hash = location.hash;

    if (page === "" || page === "index.html") {
      if (hash === "#services") applyActive("index.html#services");
      else if (hash === "#about") applyActive("index.html#about");
      else if (hash === "#contact") applyActive("index.html#contact");
      else applyActive("index.html"); // Home
    } else if (page === "index.html") {
      applyActive("index.html"); // Work
    } else {
      applyActive(page);
    }
  };

  setInitialActive();

  /* --------------------------
   * Scroll spy (index.html only)
   * -------------------------- */
  (function scrollSpy() {
    const page = pageName();
    if (!(page === "" || page === "index.html")) return;

    const $services = document.getElementById("services");
    const $about = document.getElementById("about");
    const $contact = document.getElementById("contact");
    const $hero = document.querySelector(".hero");
    if (!$services && !$about && !$contact) return;

    let currentHref = "";

    const updateIfChanged = (href) => {
      if (href !== currentHref) {
        currentHref = href;
        applyActive(href);
      }
    };

    if ("IntersectionObserver" in window) {
      const sections = [];
      if ($services) sections.push({ el: $services, href: "index.html#services" });
      if ($about) sections.push({ el: $about, href: "index.html#about" });
      if ($contact) sections.push({ el: $contact, href: "index.html#contact" });

      // Section observer: activates when section is roughly in middle of viewport
      const sectionIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const rec = sections.find((s) => s.el === entry.target);
            if (!rec) return;

            if (entry.isIntersecting) {
              updateIfChanged(rec.href);
            } else {
              // If above first section, revert to Home
              const firstTop =
                sections[0]?.el?.getBoundingClientRect
                  ? sections[0].el.getBoundingClientRect().top + window.scrollY
                  : 0;
              const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
              if (scrollY + 120 < firstTop) updateIfChanged("index.html");
            }
          });
        },
        {
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0.01,
        }
      );
      sections.forEach((s) => sectionIO.observe(s.el));

      // Hero observer: when top area is visible, mark Home
      if ($hero) {
        const heroIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) updateIfChanged("index.html");
            });
          },
          { rootMargin: "-90% 0px -10% 0px", threshold: 0.01 }
        );
        heroIO.observe($hero);
      }
    } else {
      // Fallback: position checks on scroll
      const headerH = document.querySelector("header.site-header")?.offsetHeight || 64;
      const onScroll = () => {
        const y = (window.scrollY || 0) + headerH + 10;
        if ($contact && y >= $contact.offsetTop) {
          updateIfChanged("index.html#contact");
        } else if ($about && y >= $about.offsetTop) {
          updateIfChanged("index.html#about");
        } else if ($services && y >= $services.offsetTop) {
          updateIfChanged("index.html#services");
        } else {
          updateIfChanged("index.html");
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Also react to manual hash changes
    window.addEventListener("hashchange", () => {
      const h = location.hash;
      if (h === "#about") applyActive("index.html#about");
      else if (h === "#contact") applyActive("index.html#contact");
      else applyActive("index.html");
    });
  })();

  /* --------------------------
   * Button behavior (global)
   * -------------------------- */
  // 1) Non-filter buttons should not remain "pressed" after tap
  const blurIfNonFilter = (e) => {
    const el = e.target && e.target.closest && e.target.closest(".btn");
    if (!el) return;
    if (el.matches("[data-filter]")) return; // allow persistent state for filter buttons
    setTimeout(() => {
      try {
        el.blur();
      } catch (_) {}
    }, 120);
  };
  document.addEventListener("click", blurIfNonFilter, true);
  document.addEventListener("pointerup", blurIfNonFilter, true);

  /* --------------------------
   * Portfolio filters (index.html only)
   * -------------------------- */
  (function filters() {
    const page = pageName();
    if (page !== "index.html") return;

    const filterBtns = Array.from(document.querySelectorAll("[data-filter]"));
    const cards = Array.from(document.querySelectorAll("[data-tags]"));
    if (!filterBtns.length || !cards.length) return;

    const applyFilter = (key) => {
      const k = String(key || "all").toLowerCase();
      cards.forEach((card) => {
        const tags = (card.dataset.tags || "")
          .toLowerCase()
          .split(/[\s,]+/)
          .filter(Boolean);
        const match = k === "all" || tags.includes(k);
        if (match) {
          card.classList.remove("is-hidden");
          card.removeAttribute("hidden");
        } else {
          card.classList.add("is-hidden");
          card.setAttribute("hidden", "");
        }
      });
    };

    filterBtns.forEach((btn) =>
      btn.addEventListener("click", () => applyFilter(btn.dataset.filter))
    );
  })();
};
