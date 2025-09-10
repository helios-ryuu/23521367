// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
    // Update navbar background immediately when theme changes
    updateNavbarBackground();
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Section Animation and Navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

// Adjust observer options for mobile
const isMobile = window.innerWidth <= 768;
const observerOptions = {
    threshold: isMobile ? 0.1 : 0.3, // Lower threshold for mobile
    rootMargin: isMobile ? '-50px 0px -50px 0px' : '-100px 0px -100px 0px' // Smaller margin for mobile
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate section
            entry.target.classList.add('visible');
            
            // Update active navigation link
            const targetId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Enhanced mobile observer that triggers when gap between sections is in middle of screen
if (isMobile) {
    const mobileVisibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            
            // Calculate if the section or gap between sections is in the middle area of viewport
            const isInMiddleArea = rect.top < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4;
            
            if (isInMiddleArea && !entry.target.classList.contains('visible')) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0],
        rootMargin: '0px'
    });
    
    sections.forEach(section => {
        mobileVisibilityObserver.observe(section);
    });
}

sections.forEach(section => {
    observer.observe(section);
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Function to update navbar background based on theme
function updateNavbarBackground() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (scrollTop > 100) {
        navbar.style.background = isDark 
            ? 'rgba(15, 15, 35, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = isDark 
            ? 'rgba(15, 15, 35, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Navbar Background on Scroll
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', updateNavbarBackground);

// Loading Screen
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
});

// Add hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add typing animation to hero title (optional enhancement)
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    setTimeout(typeWriter, 1500);
}

// Add random floating animation to skill items
document.querySelectorAll('.skill-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for better scroll performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events for better mobile performance
const throttledScrollHandler = throttle(() => {
    // Scroll optimizations
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Update scroll-to-top button visibility
    if (scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler, { passive: true });

// Accessibility: Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add focus management for better accessibility
document.querySelectorAll('.nav-link, .btn, .contact-item').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--accent-primary)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Progress Bar Animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 500);
    });
}

// Animate progress bars when skills section is visible
const skillsSection = document.querySelector('#skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Certificate ID Reveal Functionality
function toggleCertificateId(certId, button) {
    const certElement = document.getElementById(certId);
    if (certElement.classList.contains('visible')) {
        certElement.classList.remove('visible');
        button.innerHTML = '🔐 Reveal ID';
        button.classList.remove('revealed');
    } else {
        certElement.classList.add('visible');
        button.innerHTML = '✅ ID Revealed';
        button.classList.add('revealed');
    }
}

// Lazy Loading for Gallery - Updated to work with background images
const lazyLoadGallery = () => {
    const galleryItems = document.querySelectorAll('.gallery-item.lazy');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const loading = item.querySelector('.gallery-loading');
                
                // Remove loading indicator and add loaded class
                setTimeout(() => {
                    if (loading) loading.remove();
                    item.classList.remove('lazy');
                    item.classList.add('lazy-loaded');
                    
                    // Get image path from background-image style
                    const style = item.getAttribute('style');
                    const imagePath = style ? style.match(/url\(['"]?(.*?)['"]?\)/)?.[1] : null;
                    
                    // Add click event after loading
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLightbox(
                            item.dataset.title, 
                            item.dataset.description, 
                            imagePath,
                            {
                                place: item.dataset.place,
                                time: item.dataset.time,
                                content: item.dataset.content,
                                category: item.dataset.category
                            }
                        );
                    });
                    
                    observer.unobserve(item);
                }, Math.random() * 500 + 300); // Random delay between 300-800ms
            }
        });
    }, {
        rootMargin: '50px'
    });

    galleryItems.forEach(item => imageObserver.observe(item));
};

// Initialize lazy loading
lazyLoadGallery();

// Lightbox Functionality - Updated to display actual images and metadata
function openLightbox(title, description, imagePath, metadata = {}) {
    const lightbox = document.getElementById('lightbox');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxImage = document.getElementById('lightbox-image');
    
    // Update metadata elements
    const lightboxPlace = document.getElementById('lightbox-place');
    const lightboxTime = document.getElementById('lightbox-time');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxCategory = document.getElementById('lightbox-category');
    
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    
    // Update metadata with provided data or defaults
    if (lightboxPlace) lightboxPlace.textContent = metadata.place || 'Unknown';
    if (lightboxTime) lightboxTime.textContent = metadata.time || 'Unknown';
    if (lightboxContent) lightboxContent.textContent = metadata.content || 'Unknown';
    if (lightboxCategory) lightboxCategory.textContent = metadata.category || 'Unknown';
    
    // Display actual image instead of emoji
    if (imagePath) {
        lightboxImage.style.backgroundImage = `url(${imagePath})`;
        lightboxImage.style.backgroundSize = 'cover';
        lightboxImage.style.backgroundPosition = 'center';
        lightboxImage.style.backgroundRepeat = 'no-repeat';
        lightboxImage.textContent = ''; // Remove any text content
    } else {
        // Fallback if no image path
        lightboxImage.style.backgroundImage = 'none';
        lightboxImage.textContent = '🖼️';
    }
    
    // Store current scroll position BEFORE any changes
    const scrollY = window.scrollY;
    lightbox.dataset.scrollY = scrollY;
    
    // Prevent body scrolling with multiple methods for better mobile support
    document.body.classList.add('lightbox-active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Additional mobile scroll prevention - set position after storing scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.left = '0';
    
    // Show lightbox
    lightbox.classList.add('active');
}

function closeLightbox(event) {
    if (event && event.target !== document.getElementById('lightbox')) {
        return;
    }
    
    const lightbox = document.getElementById('lightbox');
    
    // Get stored scroll position
    const scrollY = lightbox.dataset.scrollY || '0';
    
    // Hide lightbox first
    lightbox.classList.remove('active');
    
    // Restore body scrolling
    document.body.classList.remove('lightbox-active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.left = '';
    
    // Restore scroll position immediately
    if (scrollY && scrollY !== '0') {
        window.scrollTo({
            top: parseInt(scrollY),
            left: 0,
            behavior: 'instant'
        });
    }
}

// Close lightbox with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Prevent touch scrolling on lightbox background
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('touchmove', function(e) {
            // Only prevent if touching the background, not the content
            if (e.target === lightbox) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent zoom on double tap
        lightbox.addEventListener('touchend', function(e) {
            if (e.target === lightbox) {
                e.preventDefault();
            }
        });
    }
});

// Add Book Card Hover Effects
document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Gallery Item Hover Effects
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(2deg)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Add smooth reveal animation for books
const bookCards = document.querySelectorAll('.book-card');
const bookObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200);
            bookObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

bookCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    bookObserver.observe(card);
});

// Add staggered animation for gallery items
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, index * 100);
            galleryObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    item.style.transition = 'all 0.5s ease';
    galleryObserver.observe(item);
});

// Mobile social button touch interactions
const socialLinks = document.querySelectorAll('.social-link');
let expandedButton = null;

// Function to collapse all social buttons
function collapseAllSocialButtons() {
    socialLinks.forEach(link => {
        link.classList.remove('expanded');
    });
    expandedButton = null;
}

// Check if device supports touch
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    // Add click handlers for mobile touch devices
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If this button is already expanded, let the link work normally
            if (this.classList.contains('expanded')) {
                return; // Allow navigation
            }
            
            // Prevent default link behavior for expansion
            e.preventDefault();
            
            // Collapse other buttons and expand this one
            collapseAllSocialButtons();
            this.classList.add('expanded');
            expandedButton = this;
        });
    });

    // Collapse buttons when scrolling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(collapseAllSocialButtons, 150);
    }, { passive: true });

    // Collapse buttons when touching outside
    document.addEventListener('touchstart', function(e) {
        const target = e.target.closest('.social-link');
        if (!target && expandedButton) {
            collapseAllSocialButtons();
        }
    }, { passive: true });

    // Collapse buttons when clicking outside (for devices that support both touch and mouse)
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.social-link');
        if (!target && expandedButton) {
            collapseAllSocialButtons();
        }
    });
}

console.log('Portfolio website loaded successfully! 🚀');