// js/nav.js
// Initializes desktop/mobile navigation behaviors.

window.initNav = function () {
  const BREAKPOINT = 768; // px
  const btn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const desktopNav = document.querySelector('.nav__links');

  if (!btn || !mobileMenu) return;

  // Ensure no inline display sticks around from any previous code
  mobileMenu.style.removeProperty('display');

  function isMobile() {
    return window.matchMedia(`(max-width: ${BREAKPOINT}px)`).matches;
  }

  function setAriaHidden() {
    const menuOpen = document.body.classList.contains('menu-open');
    const mobile = isMobile();
    // Desktop nav exposure
    if (desktopNav) {
      desktopNav.setAttribute('aria-hidden', mobile ? 'true' : 'false');
    }
    // Mobile menu exposure
    if (mobileMenu) {
      mobileMenu.setAttribute(
        'aria-hidden',
        mobile ? (menuOpen ? 'false' : 'true') : 'true'
      );
    }
  }

  function focusFirstMobileLink() {
    const firstLink = mobileMenu.querySelector(
      'a,button,[tabindex]:not([tabindex="-1"])'
    );
    if (firstLink) {
      firstLink.focus({ preventScroll: true });
    }
  }

  function openMenu() {
    document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    setAriaHidden();
    // Move focus into the menu for accessibility
    setTimeout(focusFirstMobileLink, 0);
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    setAriaHidden();
    // Return focus to the toggle for logical focus order
    btn.focus({ preventScroll: true });
  }

  function toggleMenu() {
    const open = document.body.classList.contains('menu-open');
    open ? closeMenu() : openMenu();
  }

  // Initial state: if not mobile, ensure closed
  if (!isMobile()) {
    closeMenu();
  }
  setAriaHidden();

  // Toggle on button click
  btn.addEventListener('click', toggleMenu);

  // Close when clicking a link inside the mobile menu
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      closeMenu();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Handle viewport changes — if leaving mobile, force closed
  const mq = window.matchMedia(`(max-width: ${BREAKPOINT}px)`);
  function handleMQChange() {
    if (!mq.matches) {
      // Leaving mobile → ensure menu closed and ARIA updated
      closeMenu();
    } else {
      // Entering mobile → keep closed by default and update ARIA
      setAriaHidden();
    }
  }
  mq.addEventListener ? mq.addEventListener('change', handleMQChange) : mq.addListener(handleMQChange);
  handleMQChange();
};
