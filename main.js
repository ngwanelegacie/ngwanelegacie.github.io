/**
 * Portfolio main JavaScript file
 * Handles navigation, animations, and interactive elements
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initNavigation();
    initScrollReveal();
    initHamburgerMenu();
    initTypingAnimation();
    initSmoothScrolling();
    
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    let scrollDirection = 'up';
    let lastScrollTop = 0;
    
    // Handle navbar scroll behavior
    function handleNavScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > nav.offsetHeight) {
            // Scrolling down & past navbar height
            scrollDirection = 'down';
            nav.classList.add('hidden');
        } else {
            // Scrolling up
            scrollDirection = 'up';
            nav.classList.remove('hidden');
        }
        
        // Add scrolled class for styling
        if (scrollTop > 0) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavScroll();
                highlightActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Highlight active nav link based on scroll position
    function highlightActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - nav.offsetHeight - 50)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

/**
 * Hamburger menu functionality for mobile
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.navbar');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('is-active');
            document.body.classList.toggle('blur');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('is-active');
                document.body.classList.remove('blur');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && hamburger.classList.contains('is-active')) {
                hamburger.classList.remove('is-active');
                document.body.classList.remove('blur');
            }
        });
    }
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll-reveal animations
 */
function initScrollReveal() {
    // Check if elements are in viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and major elements
    const elementsToReveal = document.querySelectorAll('section, .project, .tab-panel');
    elementsToReveal.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add fade-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Typing animation for hero section
 */
function initTypingAnimation() {
    const typingElement = document.querySelector('.hero h3');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
}

/**
 * Tab functionality for experience section
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabList = document.querySelector('.tab-list');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            tabPanels[index].classList.add('active');
            
            // Update tab indicator position
            if (tabList && tabList.querySelector(':after')) {
                const tabHeight = 42; // --tab-height from CSS
                tabList.style.setProperty('--active-tab-index', index);
            }
        });
        
        // Keyboard navigation
        button.addEventListener('keydown', function(e) {
            let newIndex = index;
            
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                newIndex = index > 0 ? index - 1 : tabButtons.length - 1;
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                newIndex = index < tabButtons.length - 1 ? index + 1 : 0;
            }
            
            if (newIndex !== index) {
                tabButtons[newIndex].click();
                tabButtons[newIndex].focus();
            }
        });
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Add scroll-triggered animations with staggered delays
 */
function initStaggeredAnimations() {
    const staggerGroups = document.querySelectorAll('.skills-list li, .project-tech-list li');
    
    staggerGroups.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Initialize all tab functionality
 */
setTimeout(initTabs, 100);

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Handle focus trap for accessibility
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
        
        if (e.key === 'Escape') {
            // Close any open modals or menus
            document.body.classList.remove('blur');
            document.querySelector('.hamburger-menu')?.classList.remove('is-active');
        }
    });
}

/**
 * Initialize keyboard navigation
 */
function initKeyboardNavigation() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add keyboard navigation to project cards and other interactive elements
    const interactiveElements = document.querySelectorAll('.project-image a, .email-link, .resume-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
}

// Initialize keyboard navigation
initKeyboardNavigation();

/**
 * Add reduced motion support
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Remove animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Performance optimization: Preload critical resources
 */
function preloadResources() {
    const criticalImages = [
        'assets/images/profile-placeholder.svg',
        'assets/images/us-household-income-preview.jpg',
        'assets/images/world-life-expectancy-preview.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Preload resources when page loads
window.addEventListener('load', preloadResources);

// Add error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Portfolio script error:', e.message);
});