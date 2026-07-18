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
