// Active nav underline + scroll-spy for index sections
// - Highlights "Home" on index top (hero), "About" when #about is in view,
//   and "Contact" when #contact is in view.
// - Highlights "Work" on portfolio.html.
// - Applies aria-current="page" to BOTH desktop and mobile menus.

(function () {
  const desktopNav = document.querySelector(".nav__links");
  const mobileNav = document.querySelector(".mobile-nav");

  // Normalize hrefs for reliable comparison
  const normalize = (url) => {
    if (!url) return "";
    // strip leading ./ or / and trailing /
    return url.replace(/^(\.\/|\/)/, "").replace(/\/$/, "");
  };

  // Apply aria-current to matching href across a list
  const applyActiveToList = (list, targetHref) => {
    list.forEach((a) => {
      a.removeAttribute("aria-current");
      const href = a.getAttribute("href") || "";
      if (normalize(href) === normalize(targetHref)) {
        a.setAttribute("aria-current", "page");
      }
    });
  };

  const applyActive = (targetHref) => {
    if (desktopNav) applyActiveToList(desktopNav.querySelectorAll("a"), targetHref);
    if (mobileNav) applyActiveToList(mobileNav.querySelectorAll("a"), targetHref);
  };

  const setInitialActive = () => {
    const page = (location.pathname.split("/").pop() || "index.html");
    const hash = location.hash;

    if (page === "" || page === "index.html") {
      if (hash === "#about") applyActive("index.html#about");
      else if (hash === "#contact") applyActive("index.html#contact");
      else applyActive("index.html"); // Home
    } else if (page === "portfolio.html") {
      applyActive("portfolio.html"); // Work
    } else {
      applyActive(page); // any other page
    }
  };

  setInitialActive();

  // Scroll-spy only on the index page
  const currentPage = (location.pathname.split("/").pop() || "index.html");
  if (currentPage === "" || currentPage === "index.html") {
    const aboutEl = document.getElementById("about");
    const contactEl = document.getElementById("contact");
    const heroEl = document.querySelector(".hero");

    // Nothing to observe? bail.
    if (!aboutEl && !contactEl) return;

    let currentHref = ""; // to prevent redundant DOM writes
    const updateIfChanged = (href) => {
      if (href !== currentHref) {
        currentHref = href;
        applyActive(href);
      }
    };

    if ("IntersectionObserver" in window) {
      // Observer that marks a section active when it is in the middle band of the viewport
      const sectionMap = [];
      if (aboutEl) sectionMap.push({ el: aboutEl, href: "index.html#about" });
      if (contactEl) sectionMap.push({ el: contactEl, href: "index.html#contact" });

      const sectionIO = new IntersectionObserver(
        (entries) => {
          // If multiple intersect, the one last reported (usually deeper on page) wins
          entries.forEach((entry) => {
            const match = sectionMap.find((s) => s.el === entry.target);
            if (!match) return;

            if (entry.isIntersecting) {
              updateIfChanged(match.href);
            } else {
              // If scrolled above the first observed section, revert to Home
              const firstTop = sectionMap[0]?.el?.getBoundingClientRect
                ? sectionMap[0].el.getBoundingClientRect().top + window.scrollY
                : 0;
              const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
              if (scrollY + 120 < firstTop) {
                updateIfChanged("index.html");
              }
            }
          });
        },
        {
          // Activate when the section is roughly in the middle third
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0.01,
        }
      );

      sectionMap.forEach((s) => sectionIO.observe(s.el));

      // Separate observer for the hero/top region → "Home"
      if (heroEl) {
        const heroIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                updateIfChanged("index.html");
              }
            });
          },
          { rootMargin: "-90% 0px -10% 0px", threshold: 0.01 }
        );
        heroIO.observe(heroEl);
      }
    } else {
      // Fallback for older browsers: position checks on scroll
      const headerH = document.querySelector("header.site-header")?.offsetHeight || 64;

      const onScroll = () => {
        const y = window.scrollY + headerH + 10;
        if (contactEl && y >= contactEl.offsetTop) {
          updateIfChanged("index.html#contact");
        } else if (aboutEl && y >= aboutEl.offsetTop) {
          updateIfChanged("index.html#about");
        } else {
          updateIfChanged("index.html");
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  // Also react when hash changes via clicks
  window.addEventListener("hashchange", () => {
    const h = location.hash;
    if (h === "#about") applyActive("index.html#about");
    else if (h === "#contact") applyActive("index.html#contact");
    else applyActive("index.html");
  });
})();
