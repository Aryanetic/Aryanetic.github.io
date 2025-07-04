// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    });

    // Initialize intersection observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar background change on scroll with smooth transition
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Enhanced wave animation for the hand emoji
    const waveEmoji = document.querySelector('.wave');
    if (waveEmoji) {
        setInterval(() => {
            waveEmoji.classList.add('animate-wave');
            setTimeout(() => {
                waveEmoji.classList.remove('animate-wave');
            }, 1000);
        }, 3000);
    }

    // Enhanced project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add hover effects to buttons
    document.querySelectorAll('.hero-btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add hover effects to social links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Handle dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const content = dropdown.querySelector('.dropdown-content');
        
        // Change to click for mobile-friendly behavior
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    const submenu = d.querySelector('.submenu');
                    if (submenu) submenu.classList.remove('active');
                }
            });
            
            dropdown.classList.toggle('active');
        });
    });

    // Handle submenus - change to click for better mobile support
    const submenuLinks = document.querySelectorAll('.has-submenu');
    submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const submenu = link.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.classList.toggle('active');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const submenu = dropdown.querySelector('.submenu');
                if (submenu) submenu.classList.remove('active');
            });
        }
    });

    // Loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => loadingOverlay.style.display = 'none', 500);
        }, 500);
    }

    // Progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / windowHeight) * 100;
            progressBar.style.transform = `scaleX(${progress / 100})`;
        });
    }

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Animate elements
    const animateElements = () => {
        // Animate tags
        document.querySelectorAll('.tag').forEach((tag, index) => {
            tag.style.animation = `fadeInRight 0.5s ease forwards ${index * 0.2}s`;
        });

        // Animate feature cards
        document.querySelectorAll('.feature-item').forEach((card, index) => {
            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.2}s`;
            
            // Add hover effect for icons
            const icon = card.querySelector('i');
            if (icon) {
                card.addEventListener('mouseenter', () => {
                    icon.style.transform = 'scale(1.2) rotate(360deg)';
                    icon.style.transition = 'transform 0.4s ease';
                });
                card.addEventListener('mouseleave', () => {
                    icon.style.transform = 'scale(1) rotate(0)';
                });
            }
        });

        // Animate result numbers
        document.querySelectorAll('.result-number').forEach((number, index) => {
            const finalValue = parseInt(number.textContent);
            let currentValue = 0;
            const duration = 2000;
            const interval = 50;
            const steps = duration / interval;
            const increment = finalValue / steps;

            number.textContent = '0%';
            number.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.2}s`;

            setTimeout(() => {
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(counter);
                    }
                    number.textContent = Math.round(currentValue) + '%';
                }, interval);
            }, index * 200);
        });
    };

    // Run animations
    animateElements();

    // Add scroll reveal effect for sections
    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.content-section').forEach(section => {
        contentObserver.observe(section);
    });
});

// Enhanced animate elements on scroll with different animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target.classList.contains('project-card')) {
                entry.target.style.transitionDelay = '0.2s';
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with different animation classes
document.querySelectorAll('.project-card').forEach((el, index) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
});

document.querySelectorAll('.about-content').forEach(el => {
    el.classList.add('fade-in-right');
    observer.observe(el);
});

document.querySelectorAll('.contact-content').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Add enhanced CSS animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-up {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fade-in-right {
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fade-in {
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate {
            opacity: 1;
            transform: translate(0);
        }
        
        @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
            60% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
        }
        
        .animate-wave {
            animation: wave 1s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-block;
            transform-origin: 70% 70%;
        }
        
        .project-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .project-overlay i {
            color: white;
            font-size: 2rem;
            transform: scale(0.8);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .project-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .project-card:hover .project-overlay i {
            transform: scale(1.1) rotate(180deg);
        }
        
        .hero-buttons {
            margin-top: 2rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .hero-btn {
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            position: relative;
            overflow: hidden;
        }
        
        .hero-btn:first-child {
            background: var(--gradient-1);
            color: white;
            box-shadow: var(--shadow-1);
        }
        
        .hero-btn.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hero-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-2);
        }
        
        .hero-btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s ease, height 0.6s ease;
        }
        
        .hero-btn:hover::after {
            width: 300px;
            height: 300px;
        }
        
        /* Add pulse animation to social links */
        .social-link {
            position: relative;
        }
        
        .social-link::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: currentColor;
            border-radius: 50%;
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
            transition: all 0.3s ease;
        }
        
        .social-link:hover::after {
            animation: pulse 1s ease-out;
        }
        
        @keyframes pulse {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0.5;
            }
            100% {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Add scroll-triggered animations for section titles
const sectionTitles = document.querySelectorAll('.section-title');
sectionTitles.forEach(title => {
    title.style.opacity = '0';
    title.style.transform = 'translateY(20px)';
    
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
                title.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    }, { threshold: 0.5 });
    
    titleObserver.observe(title);
});

// Project page animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate sections on scroll
    const projectSections = document.querySelectorAll('.project-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate list items
                const listItems = entry.target.querySelectorAll('li');
                listItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 200 * (index + 1));
                });
            }
        });
    }, {
        threshold: 0.1
    });

    projectSections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for navigation links
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

    // Project banner hover effect
    const projectBanner = document.querySelector('.project-banner');
    if (projectBanner) {
        projectBanner.addEventListener('mouseenter', () => {
            projectBanner.style.transform = 'scale(1.02)';
        });

        projectBanner.addEventListener('mouseleave', () => {
            projectBanner.style.transform = 'scale(1)';
        });
    }
});

// Skills section animations
document.addEventListener('DOMContentLoaded', function() {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate skill progress bars
                const skillBars = entry.target.querySelectorAll('.skill-level');
                skillBars.forEach(bar => {
                    const level = bar.dataset.level;
                    const progress = bar.querySelector('.skill-progress');
                    setTimeout(() => {
                        progress.style.width = `${level}%`;
                    }, 200);
                });

                // Animate skill cards with delay
                const cards = entry.target.querySelectorAll('.skill-card');
                cards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 100}ms`;
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100 * index);
                });
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.skills-category').forEach(category => {
        skillsObserver.observe(category);
    });
});

// Remove any typing animation for the name
document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing typing animation
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        logoText.style.animation = 'none';
    }
    
    // Remove any cursor elements
    const cursors = document.querySelectorAll('.cursor, .typed-cursor');
    cursors.forEach(cursor => cursor.remove());
}); 