document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.getElementById('nav-header');
  const scrollProgress = document.getElementById('scroll-progress');
  const btt = document.getElementById('back-to-top');
  let focusedElementBeforeModal;

  // Mobile Menu Controller
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !navMenu.classList.contains('translate-x-full');
      navMenu.classList.toggle('translate-x-full');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      navMenu.setAttribute('aria-hidden', !isOpen);
    });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
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

  // Passive Structural Window Scroll Pipeline Observer with a Throttle Guard
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

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollElements);
      scrollTicking = true;
    }
  }, { passive: true });

  if (btt) {
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Performance Optimization: Safe Native Element Generation to prevent layout repaints
  const mainShowreel = document.getElementById('featured-showreel');
  if (mainShowreel) {
    mainShowreel.addEventListener('click', () => {
      mainShowreel.style.opacity = '0';
      setTimeout(() => {
        const iframe = document.createElement('iframe');
        iframe.className = "absolute inset-0 w-full h-full border-0 rounded-2xl";
        iframe.src = "https://www.youtube.com/embed/LP3id5-GH3A?autoplay=1";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.title = "Portfolio Showreel Video Frame";
        
        mainShowreel.innerHTML = ''; 
        mainShowreel.appendChild(iframe);
        mainShowreel.style.opacity = '1';
      }, 150);
    });
  }

  // Asynchronous Target Performance Intersection Observers
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
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number[data-target]').forEach(num => {
            const target = parseInt(num.dataset.target, 10);
            const suffix = num.dataset.suffix || '';
            animateCounter(num, target, suffix);
            num.removeAttribute('data-target');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    counterObserver.observe(counterRow);
  }

  // Asynchronous Section Reveal Observer Engine
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // Structural FAQ Accordion Pipeline
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const isCurrentlyOpen = item.classList.contains('open');
      
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isCurrentlyOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  function getYouTubeId(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  }

  // Dynamic Modular Data Engine
  const projectsData = {
    "1": {
      "title": "Longform Portfolio",
      "type": "video",
      "isVertical": false,
      "subs": [
        { "url": "https://youtu.be/eUlf4GiUFRQ" },
        { "url": "https://youtu.be/OsKTDkulAE4" },
        { "url": "https://www.youtube.com/watch?v=LP3id5-GH3A" },
        { "url": "https://www.youtube.com/watch?v=dA6IgCdg6tE" }
      ]
    },
    "2": {
      "title": "Shortform Portfolio",
      "type": "video",
      "isVertical": true, 
      "subs": [
        { "url": "https://youtu.be/CCf8Z4F4_ig" },
        { "url": "https://youtu.be/CFFD3F8kDPY" },
        { "url": "https://youtu.be/UHbcDZSmLcY" },
        { "url": "https://youtube.com/shorts/zheCbXIJnC8" },
        { "url": "https://youtube.com/shorts/nNAN0F0c6mU" },
        { "url": "https://youtube.com/shorts/UqmmEo7Qc_E" }
      ]
    },
    "3": {
      "title": "Thumbnail Layouts",
      "type": "image",
      "subs": [
        { "src": "assets/Thumbnail1.webp" },
        { "src": "assets/Thumbnail2.webp" },
        { "src": "assets/Thumbnail3.webp" },
        { "src": "assets/Thumbnail4.webp" }
      ]
    },
    "4": {
      "title": "Performance Results",
      "type": "image",
      "subs": [
        { "src": "assets/Proof1.webp" },
        { "src": "assets/Proof2.webp" },
        { "src": "assets/Proof3.webp" },
        { "src": "assets/Proof4.webp" }
      ]
    }
  };

  // Category Filtering Logic
  const filterContainer = document.getElementById('project-filters');
  if (filterContainer) {
    const filterButtons = filterContainer.querySelectorAll('button');
    const projectCards = document.querySelectorAll('[data-project]');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active button styles
        filterButtons.forEach(b => {
          b.classList.remove('bg-white', 'text-custom-bg');
          b.classList.add('bg-custom-surface', 'text-text-secondary', 'hover:text-text-primary', 'hover:border-zinc-700');
        });
        btn.classList.add('bg-white', 'text-custom-bg');
        btn.classList.remove('bg-custom-surface', 'text-text-secondary', 'hover:text-text-primary', 'hover:border-zinc-700');
        
        // Hide/Show projects with transition
        projectCards.forEach(card => {
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

  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.project;
      const data = projectsData[id];
      if(!data || !modalTitle || !modalGrid || !modal) return;

      focusedElementBeforeModal = document.activeElement;
      modalTitle.innerText = data.title;
      
      if(data.isVertical) {
        modalGrid.className = "grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-[720px] mx-auto justify-center";
      } else {
        modalGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto justify-center";
      }
      
      // Performance Optimization: DocumentFragment Batch Layout Processing Engine
      const fragment = document.createDocumentFragment();
      
      data.subs.forEach((sub, i) => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = "bg-custom-card border border-custom-border rounded-xl p-2 transform opacity-0 translate-y-4 transition-all duration-300 ease-out style-modal-card";
        cardWrapper.style.transitionDelay = `${i * 50}ms`;
        
        const innerContainer = document.createElement('div');
        
        if (data.type === "video") {
          innerContainer.className = `relative w-full bg-custom-surface border border-custom-border rounded-lg overflow-hidden cursor-pointer group/modal ${data.isVertical ? 'aspect-[9/16]' : 'aspect-video'}`;
          const videoId = getYouTubeId(sub.url);
          
          // Use YouTube thumbnail image
          const img = document.createElement('img');
          img.className = "w-full h-full object-cover transition-transform duration-300 group-hover/modal:scale-105";
          img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          img.alt = `${data.title} Video Preview ${i + 1}`;
          img.loading = "lazy";
          innerContainer.appendChild(img);

          // Add a play overlay button
          const playBtn = document.createElement('div');
          playBtn.className = "absolute inset-0 flex items-center justify-center bg-black/30 group-hover/modal:bg-black/40 transition-colors duration-300";
          playBtn.innerHTML = `
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/modal:scale-110">
              <svg class="w-4 h-4 fill-custom-bg ml-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            </div>
          `;
          innerContainer.appendChild(playBtn);

          // Embed on click
          innerContainer.addEventListener('click', () => {
            innerContainer.style.opacity = '0';
            setTimeout(() => {
              const iframe = document.createElement('iframe');
              iframe.className = "absolute inset-0 w-full h-full border-0";
              iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
              iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
              iframe.allowFullscreen = true;
              iframe.title = `Showcase Video Element ${i + 1}`;
              
              innerContainer.innerHTML = '';
              innerContainer.appendChild(iframe);
              innerContainer.style.opacity = '1';
            }, 150);
          });
        } else {
          innerContainer.className = "relative aspect-video bg-custom-surface border border-custom-border rounded-lg overflow-hidden group/modal";
          const img = document.createElement('img');
          img.src = sub.src;
          img.alt = `${data.title} Asset ${i + 1}`;
          img.className = "w-full h-full object-cover transition-transform duration-300 group-hover/modal:scale-105";
          img.loading = "lazy";
          innerContainer.appendChild(img);
        }
        
        cardWrapper.appendChild(innerContainer);
        fragment.appendChild(cardWrapper);
      });

      modalGrid.innerHTML = '';
      modalGrid.appendChild(fragment);

      modal.classList.add('opacity-100', 'pointer-events-auto');
      setTimeout(() => {
        if (modalContainer) modalContainer.classList.replace('scale-95', 'scale-100');
        document.querySelectorAll('.style-modal-card').forEach(el => el.classList.remove('opacity-0', 'translate-y-4'));
        const closeBtn = document.getElementById('modal-close');
        if(closeBtn) closeBtn.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    });
  });

  const closeMdl = () => {
    if (modalContainer) modalContainer.classList.replace('scale-100', 'scale-95');
    if (modal) modal.classList.remove('opacity-100', 'pointer-events-auto');
    
    setTimeout(() => { if (modalGrid) modalGrid.innerHTML = ''; }, 300);
    document.body.style.overflow = '';
    if(focusedElementBeforeModal) focusedElementBeforeModal.focus();
  };
  
  const modalCloseBtn = document.getElementById('modal-close');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMdl);
  if (modal) modal.addEventListener('click', (e) => e.target === modal && closeMdl());

  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('opacity-100')) {
      if (e.key === 'Escape') {
        closeMdl();
      }
      if (e.key === 'Tab') {
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
});
