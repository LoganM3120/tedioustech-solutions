(function () {
  const nav = document.querySelector(".nav__links");
  if (!nav) return;

  const path = window.location.pathname || "";
  const file = path.split("/").pop();         // e.g., "", "index.html", "portfolio.html"
  const hash = window.location.hash || "";    // e.g., "#about", ""

  // Determine which nav item should be active
  let activeHref = null;

  const isHomePage =
    file === "" || file === "index" || file === "index.html";

  const isWorkPage = file === "portfolio.html";

  if (isWorkPage) {
    // On portfolio page → highlight Work
    activeHref = "portfolio.html";
  } else if (isHomePage) {
    // On index page → highlight About *only* when hash is exactly #about
    if (hash === "#about") {
      activeHref = "index.html#about";
    } else {
      activeHref = "index.html"; // default to Home
    }
  }

  // Clear then set aria-current on the single matching link (skip Contact)
  const applyActive = (linkList) => {
     linkList.forEach((a) => {
       a.removeAttribute("aria-current");
       const href = a.getAttribute("href") || "";
 
       // Never highlight Contact
       if (href.includes("#contact")) return;
 
       // Exact match for About; for Home/Work ignore hash when not needed
       if (activeHref === "index.html" && (href === "index.html" || href === "./" || href === "/")) {
         a.setAttribute("aria-current", "page");
       } else if (activeHref === "index.html#about" && href === "index.html#about") {
         a.setAttribute("aria-current", "page");
       } else if (activeHref === "portfolio.html" && href === "portfolio.html") {
         a.setAttribute("aria-current", "page");
       }
     });
   };
 
   // Apply to desktop nav
   applyActive(nav.querySelectorAll("a"));
 
   // Apply to mobile nav if present
   const mobileNav = document.querySelector(".mobile-nav");
   if (mobileNav) applyActive(mobileNav.querySelectorAll("a"));
})();
