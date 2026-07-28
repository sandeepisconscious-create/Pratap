import { initPortfolio } from './modules/portfolio.js';

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.getElementById('nav-header');
  const scrollProgress = document.getElementById('scroll-progress');
  const btt = document.getElementById('back-to-top');

  // ── Mobile Menu ──────────────────────────────────────────────────────────────
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !navMenu.classList.contains('translate-x-full');
      navMenu.classList.toggle('translate-x-full');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      navMenu.setAttribute('aria-hidden', String(isOpen));
    });
  }

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.add('translate-x-full');
        navMenu.setAttribute('aria-hidden', 'true');
      }
      if (menuToggle) {
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ── Scroll: progress bar, nav shadow, back-to-top ───────────────────────────
  let lastScrollY = window.scrollY;
  let scrollTicking = false;

  function updateScrollElements() {
    const scrolled = lastScrollY > 50;
    if (header) {
      header.classList.toggle('bg-custom-bg/100', scrolled);
      header.classList.toggle('backdrop-blur-2xl', scrolled);
    }

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && scrollProgress) {
      scrollProgress.style.width = `${(lastScrollY / totalHeight) * 100}%`;
    }

    if (btt) {
      const pastThreshold = lastScrollY > 400;
      btt.classList.toggle('opacity-100', pastThreshold);
      btt.classList.toggle('visible', pastThreshold);
    }
    scrollTicking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      lastScrollY = window.scrollY;
      if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollElements);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  if (btt) {
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Hero showreel embed ──────────────────────────────────────────────────────
  const mainShowreel = document.getElementById('featured-showreel');
  if (mainShowreel) {
    const embedShowreel = () => {
      mainShowreel.style.opacity = '0';
      setTimeout(() => {
        const iframe = document.createElement('iframe');
        iframe.className = 'absolute inset-0 w-full h-full border-0 rounded-2xl';
        iframe.src = 'https://www.youtube.com/embed/LP3id5-GH3A?autoplay=1';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.title = 'Portfolio Showreel Video Frame';

        mainShowreel.innerHTML = '';
        mainShowreel.appendChild(iframe);
        mainShowreel.style.opacity = '1';
      }, 150);
    };

    mainShowreel.addEventListener('click', embedShowreel);
    mainShowreel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        embedShowreel();
      }
    });
  }

  // ── Animated stat counters ───────────────────────────────────────────────────
  const counterRow = document.getElementById('stat-counters-row');

  const animateCounter = (el, target, suffix) => {
    const duration = 1500;
    const start = performance.now();
    let lastValue = -1;
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const currentValue = Math.floor(easeOutQuad * target);
      if (currentValue !== lastValue) {
        el.textContent = currentValue + suffix;
        lastValue = currentValue;
      }
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };

  if (counterRow) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number[data-target]').forEach((num) => {
              const target = parseInt(num.dataset.target, 10);
              const suffix = num.dataset.suffix || '';
              animateCounter(num, target, suffix);
              num.removeAttribute('data-target');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    counterObserver.observe(counterRow);
  }

  // ── Section reveal on scroll ─────────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // ── FAQ accordion ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.faq-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const isCurrentlyOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach((el) => {
        el.classList.remove('open');
        el.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isCurrentlyOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Portfolio modals ──────────────────────────────────────────────────────────
  initPortfolio();

  // ── Background Image Preloading ──────────────────────────────────────────────
  const preloadImages = () => {
    const imagesToPreload = [
      '/src/assets/Zerodha.webp',
      '/src/assets/Razorpay.webp',
      '/src/assets/Aevy.webp',
      '/src/assets/BuilderCentral.webp',
      '/src/assets/GrowthSchool.webp',
      '/src/assets/n8n.png',
      '/src/assets/longform.webp',
      '/src/assets/shortform.webp',
      '/src/assets/ThumbnailPreview.webp',
      '/src/assets/ResultPreview.webp',
      '/src/assets/PrathapPic.webp',
      '/src/assets/Thumbnail1.webp',
      '/src/assets/Thumbnail2.webp',
      '/src/assets/Thumbnail3.webp',
      '/src/assets/Thumbnail4.webp',
      '/src/assets/Proof1.webp',
      '/src/assets/Proof2.webp',
      '/src/assets/Proof3.webp',
      '/src/assets/Proof4.webp'
    ];

    const preload = (src) => {
      const img = new Image();
      img.src = src;
    };

    imagesToPreload.forEach(preload);
  };

  preloadImages();
});
