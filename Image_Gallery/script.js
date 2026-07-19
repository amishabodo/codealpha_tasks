document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let activeVisibleItems = [...galleryItems];
  let currentIndex = 0;

  /* ==========================================================================
     A. Category Filtering Logic
     ========================================================================== */
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Manage visually active filter chip UI
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Toggles visibility filters on structural card item blocks
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      // Synchronize index loop options by assessing only visible elements
      activeVisibleItems = galleryItems.filter(item => !item.classList.contains('hidden'));
    });
  });

  /* ==========================================================================
     B. Lightbox Mechanics
     ========================================================================== */
  function openLightbox(index) {
    currentIndex = index;
    const targetItem = activeVisibleItems[currentIndex];
    const imgElement = targetItem.querySelector('img');
    
    const fullSrc = imgElement.getAttribute('data-full') || imgElement.src;
    const altText = imgElement.alt;

    lightboxImg.src = fullSrc;
    lightboxCaption.textContent = altText;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock desktop frame layout scroll
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Release layout scroll
    setTimeout(() => { lightboxImg.src = ''; }, 300); // Prevent flicker transitions on next toggle
  }

  function navigateLightbox(direction) {
    if (activeVisibleItems.length <= 1) return;
    
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % activeVisibleItems.length;
    } else if (direction === 'prev') {
      currentIndex = (currentIndex - 1 + activeVisibleItems.length) % activeVisibleItems.length;
    }
    
    openLightbox(currentIndex);
  }

  // Add click listeners to items based on active visibility filters
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const visibleIndex = activeVisibleItems.indexOf(item);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
  });

  // Dynamic Control Button Map Events
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox('next'); });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox('prev'); });

  // Close lightbox if clicking outside the image container boundaries
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Accessibility System Mappings (Keyboard Controls)
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
  });
});