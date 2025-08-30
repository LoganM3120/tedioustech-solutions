// js/includes.js
// Simple HTML partial loader. Usage: <div data-include="path/to/file.html"></div>
// After all includes load, initializes navigation scripts if present.

document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  const promises = Array.from(includes).map((el) => {
    const file = el.getAttribute("data-include");
    return fetch(file)
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to fetch " + file);
        return resp.text();
      })
      .then((html) => {
        el.outerHTML = html;
      });
  });

  Promise.all(promises)
    .then(() => {
      if (typeof window.initNav === "function") window.initNav();
      if (typeof window.initActiveNav === "function") window.initActiveNav();

      // Back to top button (desktop only)
      if (!document.getElementById("backToTop")) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.id = "backToTop";
        btn.className = "back-to-top";
        btn.setAttribute("aria-label", "Back to top");
        btn.innerHTML = "↑";
        document.body.appendChild(btn);

        const mq = window.matchMedia("(min-width: 769px)");

        const onScroll = () => {
          btn.classList.toggle("show", window.scrollY > 400);
        };

        const setup = () => {
          if (mq.matches) {
            window.addEventListener("scroll", onScroll);
            onScroll();
          } else {
            window.removeEventListener("scroll", onScroll);
            btn.classList.remove("show");
          }
        };

        mq.addEventListener
          ? mq.addEventListener("change", setup)
          : mq.addListener(setup);
        setup();

        btn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        const footer = document.querySelector(".footer");
        if (footer) {
          const rootStyles = getComputedStyle(document.documentElement);
          const gap = parseFloat(rootStyles.getPropertyValue("--space-m")) || 0;

          const observer = new IntersectionObserver(([entry]) => {
            btn.style.bottom = entry.isIntersecting
              ? `${footer.offsetHeight + gap}px`
              : "";
          });

          observer.observe(footer);
        }
      }
    })
    .catch((err) => console.error("Include error:", err));
});
