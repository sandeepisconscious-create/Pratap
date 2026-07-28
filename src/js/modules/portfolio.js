import { setupShimmerOnElement } from './shimmer.js';

function getYouTubeId(url) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
}

// Local fallback dataset to ensure robust operation under all environments/network states.
let projectsData = {
  1: {
    title: 'Longform Portfolio',
    type: 'video',
    isVertical: false,
    subs: [
      { url: 'https://youtu.be/eUlf4GiUFRQ' },
      { url: 'https://youtu.be/OsKTDkulAE4' },
      { url: 'https://www.youtube.com/watch?v=LP3id5-GH3A' },
      { url: 'https://www.youtube.com/watch?v=dA6IgCdg6tE' }
    ]
  },
  2: {
    title: 'Shortform Portfolio',
    type: 'video',
    isVertical: true,
    subs: [
      { url: 'https://youtu.be/CCf8Z4F4_ig' },
      { url: 'https://youtu.be/CFFD3F8kDPY' },
      { url: 'https://youtu.be/UHbcDZSmLcY' },
      { url: 'https://youtube.com/shorts/zheCbXIJnC8' },
      { url: 'https://youtube.com/shorts/nNAN0F0c6mU' },
      { url: 'https://youtube.com/shorts/UqmmEo7Qc_E' }
    ]
  },
  3: {
    title: 'Thumbnail Layouts',
    type: 'image',
    subs: [
      { src: '/src/assets/Thumbnail1.webp' },
      { src: '/src/assets/Thumbnail2.webp' },
      { src: '/src/assets/Thumbnail3.webp' },
      { src: '/src/assets/Thumbnail4.webp' }
    ]
  },
  4: {
    title: 'Performance Results',
    type: 'image',
    subs: [
      { src: '/src/assets/Proof1.webp' },
      { src: '/src/assets/Proof2.webp' },
      { src: '/src/assets/Proof3.webp' },
      { src: '/src/assets/Proof4.webp' }
    ]
  }
};

// Asynchronously fetch JSON configuration to unify data sources immediately when module imports
fetch('/src/data/projects.json')
  .then((res) => {
    if (res.ok) return res.json();
    throw new Error('Data fetch status error');
  })
  .then((data) => {
    projectsData = data;
  })
  .catch((err) => {
    console.warn('Using offline projects fallback database:', err);
  });

export function initPortfolio() {
  let focusedElementBeforeModal;
  let closeMdl;

  // Category Filtering Logic
  const filterContainer = document.getElementById('project-filters');
  if (filterContainer) {
    const filterButtons = filterContainer.querySelectorAll('button');
    const projectCards = document.querySelectorAll('[data-project]');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button styles
        filterButtons.forEach((b) => {
          b.classList.remove('bg-white', 'text-custom-bg');
          b.classList.add(
            'bg-custom-surface',
            'text-text-secondary',
            'hover:text-text-primary',
            'hover:border-zinc-700'
          );
        });
        btn.classList.add('bg-white', 'text-custom-bg');
        btn.classList.remove(
          'bg-custom-surface',
          'text-text-secondary',
          'hover:text-text-primary',
          'hover:border-zinc-700'
        );

        // Hide/Show projects with transition
        projectCards.forEach((card) => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  const modal = document.getElementById('project-modal');
  const modalContainer = document.getElementById('project-modal-container');
  const modalGrid = document.getElementById('modal-sub-project-grid');
  const modalTitle = document.getElementById('modal-title');

  document.querySelectorAll('[data-project]').forEach((card) => {
    // Add keyboard trigger for card opening
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    card.addEventListener('click', () => {
      const id = card.dataset.project;
      const data = projectsData[id];
      if (!data || !modalTitle || !modalGrid || !modal) return;

      focusedElementBeforeModal = document.activeElement;
      modalTitle.innerText = data.title;

      // Slideshow carousel state
      let activeIndex = 0;
      const totalSlides = data.subs.length;

      const renderCarousel = () => {
        // Clear and format layout
        modalGrid.className = 'flex flex-col items-center justify-center w-full min-h-[300px] select-none relative';
        modalGrid.innerHTML = '';

        // Carousel outer wrapper
        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'relative w-full flex items-center justify-center px-10 md:px-14';

        // Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.className =
          'absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-custom-card border border-custom-border flex items-center justify-center text-text-primary hover:border-white transition-all hover:scale-105 active:scale-95 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';
        prevBtn.ariaLabel = 'Previous slide';
        prevBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">arrow_back_ios_new</span>`;
        prevBtn.addEventListener('click', () => navigate(-1));
        carouselWrapper.appendChild(prevBtn);

        // Slide media viewport
        const slideViewport = document.createElement('div');
        slideViewport.className = `transition-all duration-300 ease-out transform opacity-0 translate-y-2 mx-auto ${
          data.isVertical
            ? 'w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] aspect-[9/16] max-h-[48vh] sm:max-h-[54vh] md:max-h-[58vh]'
            : 'w-full max-w-2xl aspect-video'
        }`;

        const sub = data.subs[activeIndex];
        const innerContainer = document.createElement('div');
        innerContainer.className =
          'relative w-full h-full bg-custom-surface border border-custom-border rounded-xl overflow-hidden group/modal';

        if (data.type === 'video') {
          innerContainer.className += ' cursor-pointer';
          innerContainer.setAttribute('tabindex', '0');
          innerContainer.setAttribute('role', 'button');
          innerContainer.setAttribute('aria-label', `Play video ${activeIndex + 1}`);

          const videoId = getYouTubeId(sub.url);
          const img = document.createElement('img');
          img.className = 'w-full h-full object-cover transition-transform duration-300 group-hover/modal:scale-105';
          img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          img.alt = `${data.title || 'Retention-Driven Video Editing'} - Portfolio Showreel Asset ${activeIndex + 1} by Prathap Rao`;
          img.loading = 'lazy';
          innerContainer.appendChild(img);

          const playBtn = document.createElement('div');
          playBtn.className =
            'absolute inset-0 flex items-center justify-center bg-black/30 group-hover/modal:bg-black/40 transition-colors duration-300';
          playBtn.innerHTML = `
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/modal:scale-110">
              <svg class="w-4 h-4 fill-custom-bg ml-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            </div>
          `;
          innerContainer.appendChild(playBtn);

          const playSubproject = () => {
            innerContainer.style.opacity = '0';
            setTimeout(() => {
              const iframe = document.createElement('iframe');
              iframe.className = 'absolute inset-0 w-full h-full border-0';
              iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
              iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
              iframe.allowFullscreen = true;
              iframe.title = `Showcase Video Element ${activeIndex + 1}`;

              innerContainer.innerHTML = '';
              innerContainer.appendChild(iframe);
              innerContainer.style.opacity = '1';

              setTimeout(() => {
                iframe.focus();
              }, 100);
            }, 150);
          };

          innerContainer.addEventListener('click', playSubproject);
          innerContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              playSubproject();
            }
          });
        } else {
          const img = document.createElement('img');
          img.alt = `${data.title || 'Creative Video Production Portfolio'} - Design Showcase Asset ${activeIndex + 1} by Prathap Rao`;
          img.className = 'w-full h-full object-cover transition-transform duration-300 group-hover/modal:scale-105';
          img.loading = 'eager';
          img.decoding = 'async';
          innerContainer.appendChild(img);
          // Set src AFTER appending so shimmer load listener can catch it
          img.src = sub.src;
        }

        slideViewport.appendChild(innerContainer);
        carouselWrapper.appendChild(slideViewport);

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className =
          'absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-custom-card border border-custom-border flex items-center justify-center text-text-primary hover:border-white transition-all hover:scale-105 active:scale-95 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';
        nextBtn.ariaLabel = 'Next slide';
        nextBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">arrow_forward_ios</span>`;
        nextBtn.addEventListener('click', () => navigate(1));
        carouselWrapper.appendChild(nextBtn);

        modalGrid.appendChild(carouselWrapper);

        // Footer Pagination dots
        const footerControls = document.createElement('div');
        footerControls.className = 'mt-6 flex flex-col items-center gap-3 w-full';

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'flex items-center gap-2';
        for (let j = 0; j < totalSlides; j++) {
          const dot = document.createElement('button');
          dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${j === activeIndex ? 'bg-white w-4' : 'bg-text-muted hover:bg-text-secondary'}`;
          dot.ariaLabel = `Go to slide ${j + 1}`;
          dot.addEventListener('click', () => {
            if (j !== activeIndex) {
              activeIndex = j;
              renderCarousel();
            }
          });
          dotsContainer.appendChild(dot);
        }
        footerControls.appendChild(dotsContainer);

        const counterLabel = document.createElement('span');
        counterLabel.className = 'text-[11px] text-text-secondary font-bold tracking-widest uppercase';
        counterLabel.innerText = `${activeIndex + 1} of ${totalSlides}`;
        footerControls.appendChild(counterLabel);

        modalGrid.appendChild(footerControls);

        // Dynamic Shimmer skeleton activation
        setupShimmerOnElement(innerContainer);

        // Swipe Gestures
        let touchStartX = 0;
        let touchEndX = 0;
        innerContainer.addEventListener(
          'touchstart',
          (e) => {
            touchStartX = e.changedTouches[0].screenX;
          },
          { passive: true }
        );
        innerContainer.addEventListener(
          'touchend',
          (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 40;
            if (touchEndX < touchStartX - threshold) {
              navigate(1);
            } else if (touchEndX > touchStartX + threshold) {
              navigate(-1);
            }
          },
          { passive: true }
        );

        // Trigger slide enter transition
        setTimeout(() => {
          slideViewport.classList.remove('opacity-0', 'translate-y-2');
          slideViewport.classList.add('opacity-100', 'translate-y-0');
        }, 50);
      };

      const navigate = (direction) => {
        activeIndex = (activeIndex + direction + totalSlides) % totalSlides;
        renderCarousel();
      };

      renderCarousel();

      modal.classList.add('opacity-100', 'pointer-events-auto');
      setTimeout(() => {
        if (modalContainer) modalContainer.classList.replace('scale-95', 'scale-100');
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) closeBtn.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    });
  });

  closeMdl = () => {
    if (modalContainer) modalContainer.classList.replace('scale-100', 'scale-95');
    if (modal) modal.classList.remove('opacity-100', 'pointer-events-auto');

    setTimeout(() => {
      if (modalGrid) modalGrid.innerHTML = '';
    }, 300);
    document.body.style.overflow = '';
    if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
  };

  const modalCloseBtn = document.getElementById('modal-close');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMdl);
  if (modal) modal.addEventListener('click', (e) => e.target === modal && closeMdl());

  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('opacity-100')) {
      if (e.key === 'Escape') {
        closeMdl();
      } else if (e.key === 'ArrowLeft') {
        const prevBtn = modal.querySelector('[aria-label="Previous slide"]');
        if (prevBtn) prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        const nextBtn = modal.querySelector('[aria-label="Next slide"]');
        if (nextBtn) nextBtn.click();
      } else if (e.key === 'Tab') {
        const focusables = modal.querySelectorAll('button, iframe, [tabindex="0"]');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  });
}
