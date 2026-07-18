(() => {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-site-nav]");
  const mobileQuery = window.matchMedia("(max-width: 48rem)");

  const setMenuOpen = (open) => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.hidden = mobileQuery.matches ? !open : false;
    document.body.classList.toggle("menu-open", open && mobileQuery.matches);
  };

  if (menuButton && navigation) {
    setMenuOpen(false);

    menuButton.addEventListener("click", () => {
      setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a") && mobileQuery.matches) setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        menuButton.focus();
      }
    });

    mobileQuery.addEventListener("change", () => setMenuOpen(false));
  }

  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
    const previous = gallery.querySelector("[data-gallery-previous]");
    const next = gallery.querySelector("[data-gallery-next]");
    const count = gallery.querySelector("[data-gallery-count]");
    const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-thumb]"));
    let activeIndex = 0;
    let autoplayTimer;

    const showSlide = (index, announce = true) => {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      slides.forEach((slide, slideIndex) => {
        slide.hidden = slideIndex !== activeIndex;
      });
      thumbs.forEach((thumb, thumbIndex) => {
        thumb.setAttribute("aria-current", String(thumbIndex === activeIndex));
      });
      if (previous) previous.disabled = activeIndex === 0;
      if (next) next.disabled = activeIndex === slides.length - 1;
      if (count) {
        count.textContent = `${activeIndex + 1} / ${slides.length}`;
        count.setAttribute("aria-live", announce ? "polite" : "off");
      }
    };

    previous?.addEventListener("click", () => showSlide(activeIndex - 1));
    next?.addEventListener("click", () => showSlide(activeIndex + 1));
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => showSlide(index));
    });

    gallery.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(activeIndex + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        showSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        showSlide(slides.length - 1);
      }
    });

    showSlide(0, false);

    if (
      gallery.hasAttribute("data-gallery-autoplay") &&
      slides.length > 1 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const stopAutoplay = () => window.clearInterval(autoplayTimer);
      const startAutoplay = () => {
        stopAutoplay();
        autoplayTimer = window.setInterval(() => {
          showSlide((activeIndex + 1) % slides.length, false);
        }, 5000);
      };
      gallery.addEventListener("pointerenter", stopAutoplay);
      gallery.addEventListener("pointerleave", startAutoplay);
      gallery.addEventListener("focusin", stopAutoplay);
      gallery.addEventListener("focusout", startAutoplay);
      startAutoplay();
    }
  });

  document.querySelectorAll("[data-strip-carousel]").forEach((carousel) => {
    const viewport = carousel.querySelector("[data-strip-viewport]");
    const previous = carousel.querySelector("[data-strip-previous]");
    const next = carousel.querySelector("[data-strip-next]");
    const status = carousel.querySelector("[data-strip-status]");
    const slides = Array.from(carousel.querySelectorAll(".media-carousel__slide"));
    if (!viewport || !slides.length) return;

    const dimensions = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const track = slides[0].parentElement;
      const gap = track ? parseFloat(getComputedStyle(track).columnGap) || 0 : 0;
      const step = slideWidth + gap;
      const visible = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
      return { step, visible };
    };

    const update = () => {
      const { step, visible } = dimensions();
      const index = step ? Math.round(viewport.scrollLeft / step) : 0;
      const lastVisible = Math.min(slides.length, index + visible);
      if (status) {
        status.textContent = `${index + 1}–${lastVisible} of ${slides.length}`;
      }
      if (previous) previous.disabled = index <= 0;
      if (next) next.disabled = lastVisible >= slides.length;
    };

    const move = (direction) => {
      const { step, visible } = dimensions();
      viewport.scrollBy({ left: direction * step * visible, behavior: "smooth" });
    };

    previous?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));
    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      } else if (event.key === "Home") {
        event.preventDefault();
        viewport.scrollTo({ left: 0, behavior: "smooth" });
      } else if (event.key === "End") {
        event.preventDefault();
        viewport.scrollTo({ left: viewport.scrollWidth, behavior: "smooth" });
      }
    });

    let scrollFrame;
    viewport.addEventListener("scroll", () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(update);
    });
    window.addEventListener("resize", update);
    update();
  });

  document.querySelectorAll("[data-masonry]").forEach((listing) => {
    const items = Array.from(listing.querySelectorAll("[data-masonry-item]"));
    if (!items.length) return;

    const layout = () => {
      const width = listing.clientWidth;
      const columnCount = width < 32 * 16 ? 1 : width < 48 * 16 ? 2 : 4;
      const gap = 12;
      const columnWidth = (width - gap * (columnCount - 1)) / columnCount;
      const heights = Array(columnCount).fill(0);

      items.forEach((item) => {
        item.style.width = `${columnWidth}px`;
      });
      items.forEach((item) => {
        const column = heights.indexOf(Math.min(...heights));
        item.style.transform = `translate(${column * (columnWidth + gap)}px, ${heights[column]}px)`;
        heights[column] += item.getBoundingClientRect().height + gap;
      });
      listing.style.height = `${Math.max(...heights, 0)}px`;
    };

    items.forEach((item) => {
      item.querySelectorAll("img").forEach((image) => {
        if (!image.complete) image.addEventListener("load", layout, { once: true });
      });
    });
    document.fonts?.ready.then(layout);
    window.addEventListener("resize", layout);
    window.requestAnimationFrame(layout);
  });

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    link.setAttribute("rel", Array.from(rel).join(" "));
  });

  const searchInput = document.querySelector("[data-site-search]");
  const searchItems = Array.from(document.querySelectorAll("[data-search-item]"));
  const searchStatus = document.querySelector("[data-search-status]");

  if (searchInput && searchStatus) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLocaleLowerCase();
      let visibleCount = 0;
      searchItems.forEach((item) => {
        const matches = item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      searchStatus.textContent = `${visibleCount} ${visibleCount === 1 ? "page" : "pages"}`;
    });
  }
})();
