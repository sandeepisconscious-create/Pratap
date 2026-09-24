import { setupShimmerOnElement } from "./shimmer.js";

function getYouTubeId(url) {
  if (!url) return "";
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
}

// Global immutable portfolio dataset containing all verified projects and preview assets
export const projectsData = {
  1: {
    title: "Longform Portfolio",
    type: "video",
    isVertical: false,
    subs: [
      { url: "https://youtu.be/eUlf4GiUFRQ", title: "Longform Showreel 01" },
      { url: "https://youtu.be/OsKTDkulAE4", title: "Longform Showreel 02" },
      {
        url: "https://www.youtube.com/watch?v=LP3id5-GH3A",
        title: "Longform Showreel 03",
      },
      {
        url: "https://www.youtube.com/watch?v=dA6IgCdg6tE",
        title: "Longform Showreel 04",
      },
      { url: "https://youtu.be/VbaiL2RPwDs", title: "Longform Showreel 05" },
      { url: "https://youtu.be/_xc3I6paroQ", title: "Longform Showreel 06" },
    ],
  },
  2: {
    title: "Shortform Portfolio",
    type: "video",
    isVertical: true,
    subs: [
      { url: "https://youtu.be/CCf8Z4F4_ig", title: "Shortform 01" },
      { url: "https://youtu.be/CFFD3F8kDPY", title: "Shortform 02" },
      { url: "https://youtu.be/UHbcDZSmLcY", title: "Shortform 03" },
      { url: "https://youtube.com/shorts/zheCbXIJnC8", title: "Shortform 04" },
      { url: "https://youtube.com/shorts/nNAN0F0c6mU", title: "Shortform 05" },
      { url: "https://youtube.com/shorts/UqmmEo7Qc_E", title: "Shortform 06" },
    ],
  },
  3: {
    title: "Thumbnail Layouts",
    type: "image",
    subs: [
      { src: "src/assets/Thumbnail1.webp", title: "Thumbnail 01" },
      { src: "src/assets/Thumbnail2.webp", title: "Thumbnail 02" },
      { src: "src/assets/Thumbnail3.webp", title: "Thumbnail 03" },
      { src: "src/assets/Thumbnail4.webp", title: "Thumbnail 04" },
    ],
  },
  4: {
    title: "Performance Results",
    type: "image",
    subs: [
      { src: "src/assets/Proof1.webp", title: "Metric 01" },
      { src: "src/assets/Proof2.webp", title: "Metric 02" },
      { src: "src/assets/Proof3.webp", title: "Metric 03" },
      { src: "src/assets/Proof4.webp", title: "Metric 04" },
    ],
  },
};

export function initPortfolio() {
  let focusedElementBeforeModal;
  let closeMdl;
  let currentActiveData = null;
  let currentViewMode = "grid"; // 'grid' | 'carousel'
  let activeSlideIndex = 0;

  // Category Filtering Logic
  const filterContainer = document.getElementById("project-filters");
  if (filterContainer) {
    const filterButtons = filterContainer.querySelectorAll("button");
    const projectCards = document.querySelectorAll("[data-project]");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach((b) => {
          b.classList.remove(
            "bg-[#2196F3]",
            "text-white",
            "border-transparent",
          );
          b.classList.add(
            "bg-custom-surface",
            "text-text-secondary",
            "hover:text-text-primary",
            "hover:border-zinc-700",
          );
        });
        btn.classList.add("bg-[#2196F3]", "text-white", "border-transparent");
        btn.classList.remove(
          "bg-custom-surface",
          "text-text-secondary",
          "hover:text-text-primary",
          "hover:border-zinc-700",
        );

        projectCards.forEach((card) => {
          if (filter === "all" || card.dataset.category === filter) {
            card.style.display = "flex";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 50);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(12px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  const modal = document.getElementById("project-modal");
  const modalContainer = document.getElementById("project-modal-container");
  const modalGrid = document.getElementById("modal-sub-project-grid");
  const modalTitle = document.getElementById("modal-title");
  const counterBadge = document.getElementById("modal-counter-badge");
  const viewGridBtn = document.getElementById("view-grid-btn");
  const viewCarouselBtn = document.getElementById("view-carousel-btn");

  // Render Grid with ALL items visible simultaneously
  const renderGridView = (data) => {
    modalGrid.innerHTML = "";
    modalGrid.className = data.isVertical
      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full";

    data.subs.forEach((sub, index) => {
      const card = document.createElement("div");
      card.className =
        "flex flex-col bg-custom-surface border border-custom-border rounded-xl overflow-hidden hover:border-[#2196F3]/50 transition-all duration-300 group/card relative shadow-md";

      if (data.type === "video") {
        const videoId = getYouTubeId(sub.url);
        const previewContainer = document.createElement("div");
        previewContainer.className = `relative w-full overflow-hidden bg-black cursor-pointer ${
          data.isVertical ? "aspect-[9/16]" : "aspect-video"
        }`;
        previewContainer.setAttribute("tabindex", "0");
        previewContainer.setAttribute("role", "button");
        previewContainer.setAttribute(
          "aria-label",
          `Play preview ${index + 1}`,
        );

        const img = document.createElement("img");
        img.className =
          "w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105";
        img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        img.alt = `${data.title} preview ${index + 1}`;
        img.loading = "eager";
        img.onerror = () => {
          img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        };
        previewContainer.appendChild(img);

        // Number Badge
        const badge = document.createElement("span");
        badge.className =
          "absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10 z-10";
        badge.innerText = `0${index + 1}`;
        previewContainer.appendChild(badge);

        // Play Button Overlay
        const playBtn = document.createElement("div");
        playBtn.className =
          "absolute inset-0 flex items-center justify-center bg-black/25 group-hover/card:bg-black/40 transition-colors duration-200 z-10";
        playBtn.innerHTML = `
          <div class="w-11 h-11 bg-[#2196F3] rounded-full flex items-center justify-center text-white transition-transform duration-200 group-hover/card:scale-110 shadow-lg">
            <svg class="w-4 h-4 fill-white ml-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        `;
        previewContainer.appendChild(playBtn);

        const playVideo = () => {
          previewContainer.style.opacity = "0";
          setTimeout(() => {
            const iframe = document.createElement("iframe");
            iframe.className = "absolute inset-0 w-full h-full border-0";
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.allow =
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.title = `${data.title} ${index + 1}`;
            previewContainer.innerHTML = "";
            previewContainer.appendChild(iframe);
            previewContainer.style.opacity = "1";
          }, 150);
        };

        previewContainer.addEventListener("click", playVideo);
        previewContainer.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            playVideo();
          }
        });

        setupShimmerOnElement(previewContainer);
        card.appendChild(previewContainer);

        // Label footer
        const label = document.createElement("div");
        label.className =
          "p-3 flex items-center justify-between text-xs font-semibold text-text-secondary bg-custom-surface/50 border-t border-custom-border/50";
        label.innerHTML = `
          <span class="truncate text-text-primary font-medium">Video ${index + 1}</span>
          <span class="text-[#2196F3] text-[11px] font-bold group-hover/card:underline cursor-pointer">Play Video</span>
        `;
        label.addEventListener("click", playVideo);
        card.appendChild(label);
      } else {
        const previewContainer = document.createElement("div");
        previewContainer.className =
          "relative w-full aspect-video overflow-hidden bg-custom-card";

        const img = document.createElement("img");
        img.className =
          "w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105";
        img.src = sub.src;
        img.alt = `${data.title} ${index + 1}`;
        img.loading = "eager";
        previewContainer.appendChild(img);

        const badge = document.createElement("span");
        badge.className =
          "absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10 z-10";
        badge.innerText = `0${index + 1}`;
        previewContainer.appendChild(badge);

        setupShimmerOnElement(previewContainer);
        card.appendChild(previewContainer);

        const label = document.createElement("div");
        label.className =
          "p-3 text-xs font-medium text-text-secondary bg-custom-surface/50 border-t border-custom-border/50";
        label.innerText = sub.title || `${data.title} ${index + 1}`;
        card.appendChild(label);
      }

      modalGrid.appendChild(card);
    });
  };

  // Render Theater/Slideshow View with bottom thumbnail filmstrip of all items
  const renderCarouselView = (data) => {
    modalGrid.innerHTML = "";
    modalGrid.className =
      "flex flex-col items-center justify-center w-full min-h-[360px] select-none relative";

    const totalSlides = data.subs.length;

    const carouselWrapper = document.createElement("div");
    carouselWrapper.className =
      "relative w-full flex items-center justify-center px-10 md:px-14";

    // Prev Button
    const prevBtn = document.createElement("button");
    prevBtn.className =
      "absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-custom-card border border-custom-border flex items-center justify-center text-text-primary hover:border-white transition-all hover:scale-105 active:scale-95 z-30 cursor-pointer";
    prevBtn.setAttribute("aria-label", "Previous slide");
    prevBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">arrow_back_ios_new</span>`;
    prevBtn.addEventListener("click", () => {
      activeSlideIndex = (activeSlideIndex - 1 + totalSlides) % totalSlides;
      renderCarouselView(data);
    });
    carouselWrapper.appendChild(prevBtn);

    // Active Slide Viewport
    const slideViewport = document.createElement("div");
    slideViewport.className = `mx-auto w-full ${
      data.isVertical
        ? "max-w-[280px] aspect-[9/16] max-h-[55vh]"
        : "max-w-2xl aspect-video"
    }`;

    const sub = data.subs[activeSlideIndex];
    const inner = document.createElement("div");
    inner.className =
      "relative w-full h-full bg-custom-surface border border-custom-border rounded-xl overflow-hidden group/modal cursor-pointer shadow-xl";

    if (data.type === "video") {
      const videoId = getYouTubeId(sub.url);
      const img = document.createElement("img");
      img.className =
        "w-full h-full object-cover transition-transform duration-300 group-hover/modal:scale-105";
      img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      img.alt = `${data.title} ${activeSlideIndex + 1}`;
      img.loading = "eager";
      inner.appendChild(img);

      const playBtn = document.createElement("div");
      playBtn.className =
        "absolute inset-0 flex items-center justify-center bg-black/30 group-hover/modal:bg-black/40 transition-colors duration-200";
      playBtn.innerHTML = `
        <div class="w-14 h-14 bg-[#2196F3] rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover/modal:scale-110">
          <svg class="w-5 h-5 fill-white ml-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      `;
      inner.appendChild(playBtn);

      const playCurrent = () => {
        inner.style.opacity = "0";
        setTimeout(() => {
          const iframe = document.createElement("iframe");
          iframe.className = "absolute inset-0 w-full h-full border-0";
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          inner.innerHTML = "";
          inner.appendChild(iframe);
          inner.style.opacity = "1";
        }, 150);
      };

      inner.addEventListener("click", playCurrent);
    } else {
      const img = document.createElement("img");
      img.className = "w-full h-full object-cover";
      img.src = sub.src;
      img.alt = `${data.title} ${activeSlideIndex + 1}`;
      img.loading = "eager";
      inner.appendChild(img);
    }

    setupShimmerOnElement(inner);
    slideViewport.appendChild(inner);
    carouselWrapper.appendChild(slideViewport);

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.className =
      "absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-custom-card border border-custom-border flex items-center justify-center text-text-primary hover:border-white transition-all hover:scale-105 active:scale-95 z-30 cursor-pointer";
    nextBtn.setAttribute("aria-label", "Next slide");
    nextBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">arrow_forward_ios</span>`;
    nextBtn.addEventListener("click", () => {
      activeSlideIndex = (activeSlideIndex + 1) % totalSlides;
      renderCarouselView(data);
    });
    carouselWrapper.appendChild(nextBtn);
    modalGrid.appendChild(carouselWrapper);

    // Filmstrip of ALL preview thumbnails
    const filmstrip = document.createElement("div");
    filmstrip.className =
      "mt-6 flex items-center justify-center gap-2.5 flex-wrap px-4";
    data.subs.forEach((item, idx) => {
      const thumbBtn = document.createElement("button");
      thumbBtn.className = `relative rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer ${
        idx === activeSlideIndex
          ? "border-[#2196F3] scale-105 shadow-md shadow-[#2196F3]/30"
          : "border-custom-border opacity-50 hover:opacity-100 hover:border-zinc-500"
      } ${data.isVertical ? "w-10 h-16" : "w-16 h-10"}`;

      const tImg = document.createElement("img");
      tImg.className = "w-full h-full object-cover";
      if (data.type === "video") {
        const vId = getYouTubeId(item.url);
        tImg.src = `https://img.youtube.com/vi/${vId}/mqdefault.jpg`;
      } else {
        tImg.src = item.src;
      }
      thumbBtn.appendChild(tImg);
      thumbBtn.addEventListener("click", () => {
        activeSlideIndex = idx;
        renderCarouselView(data);
      });
      filmstrip.appendChild(thumbBtn);
    });
    modalGrid.appendChild(filmstrip);

    const counter = document.createElement("div");
    counter.className =
      "mt-3 text-[11px] text-text-secondary font-bold uppercase tracking-widest";
    counter.innerText = `${activeSlideIndex + 1} of ${totalSlides}`;
    modalGrid.appendChild(counter);
  };

  const renderActiveView = () => {
    if (!currentActiveData) return;
    if (counterBadge) {
      counterBadge.innerText = `${currentActiveData.subs.length} Previews`;
    }
    if (viewGridBtn && viewCarouselBtn) {
      if (currentViewMode === "grid") {
        viewGridBtn.className =
          "px-3 py-1 rounded-md bg-[#2196F3] text-white font-semibold transition-all shadow-sm cursor-pointer";
        viewCarouselBtn.className =
          "px-3 py-1 rounded-md text-text-secondary hover:text-white font-medium transition-all cursor-pointer";
      } else {
        viewCarouselBtn.className =
          "px-3 py-1 rounded-md bg-[#2196F3] text-white font-semibold transition-all shadow-sm cursor-pointer";
        viewGridBtn.className =
          "px-3 py-1 rounded-md text-text-secondary hover:text-white font-medium transition-all cursor-pointer";
      }
    }
    if (currentViewMode === "grid") {
      renderGridView(currentActiveData);
    } else {
      renderCarouselView(currentActiveData);
    }
  };

  if (viewGridBtn) {
    viewGridBtn.addEventListener("click", () => {
      currentViewMode = "grid";
      renderActiveView();
    });
  }
  if (viewCarouselBtn) {
    viewCarouselBtn.addEventListener("click", () => {
      currentViewMode = "carousel";
      renderActiveView();
    });
  }

  // Open modal on project card click
  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });

    card.addEventListener("click", () => {
      const id = card.dataset.project;
      const data =
        (window.PORTFOLIO_PROJECTS && window.PORTFOLIO_PROJECTS[id]) ||
        projectsData[id];
      if (!data || !modalTitle || !modalGrid || !modal) return;

      focusedElementBeforeModal = document.activeElement;
      modalTitle.innerText = data.title;
      currentActiveData = data;
      currentViewMode = "grid"; // Default to grid so all previews are immediately visible
      activeSlideIndex = 0;

      renderActiveView();

      modal.classList.add("opacity-100", "pointer-events-auto");
      setTimeout(() => {
        if (modalContainer)
          modalContainer.classList.replace("scale-95", "scale-100");
        const closeBtn = document.getElementById("modal-close");
        if (closeBtn) closeBtn.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    });
  });

  closeMdl = () => {
    if (modalContainer)
      modalContainer.classList.replace("scale-100", "scale-95");
    if (modal) modal.classList.remove("opacity-100", "pointer-events-auto");

    setTimeout(() => {
      if (modalGrid) modalGrid.innerHTML = "";
      currentActiveData = null;
    }, 300);
    document.body.style.overflow = "";
    if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
  };

  const modalCloseBtn = document.getElementById("modal-close");
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeMdl);
  if (modal)
    modal.addEventListener("click", (e) => e.target === modal && closeMdl());

  document.addEventListener("keydown", (e) => {
    if (modal && modal.classList.contains("opacity-100")) {
      if (e.key === "Escape") {
        closeMdl();
      }
    }
  });
}
