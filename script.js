document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // GLOBAL VARIABLES
  // ================================
  let currentIndex = 0;
  let isScrolling = false;

  const panels = document.querySelectorAll(".panel");
  const dotsContainer = document.querySelector(".dots");

  // ================================
  // AUTO-GENERATE DOTS (12+ Works)
  // ================================
  const maxDots = 11;
  const dotCount = Math.min(maxDots, panels.length);

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");

    if (i === 0) dot.classList.add("active");

    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll(".dot");

  // ================================
  // LOAD BACKGROUNDS FROM data-bg=""
  // ================================
  panels.forEach(panel => {
    const bg = panel.getAttribute("data-bg");

    if (bg) {
      console.log("Loading image:", bg);
      panel.style.backgroundImage = `url('${bg}')`;
    }
  });

  // ================================
  // SHOW ACTIVE SLIDE
  // ================================
  function showSlide(index) {

    panels.forEach(panel => panel.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    panels[index].classList.add("active");

    if (dots[index]) {
      dots[index].classList.add("active");
    }
  }

  // Start on Slide 0
  showSlide(currentIndex);

  // ================================
  // ONE SCROLL = ONE SLIDE (Peraton Style)
  // ================================
  window.addEventListener("wheel", (event) => {
    if (isScrolling) return;

    isScrolling = true;

    if (event.deltaY > 0) {
      currentIndex = Math.min(currentIndex + 1, panels.length - 1);
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    showSlide(currentIndex);

    setTimeout(() => {
      isScrolling = false;
    }, 1200);
  });

  // ================================
  // DOT CLICK NAVIGATION
  // ================================
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      currentIndex = parseInt(dot.dataset.index);
      showSlide(currentIndex);
    });
  });

  // ================================
  // BUTTON NAVIGATION (NEXT FRAME)
  // ================================
  const nextButtons = document.querySelectorAll(".next-btn");

  nextButtons.forEach(btn => {
    btn.addEventListener("click", () => {

      if (currentIndex < panels.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }

      showSlide(currentIndex);
    });
  });

  // ================================
  // SCROLL TEXT LETTER ANIMATION
  // ================================
  const textElements = document.querySelectorAll(".scroll-text");
  const secondaryText = document.querySelector(".scroll-text-secondary");

  textElements.forEach((textElement, index) => {

    const text = textElement.dataset.text;
    if (!text) return;

    // Split into letters
    textElement.innerHTML = text
      .split("")
      .map(letter => `<span>${letter === " " ? "&nbsp;" : letter}</span>`)
      .join("");

    // Observer animation
    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {
        if (entry.isIntersecting) {

          const letters = entry.target.querySelectorAll("span");

          letters.forEach((span, i) => {
            setTimeout(() => {
              span.classList.add("visible");
            }, i * 50);
          });

          // Secondary fade-in
          if (index === textElements.length - 1 && secondaryText) {
            setTimeout(() => {
              secondaryText.classList.add("visible");
            }, letters.length * 50 + 300);
          }

          observer.unobserve(entry.target);
        }
      });

    }, { threshold: 0.5 });

    observer.observe(textElement);

  });

});
