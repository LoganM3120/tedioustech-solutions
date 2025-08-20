// js/script.js

// 1) Services grid auto-balance on desktop (so 3 cards fill width evenly)
(function () {
  const DESKTOP_Q = '(min-width: 1280px)';
  const grid = document.querySelector('.services-grid');
  if (!grid) return;

  function getCardCount() {
    return grid.querySelectorAll('.project-card').length;
  }

  function updateCols() {
    const mql = window.matchMedia(DESKTOP_Q);
    if (mql.matches) {
      const count = Math.min(getCardCount(), 4); // cap at 4 per design
      grid.setAttribute('data-cols', String(count));
    } else {
      grid.removeAttribute('data-cols'); // fall back to global 1→2→3 responsive rules
    }
  }

  // Init + respond to viewport changes
  updateCols();

  const mql = window.matchMedia(DESKTOP_Q);
  const onChange = () => updateCols();
  if (mql.addEventListener) mql.addEventListener('change', onChange);
  else mql.addListener(onChange);
})();

// 2) Hero rotating word (“hours, days, weeks, months”) — fade only the word
(function () {
  const el = document.querySelector('.word-rotator');
  if (!el) return;

  // Respect reduced motion: keep first word, no rotation
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Words come from data-words attribute, fallback to default list
  const wordsAttr = (el.getAttribute('data-words') || '').trim();
  const words = wordsAttr ? wordsAttr.split(/\s*,\s*/) : ['hours', 'days', 'weeks', 'months'];
  let i = 0;

  function show(idx) {
    // quick fade-out, swap text, fade-in (timings tuned to feel snappy)
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = words[idx];
      el.style.opacity = ''; // remove inline style to allow CSS transition back
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
  const slider = document.querySelector('.tech-slider');
  if (!slider) return;

  const track = slider.querySelector('.tech-slider__track');
  const prev = slider.querySelector('.tech-slider__btn--prev');
  const next = slider.querySelector('.tech-slider__btn--next');
  const slides = track.children;
  let index = 0;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function goNext() {
    index = (index + 1) % slides.length;
    update();
  }

  function goPrev() {
    index = (index - 1 + slides.length) % slides.length;
    update();
  }

  next.addEventListener('click', goNext);
  prev.addEventListener('click', goPrev);

  setInterval(goNext, 4000);
})();
