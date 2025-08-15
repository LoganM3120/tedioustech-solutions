// js/script.js
// Balance the Services grid so 3 cards fill the width on desktop (no empty 4th column)
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
      const count = Math.min(getCardCount(), 4);
      grid.setAttribute('data-cols', String(count));
    } else {
      grid.removeAttribute('data-cols');
    }
  }

  // Init + respond to viewport changes
  updateCols();

  const mql = window.matchMedia(DESKTOP_Q);
  const onChange = () => updateCols();
  mql.addEventListener ? mql.addEventListener('change', onChange) : mql.addListener(onChange);
})();
