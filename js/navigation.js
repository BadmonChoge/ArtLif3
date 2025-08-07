const initNavigation = (animations) => {
  // DOM Elements
  const elements = {
    menuRow: document.querySelector('.menu-row'),
    hoverText: document.getElementById('hover-text'),
    navItems: document.querySelectorAll('.menu-row a'),
    searchIcon: document.getElementById('search-icon'),
    subpageSearchIcon: document.getElementById('subpage-search-icon'),
    searchOverlay: document.getElementById('search-overlay'),
    closeSearch: document.querySelector('.close-search'),
    hero: document.querySelector('.hero'),
    menuBar: document.querySelector('.menu-bar'),
    skyline: document.querySelector('.skyline-container'),
    searchInput: document.querySelector('#search-input')
  };

  // State variables
  let lastScrollY = window.scrollY;
  let ticking = false;
  let isSearchOpen = false;

  /**
   * Handle scroll events for header elements
   */
  const handleScroll = () => {
    const currentY = window.scrollY;
    const scrollDown = currentY > lastScrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (scrollDown && currentY > 100) {
          elements.menuRow?.classList.remove('fade-in');
          elements.menuRow?.classList.add('fade-out');
          elements.hoverText?.classList.remove('fade-in');
          elements.hoverText?.classList.add('fade-out');
          elements.skyline?.classList.remove('fade-in');
          elements.skyline?.classList.add('fade-out');
        } else if (currentY < 80) {
          elements.menuRow?.classList.remove('fade-out');
          elements.menuRow?.classList.add('fade-in');
          elements.hoverText?.classList.remove('fade-out');
          elements.hoverText?.classList.add('fade-in');
          elements.skyline?.classList.remove('fade-out');
          elements.skyline?.classList.add('fade-in');
        }

        lastScrollY = currentY;
        ticking = false;
      });

      ticking = true;
    }
  };

  /**
   * Search functionality
   */
  const handleSearch = {
    open: (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      isSearchOpen = true;
      elements.searchOverlay?.classList.add('active');
      elements.searchOverlay?.setAttribute('aria-hidden', 'false');
      elements.searchInput?.focus();
      
      // Disable transitions temporarily
      if (elements.hero) elements.hero.style.transition = 'none';
      if (elements.menuBar) elements.menuBar.style.transition = 'none';
      if (elements.skyline) elements.skyline.style.transition = 'none';
    },
    close: () => {
      isSearchOpen = false;
      elements.searchOverlay?.classList.remove('active');
      elements.searchOverlay?.setAttribute('aria-hidden', 'true');
      
      // Re-enable transitions after a short delay
      setTimeout(() => {
        if (elements.hero) elements.hero.style.transition = 'opacity 0.4s ease-out';
        if (elements.menuBar) elements.menuBar.style.transition = 'opacity 0.4s ease-out';
        if (elements.skyline) elements.skyline.style.transition = 'opacity 0.4s ease-out';
      }, 50);
    }
  };

  /**
   * Initialize subpage search functionality
   */
  const initSubpageSearch = () => {
    if (!elements.subpageSearchIcon || !elements.searchOverlay) return;
    elements.subpageSearchIcon.addEventListener('click', handleSearch.open);
  };

  /**
   * Set active navigation link based on current page
   */
  const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href').split('/').pop();
      if (currentPage === linkPage || 
          (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  /**
   * Initialize all event listeners
   */
  const initEventListeners = () => {
    // Navigation items hover/focus
    elements.navItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        if (animations?.typeWriter) {
          animations.typeWriter(elements.hoverText, item.dataset.text);
        }
      });

      item.addEventListener('mouseleave', () => {
        if (animations?.typeWriter) {
          animations.typeWriter(elements.hoverText, "Welcome to ArtLife");
        }
      });

      item.addEventListener('focus', () => {
        if (animations?.typeWriter) {
          animations.typeWriter(elements.hoverText, item.dataset.text);
        }
      });

      item.addEventListener('blur', () => {
        if (animations?.typeWriter) {
          animations.typeWriter(elements.hoverText, "Welcome to ArtLife");
        }
      });
    });

    // Search functionality
    if (elements.searchIcon) {
      elements.searchIcon.addEventListener('click', handleSearch.open);
    }
    
    if (elements.closeSearch) {
      elements.closeSearch.addEventListener('click', handleSearch.close);
    }
    
    if (elements.searchOverlay) {
      elements.searchOverlay.addEventListener('click', (e) => {
        if (e.target === elements.searchOverlay) {
          handleSearch.close();
        }
      });
    }

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        handleSearch.close();
      }
    });

    // Scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection Observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
  };

  // Initialize everything
  const init = () => {
    setActiveNavLink();
    initEventListeners();
    
    // Initialize subpage search if on subpage
    if (document.body.classList.contains('subpage')) {
      initSubpageSearch();
    }
  };

  return {
    init,
    handleSearch
  };
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Initialize animations first
  const animations = typeof initAnimations === 'function' ? initAnimations() : null;
  
  // Then initialize navigation
  if (typeof initNavigation === 'function') {
    initNavigation(animations).init();
  }
  
  // Reset scroll position to top
  window.scrollTo(0, 0);
});

// Reset on beforeunload
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});





console.log('Subpage search icon:', elements.subpageSearchIcon);
console.log('Search overlay:', elements.searchOverlay);