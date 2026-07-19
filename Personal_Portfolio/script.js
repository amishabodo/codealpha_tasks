document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     A. Mobile Toggle Menu Controls
     ========================================================================== */
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Automatically drop menu overlays on picking structural page anchors
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     B. Intersection Observer for Scroll Animation Displays
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop tracking target after completing initial entrance presentation
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
});