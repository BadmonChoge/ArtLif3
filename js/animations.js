const initAnimations = () => {
  if (document.body.classList.contains('subpage')) return;

  // DOM Elements
  const elements = {
    hero: document.querySelector('.hero'),
    menuBar: document.querySelector('.menu-bar'),
    skyline: document.querySelector('.skyline-container'),
    hoverText: document.getElementById('hover-text'),
    art: document.querySelector('.word.art'),
    life: document.querySelector('.word.life'),
    searchIconContainer: document.getElementById('search-icon-container'),
    titleContainer: document.querySelector('.title-container'),
    navItems: document.querySelectorAll('.menu-row a')
  };

  // Enhanced Typewriter with Line Balancing
  class Typewriter {
    constructor() {
      this.timer = null;
      this.element = null;
      this.fullText = '';
      this.currentText = '';
      this.speed = 30;
      this.isTyping = false;
      this.animationStart = 0;
    }

    // New method to balance text lines
    balanceLines(text) {
      if (!this.element) return text;
      
      // Create a test span to measure words
      const testSpan = document.createElement('span');
      testSpan.style.visibility = 'hidden';
      testSpan.style.position = 'absolute';
      testSpan.style.whiteSpace = 'nowrap';
      testSpan.style.font = window.getComputedStyle(this.element).font;
      document.body.appendChild(testSpan);
      
      const words = text.split(' ');
      const lines = [];
      let currentLine = [];
      let currentWidth = 0;
      const maxWidth = this.element.offsetWidth * 0.9; // 90% of container width
      
      words.forEach(word => {
        testSpan.textContent = word;
        const wordWidth = testSpan.offsetWidth;
        
        if (currentWidth + wordWidth > maxWidth && currentLine.length > 0) {
          lines.push(currentLine.join(' '));
          currentLine = [word];
          currentWidth = wordWidth;
        } else {
          currentLine.push(word);
          currentWidth += wordWidth + 5; // Add space width
        }
      });
      
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
      }
      
      document.body.removeChild(testSpan);
      return lines.join('<br>');
    }

    start(element, text, speed = 30) {
      this.stop();
      this.element = element;
      this.fullText = this.balanceLines(text);
      this.currentText = '';
      this.speed = speed;
      this.isTyping = true;
      this.animationStart = performance.now();
      
      this.element.innerHTML = '';
      this.element.style.visibility = 'visible';
      this.type();
    }

    type() {
      if (!this.isTyping) return;

      const elapsed = performance.now() - this.animationStart;
      const targetChars = Math.floor(elapsed / this.speed);

      if (targetChars > this.fullText.length) {
        this.stop();
        return;
      }

      const newText = this.fullText.substring(0, targetChars);
      
      if (newText !== this.currentText) {
        this.currentText = newText;
        // Use textContent for measurement, then innerHTML for rendering
        this.element.textContent = this.currentText.replace(/<br>/g, '\n');
        const measuredText = this.balanceLines(this.element.textContent);
        this.element.innerHTML = measuredText;
        void this.element.offsetHeight; // Force reflow
      }

      if (targetChars < this.fullText.length) {
        this.timer = requestAnimationFrame(() => this.type());
      } else {
        this.isTyping = false;
      }
    }

    stop() {
      if (this.timer) {
        cancelAnimationFrame(this.timer);
        this.timer = null;
      }
      if (this.element && this.fullText) {
        this.element.innerHTML = this.balanceLines(this.fullText);
      }
      this.isTyping = false;
    }
  }

  // Create typewriter instance
  const typewriter = new Typewriter();

  // Animation Sequences
  const startLogoAnimation = () => {
    elements.art.style.animation = 'none';
    elements.life.style.animation = 'none';
    void elements.art.offsetWidth;
    elements.art.style.animation = 'slideInLeft 1.5s forwards';
    elements.life.style.animation = 'slideInRight 1.5s forwards';
  };

  const handleLifeAnimationEnd = () => {
    document.body.classList.add('shrink');
    
    setTimeout(() => {
      elements.menuBar.classList.add('visible', 'fade-in');
      elements.skyline.classList.add('visible', 'fade-in');
      elements.searchIconContainer.classList.add('visible', 'fade-in');
      
      setTimeout(() => {
        elements.hoverText.classList.add('fade-in');
        typewriter.start(elements.hoverText, "Welcome to ArtLife Group where we help turn an idea into a reality");
      }, 300);
    }, 500);
  };

  // Navigation Interactions
  const setupNavInteractions = () => {
    let currentHoverItem = null;

    elements.navItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        if (!item.dataset.text) return;
        
        currentHoverItem = item;
        typewriter.start(elements.hoverText, item.dataset.text);
      });

      item.addEventListener('mouseleave', () => {
        if (currentHoverItem === item) {
          typewriter.start(elements.hoverText, "Welcome to ArtLife Group where we help turn an idea into a reality");
          currentHoverItem = null;
        }
      });
    });
  };

  // Initialize
  startLogoAnimation();
  elements.life.addEventListener('animationend', handleLifeAnimationEnd);
  setupNavInteractions();

  // Window resize handler to rebalance text
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (typewriter.element && typewriter.fullText) {
        typewriter.element.innerHTML = typewriter.balanceLines(typewriter.fullText.replace(/<br>/g, ' '));
      }
    }, 100);
  });

  return {
    typeWriter: (element, text) => typewriter.start(element, text)
  };
};