// js/nav.js
(function () {
  const BREAKPOINT = 768; // px
  const btn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!btn || !mobileMenu) return;

  // Ensure no inline display sticks around from any previous code
  mobileMenu.style.removeProperty('display');

  function isMobile() {
    return window.matchMedia(`(max-width: ${BREAKPOINT}px)`).matches;
  }

  function openMenu() {
    document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const open = document.body.classList.contains('menu-open');
    open ? closeMenu() : openMenu();
  }

  // Initial state: if not mobile, ensure closed
  if (!isMobile()) closeMenu();

  // Toggle on button click
  btn.addEventListener('click', toggleMenu);

  // Close when clicking a link inside the mobile menu
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Handle viewport changes — if leaving mobile, force closed
  const mq = window.matchMedia(`(max-width: ${BREAKPOINT}px)`);
  function handleMQChange() {
    if (!mq.matches) closeMenu();
  }
  mq.addEventListener ? mq.addEventListener('change', handleMQChange) : mq.addListener(handleMQChange);
  handleMQChange();
})();
