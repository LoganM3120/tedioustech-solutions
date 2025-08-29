// js/script.js

// 1) Services grid auto-balance on desktop (so 3 cards fill width evenly)
(function () {
  const DESKTOP_Q = "(min-width: 1280px)";
  const grids = document.querySelectorAll(".services-grid");
  if (!grids.length) return;

  function updateGrid(grid) {
    const mql = window.matchMedia(DESKTOP_Q);
    if (mql.matches) {
      const cardCount = grid.querySelectorAll(".project-card").length;
      const cols = cardCount === 1 ? 3 : Math.min(cardCount, 4);
      grid.setAttribute("data-cols", String(cols));
    } else {
      grid.removeAttribute("data-cols");
    }
  }

  function updateAll() {
    grids.forEach(updateGrid);
  }

  // Init + respond to viewport changes
  updateAll();

  const mql = window.matchMedia(DESKTOP_Q);
  const onChange = () => updateAll();
  if (mql.addEventListener) mql.addEventListener("change", onChange);
  else mql.addListener(onChange);
})();

// 2) Hero rotating word (“hours, days, weeks, months”) — fade only the word
(function () {
  const el = document.querySelector(".word-rotator");
  if (!el) return;

  // Respect reduced motion: keep first word, no rotation
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Words come from data-words attribute, fallback to default list
  const wordsAttr = (el.getAttribute("data-words") || "").trim();
  const words = wordsAttr
    ? wordsAttr.split(/\s*,\s*/)
    : ["hours", "days", "weeks", "months"];
  let i = 0;

  function show(idx) {
    // quick fade-out, swap text, fade-in (timings tuned to feel snappy)
    el.style.opacity = "0";
    setTimeout(() => {
      el.textContent = words[idx];
      el.style.opacity = ""; // remove inline style to allow CSS transition back
    }, 150);
  }

  // Initialize with first word
  el.textContent = words[0];

  if (reduceMotion || words.length <= 1) return;

  setInterval(() => {
    i = (i + 1) % words.length;
    show(i);
  }, 2400);
})();

// 3) Software slider — cycles through tech icons
(function () {
  const slider = document.querySelector(".tech-slider");
  if (!slider) return;

  const track = slider.querySelector(".tech-slider__track");
  const prev = slider.querySelector(".tech-slider__btn--prev");
  const next = slider.querySelector(".tech-slider__btn--next");
  const slides = track.children;
  let index = 0;
  let perView = window.matchMedia("(min-width: 768px)").matches ? 3 : 1;

  function update() {
    const offset = 100 / perView;
    track.style.transform = `translateX(-${index * offset}%)`;
  }

  function goNext() {
    index++;
    if (index > slides.length - perView) index = 0;
    update();
  }

  function goPrev() {
    index--;
    if (index < 0) index = slides.length - perView;
    update();
  }

  function handleResize() {
    perView = window.matchMedia("(min-width: 768px)").matches ? 3 : 1;
    if (index > slides.length - perView) index = 0;
    update();
  }

  window.addEventListener("resize", handleResize);
  next.addEventListener("click", goNext);
  prev.addEventListener("click", goPrev);

  setInterval(goNext, 4000);
  update();
})();

// 4) Footer year
(function () {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

// 5) Carousel
(function () {
  const items = document.querySelectorAll(".carousel__item");
  if (!items.length) return;

  let idx = 0;
  const show = (i) => {
    items.forEach((el, k) => el.classList.toggle("active", k === i));
  };

  let timer = setInterval(() => {
    idx = (idx + 1) % items.length;
    show(idx);
  }, 4000);

  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", () => {
      timer = setInterval(() => {
        idx = (idx + 1) % items.length;
        show(idx);
      }, 4000);
    });
  }
})();

// 6) Package tabs, compare table, and plan quiz
(function () {
  const tabs = document.querySelectorAll(".package-tabs .tab");
  const panels = document.querySelectorAll(".package-panel");
  const compareToggle = document.querySelector(".compare-toggle");
  const table = document.querySelector(".compare-table");
  const quiz = document.getElementById("plan-quiz");
  const recommendBtn = document.getElementById("recommendBtn");
  const modal = document.getElementById("quizModal");
  const closeModal = modal?.querySelector(".modal__close");
  const packageField = document.getElementById("packageField");

  const activate = (id) => {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.target === id));
    panels.forEach((p) => p.classList.toggle("active", p.id === id));
  };

  tabs.forEach((t) =>
    t.addEventListener("click", () => activate(t.dataset.target)),
  );

  if (compareToggle && table) {
    compareToggle.addEventListener("click", (e) => {
      e.preventDefault();
      table.classList.toggle("show");
    });
  }

  if (recommendBtn && modal) {
    recommendBtn.addEventListener("click", () => modal.classList.add("show"));
    closeModal?.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("show");
    });
  }

  if (quiz) {
    quiz.addEventListener("submit", (e) => {
      e.preventDefault();
      const pages = quiz.pages.value;
      const forms = quiz.forms.value;
      const content = quiz.content.value;
      let plan = "pro";
      if (pages === "1" && forms === "no") plan = "starter";
      else if (pages !== "4+" && content === "ready") plan = "standard";

      activate(plan);
      if (packageField) packageField.value = plan;
      document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
      modal?.classList.remove("show");
    });
  }
})();

// 7) Back to top button
(function () {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

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
})();

// 8) Hide sticky CTA when quote section is reached
(function () {
  const cta = document.querySelector(".sticky-cta");
  const hero = document.querySelector(".hero");
  const quote = document.getElementById("quote");
  if (!cta || !hero || !quote) return;

  const toggleCta = () => {
    const afterHero = window.scrollY >= hero.offsetHeight;
    const beforeQuote = window.scrollY + window.innerHeight < quote.offsetTop;
    cta.classList.toggle("hidden", !(afterHero && beforeQuote));
  };

  window.addEventListener("scroll", toggleCta);
  toggleCta();
})();
