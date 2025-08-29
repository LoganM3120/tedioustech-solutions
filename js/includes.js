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
    })
    .catch((err) => console.error("Include error:", err));
});
