document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // 🎵 MUSIC TOGGLE FIX
  // ================================
  const audioToggle = document.getElementById("audio-toggle");
  const audioElement = document.getElementById("audioElement");

  if (audioToggle && audioElement) {
    audioToggle.addEventListener("change", () => {
      if (audioToggle.checked) {
        audioElement.play().catch(err => {
          console.log("Autoplay blocked:", err);
        });
      } else {
        audioElement.pause();
      }
    });
  }

  // ================================
  // GLOBAL VARIABLES
  // ================================
  let currentIndex = 0;
  let isScrolling = false;

  const panels = document.querySelectorAll(".panel");
  const dotsContainer = document.querySelector(".dots");

  // ================================
  // DOTS (MAX 10)
  // ================================
  const maxDots = 10;
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
  // LOAD BACKGROUNDS
  // ================================
  panels.forEach(panel => {
    const bg = panel.getAttribute("data-bg");

    if (bg) {
      panel.style.backgroundImage = `url("${bg}")`;
      panel.style.backgroundSize = "cover";
      panel.style.backgroundPosition = "center";
      panel.style.backgroundRepeat = "no-repeat";
    }
  });

  // ================================
  // ✨ TEXT ANIMATION FUNCTION
  // ================================
  function animateText(panel) {
    const title = panel.querySelector(".scroll-text");
    const secondary = panel.querySelector(".scroll-text-secondary");

    if (!title) return;

    // Reset animation
    title.innerHTML = "";
    secondary?.classList.remove("visible");

    const text = title.dataset.text;
    if (!text) return;

    // Split letters
    title.innerHTML = text
      .split("")
      .map(letter =>
        `<span>${letter === " " ? "&nbsp;" : letter}</span>`
      )
      .join("");

    const spans = title.querySelectorAll("span");

    // Animate letters
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add("visible");
      }, i * 50);
    });

    // Animate secondary after title
    if (secondary) {
      setTimeout(() => {
        secondary.classList.add("visible");
      }, spans.length * 50 + 300);
    }
  }

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

    // Trigger text animation
    animateText(panels[index]);
  }

  // ================================
  // INIT FIRST SLIDE
  // ================================
  showSlide(currentIndex);

  // ================================
  // ONE SCROLL = ONE SLIDE
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
    }, 1000);
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
  // BUTTON NAVIGATION
  // ================================
  const nextButtons = document.querySelectorAll(".next-btn");

  nextButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentIndex =
        currentIndex < panels.length - 1 ? currentIndex + 1 : 0;

      showSlide(currentIndex);
    });
  });

});
