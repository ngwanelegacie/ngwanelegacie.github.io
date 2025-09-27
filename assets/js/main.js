// Brittany Chiang-inspired Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 100; // Height of fixed header
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to current navigation item based on scroll position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let current = '';
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Update navigation on scroll
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation(); // Initialize

    // Fade in animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections and other elements for fade-in animation
    const elementsToObserve = document.querySelectorAll('section, .project, .skills-list li');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });

    // Logo hover effect
    const logo = document.querySelector('.nav-logo a');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-4px, -4px)';
            this.style.boxShadow = '4px 4px 0 0 var(--green)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }

    // Add subtle hover effects to project cards
    const projectCards = document.querySelectorAll('.project');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const projectImage = this.querySelector('.project-image');
            if (projectImage) {
                projectImage.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const projectImage = this.querySelector('.project-image');
            if (projectImage) {
                projectImage.style.transform = '';
            }
        });
    });

    // Typing animation for hero title (optional)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing animation for hero subtitle (optional - can be disabled)
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        // Uncomment the next line to enable typing effect
        // typeWriter(heroSubtitle, originalText, 80);
    }

    // Email link hover effect
    const emailLink = document.querySelector('.email-link a');
    if (emailLink) {
        emailLink.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.color = 'var(--green)';
        });
        
        emailLink.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.color = 'var(--light-slate)';
        });
    }

    // Social links hover effects
    const socialLinks = document.querySelectorAll('.social-links-fixed a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.color = 'var(--green)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.color = 'var(--light-slate)';
        });
    });

    // Dynamic header behavior on scroll
    const header = document.querySelector('.header');
    const socialLinksFixed = document.querySelector('.social-links-fixed');
    const emailLinkContainer = document.querySelector('.email-link');
    
    let lastScrollTop = 0;
    const scrollThreshold = 100; // Minimum scroll distance before hiding header
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            
            // Change background opacity based on scroll position
            if (scrolled > 50) {
                header.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'rgba(10, 25, 47, 0.85)';
                header.style.backdropFilter = 'blur(10px)';
            }
            
            // Dynamic header hide/show behavior
            if (scrolled > scrollThreshold) {
                if (scrolled > lastScrollTop && scrolled > scrollThreshold) {
                    // Scrolling down - hide header
                    header.classList.add('header-hidden');
                } else if (scrolled < lastScrollTop) {
                    // Scrolling up - show header
                    header.classList.remove('header-hidden');
                }
            } else {
                // Always show header when near top of page
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrolled;
            
            // Make side elements more dynamic based on scroll
            if (scrolled > 100) {
                if (socialLinksFixed) socialLinksFixed.classList.add('scrolled');
                if (emailLinkContainer) emailLinkContainer.classList.add('scrolled');
            } else {
                if (socialLinksFixed) socialLinksFixed.classList.remove('scrolled');
                if (emailLinkContainer) emailLinkContainer.classList.remove('scrolled');
            }
        });
    }

    // Button hover effects
    const buttons = document.querySelectorAll('.button, .cta-button, .contact-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--green-tint)';
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.transform = '';
        });
    });

    // Project links hover effects
    const projectLinks = document.querySelectorAll('.project-links a');
    projectLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--green)';
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = 'var(--lightest-slate)';
            this.style.transform = '';
        });
    });

    // Footer social links hover effects (for mobile)
    const footerSocialLinks = document.querySelectorAll('.footer-social a');
    footerSocialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--green)';
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = 'var(--light-slate)';
            this.style.transform = '';
        });
    });

    // Show More Projects functionality
    const showMoreBtn = document.querySelector('.show-more-btn');
    const additionalProjects = document.querySelector('#additional-projects');
    
    if (showMoreBtn && additionalProjects) {
        showMoreBtn.addEventListener('click', function() {
            if (additionalProjects.classList.contains('show')) {
                // Hide additional projects
                additionalProjects.classList.remove('show');
                showMoreBtn.textContent = 'Show More';
                
                // Smooth scroll to projects section
                document.querySelector('.other-projects-title').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } else {
                // Show additional projects
                additionalProjects.classList.add('show');
                showMoreBtn.textContent = 'Show Less';
                
                // Small delay to allow for animation, then scroll
                setTimeout(() => {
                    showMoreBtn.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            }
        });
    }

    // Initialize any additional animations or effects
    console.log('Brittany Chiang-inspired portfolio loaded successfully!');
});

// Preloader (optional)
window.addEventListener('load', function() {
    document.body.classList.remove('loading');
});

// Add loading class initially (optional)
document.body.classList.add('loading');

// Remove loading class after a short delay
setTimeout(() => {
    document.body.classList.remove('loading');
}, 100);