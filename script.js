(function () {
  "use strict";

  /* ---------- Header: muda de aparência ao rolar ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 64) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var menuIconOpen = document.getElementById("menuIconOpen");
  var menuIconClose = document.getElementById("menuIconClose");
  var menuOpen = false;

  function setMenuOpen(open) {
    menuOpen = open;
    mobileNav.hidden = !open;
    menuIconOpen.classList.toggle("icon-hidden", open);
    menuIconClose.classList.toggle("icon-hidden", !open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (open || window.scrollY > 64) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }

  menuToggle.addEventListener("click", function () {
    setMenuOpen(!menuOpen);
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  /* ---------- Hero: entrada animada assim que a página carrega ---------- */
  var heroMedia = document.getElementById("heroMedia");
  var heroVideo = document.getElementById("heroVideo");
  var heroContent = document.getElementById("heroContent");

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroMedia.classList.add("hero-zoom");
      heroVideo.classList.add("is-ready");
      heroContent.classList.add("is-ready");
    });
  });

  /* ---------- Scroll-reveal (IntersectionObserver) ---------- */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Galeria / Lightbox ---------- */
  var gallery = Array.prototype.map.call(
    document.querySelectorAll(".gallery-item"),
    function (button) {
      var img = button.querySelector("img");
      return { src: img.getAttribute("src"), alt: img.getAttribute("alt") };
    }
  );

  var lightbox = document.getElementById("lightbox");
  var lbImage = document.getElementById("lbImage");
  var lbCounter = document.getElementById("lbCounter");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var currentIndex = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    currentIndex = null;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function renderLightbox() {
    var item = gallery[currentIndex];
    lbImage.setAttribute("src", item.src);
    lbImage.setAttribute("alt", item.alt);
    lbCounter.textContent = pad(currentIndex + 1) + " / " + pad(gallery.length);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    renderLightbox();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % gallery.length;
    renderLightbox();
  }

  document.querySelectorAll(".gallery-item").forEach(function (button) {
    button.addEventListener("click", function () {
      openLightbox(Number(button.getAttribute("data-index")));
    });
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", showPrev);
  lbNext.addEventListener("click", showNext);

  document.addEventListener("keydown", function (event) {
    if (currentIndex === null) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") showNext();
    if (event.key === "ArrowLeft") showPrev();
  });
})();
