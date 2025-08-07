// Main initialization script
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Ensure footer stays at bottom on resize
  window.addEventListener('resize', function() {
    document.body.style.minHeight = window.innerHeight + 'px';
  });

  // Reset scroll position to top
  window.scrollTo(0, 0);
  
  // Initialize animations first
  const animations = initAnimations();
  
  // Then initialize navigation with access to animations
  initNavigation(animations);
  
  document.addEventListener('DOMContentLoaded', () => {
    const logoLink = document.querySelector('.hero-link');

    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        const isLeftClick = e.button === 0;
        const noModifiers = !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;

        if (isLeftClick && noModifiers) {
          e.preventDefault(); // Stop default link behavior

          const homePath = '/';
          const isHome = window.location.pathname === homePath || window.location.pathname.endsWith('index.html');

          if (isHome) {
            // Force reload if already on homepage
            window.location.reload();
          } else {
            // Navigate home
            window.location.href = homePath;
          }
        }
      });
    }
  });

  // Reset on beforeunload
  window.addEventListener('beforeunload', () => {
    // Scroll to top before unloading
    window.scrollTo(0, 0);
  });

  document.getElementById("hamburger").addEventListener("click", function () {
    document.getElementById("mobile-nav").classList.add("open");
  });

  document.getElementById("close-btn").addEventListener("click", function () {
    document.getElementById("mobile-nav").classList.remove("open");
  });



});

