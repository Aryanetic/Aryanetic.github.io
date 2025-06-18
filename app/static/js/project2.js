// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Loading Animation
    const loadingOverlay = document.querySelector('.loading-overlay');
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 1000);

    // Scroll Progress Bar
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // Parallax Effect for Hero Section
    const heroSection = document.querySelector('.project-hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });

    // Animate Project Title
    const projectTitle = document.querySelector('.project-title');
    const titleText = projectTitle.textContent;
    projectTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < titleText.length) {
            projectTitle.textContent += titleText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    typeWriter();

    // Feature Cards Animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2
        });

        // Hover Effect
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.feature-icon'), {
                scale: 1.2,
                rotation: 10,
                duration: 0.3
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.feature-icon'), {
                scale: 1,
                rotation: 0,
                duration: 0.3
            });
        });
    });

    // Skills Animation
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        gsap.from(tag, {
            scrollTrigger: {
                trigger: tag,
                start: 'top bottom-=50',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1
        });

        // Count Up Animation
        const count = tag.getAttribute('data-count');
        if (count) {
            let current = 0;
            const increment = count / 50;
            const updateCount = () => {
                if (current < count) {
                    current += increment;
                    tag.textContent = Math.round(current) + '%';
                    requestAnimationFrame(updateCount);
                } else {
                    tag.textContent = count + '%';
                }
            };
            updateCount();
        }
    });

    // Tools Animation
    const toolTags = document.querySelectorAll('.tool-tag');
    toolTags.forEach((tag, index) => {
        gsap.from(tag, {
            scrollTrigger: {
                trigger: tag,
                start: 'top bottom-=50',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1
        });

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tool-tooltip';
        tooltip.textContent = tag.getAttribute('data-tooltip');
        tag.appendChild(tooltip);

        tag.addEventListener('mouseenter', () => {
            gsap.to(tooltip, {
                opacity: 1,
                y: -10,
                duration: 0.3
            });
        });

        tag.addEventListener('mouseleave', () => {
            gsap.to(tooltip, {
                opacity: 0,
                y: 0,
                duration: 0.3
            });
        });
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 70
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });

    // Section Navigation Dots
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');

    const updateActiveDot = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveDot);

    // Click Navigation Dots
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetSection,
                        offsetY: 70
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });

    // View Project Button Animation
    const viewProjectBtn = document.querySelector('.view-project-button');
    if (viewProjectBtn) {
        gsap.from(viewProjectBtn, {
            scrollTrigger: {
                trigger: viewProjectBtn,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8
        });

        viewProjectBtn.addEventListener('mouseenter', () => {
            gsap.to(viewProjectBtn, {
                scale: 1.05,
                duration: 0.3
            });
        });

        viewProjectBtn.addEventListener('mouseleave', () => {
            gsap.to(viewProjectBtn, {
                scale: 1,
                duration: 0.3
            });
        });
    }

    // Intersection Observer for Fade-in Elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Animate project sections on scroll
    const projectSections = document.querySelectorAll('.project-section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up');
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    projectSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Animate feature cards
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        sectionObserver.observe(card);
    });

    // Animate result numbers
    const resultNumbers = document.querySelectorAll('.result-number');
    resultNumbers.forEach(number => {
        const finalValue = parseInt(number.textContent);
        let currentValue = 0;
        const duration = 2000;
        const increment = finalValue / (duration / 16);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const interval = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            number.textContent = finalValue;
                            clearInterval(interval);
                        } else {
                            number.textContent = Math.floor(currentValue);
                        }
                    }, 16);
                    observer.unobserve(number);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(number);
    });

    // Add hover effects to project links
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add smooth scroll to section navigation
    const sectionNav = document.querySelector('.section-nav');
    if (sectionNav) {
        const dots = sectionNav.querySelectorAll('.section-nav-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Update active section dot on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.project-section');
        const scrollPosition = window.scrollY;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                dots[index].classList.add('active');
            } else {
                dots[index].classList.remove('active');
            }
        });
    });
}); 