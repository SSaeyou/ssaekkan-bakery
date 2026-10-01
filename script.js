(() => {
  const menuButton = document.querySelector('.menu-button');
  const menuClose = document.querySelector('.menu-close');
  const backdrop = document.querySelector('.menu-backdrop');
  const menuPanel = document.querySelector('.menu-panel');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    menuPanel?.setAttribute('aria-hidden', String(!open));
    if (backdrop) backdrop.hidden = !open;
  }
  menuButton?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  menuClose?.addEventListener('click', () => setMenu(false));
  backdrop?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('.carousel-dots button')];
  let index = 0;
  let timer;
  let touchStartX = null;
  const show = next => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  const stop = () => window.clearInterval(timer);
  const start = () => { stop(); timer = window.setInterval(() => show(index + 1), 5000); };
  carousel.querySelector('.prev')?.addEventListener('click', () => { show(index - 1); start(); });
  carousel.querySelector('.next')?.addEventListener('click', () => { show(index + 1); start(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', event => { if (!carousel.contains(event.relatedTarget)) start(); });
  carousel.addEventListener('touchstart', event => { touchStartX = event.touches[0]?.clientX ?? null; stop(); }, { passive: true });
  carousel.addEventListener('touchend', event => {
    const touchEndX = event.changedTouches[0]?.clientX;
    if (touchStartX !== null && touchEndX !== undefined && Math.abs(touchEndX - touchStartX) > 45) show(index + (touchEndX < touchStartX ? 1 : -1));
    touchStartX = null;
    start();
  }, { passive: true });
  start();
})();

