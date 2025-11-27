/* ========================================
   ULTRA DYNAMIC WEBSITE - JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initParticles();
    initThemeToggle();
    initNavigation();
    initScrollAnimations();
    initTiltEffect();
    initColorMixer();
    initCounter();
    initStatsCounter();
    initContactForm();
});

/* ========================================
   PARTICLE BACKGROUND
   ======================================== */
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        const particleCount = Math.min(80, Math.max(30, Math.floor((canvas.width * canvas.height) / 15000)));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDistance = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // Mouse interaction
    let mouse = { x: null, y: null };
    
    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Push particles away from mouse
        particles.forEach(particle => {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                particle.x += Math.cos(angle) * 2;
                particle.y += Math.sin(angle) * 2;
            }
        });
    });
}

/* ========================================
   THEME TOGGLE
   ======================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    }

    themeBtn.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation
        themeBtn.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            themeBtn.style.transform = '';
        }, 300);
    });
}

/* ========================================
   NAVIGATION
   ======================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinkItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');

    function reveal() {
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Initial check
}

/* ========================================
   3D TILT EFFECT
   ======================================== */
function initTiltEffect() {
    const tiltCard = document.getElementById('tilt-card');
    
    if (!tiltCard) return;

    tiltCard.addEventListener('mousemove', function(e) {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    tiltCard.addEventListener('mouseleave', function() {
        tiltCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}

/* ========================================
   COLOR MIXER
   ======================================== */
function initColorMixer() {
    const redSlider = document.getElementById('red');
    const greenSlider = document.getElementById('green');
    const blueSlider = document.getElementById('blue');
    const colorPreview = document.getElementById('color-preview');

    if (!redSlider || !greenSlider || !blueSlider || !colorPreview) return;

    function updateColor() {
        const r = redSlider.value;
        const g = greenSlider.value;
        const b = blueSlider.value;
        
        colorPreview.style.background = `rgb(${r}, ${g}, ${b})`;
        colorPreview.style.boxShadow = `0 10px 30px rgba(${r}, ${g}, ${b}, 0.5)`;
    }

    redSlider.addEventListener('input', updateColor);
    greenSlider.addEventListener('input', updateColor);
    blueSlider.addEventListener('input', updateColor);

    updateColor(); // Initial color
}

/* ========================================
   INTERACTIVE COUNTER
   ======================================== */
function initCounter() {
    const minusBtn = document.querySelector('.counter-btn.minus');
    const plusBtn = document.querySelector('.counter-btn.plus');
    const counterValue = document.getElementById('counter-value');

    if (!minusBtn || !plusBtn || !counterValue) return;

    let count = 0;

    function updateCounter(value) {
        count = value;
        counterValue.textContent = count;
        
        // Add animation
        counterValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counterValue.style.transform = 'scale(1)';
        }, 150);
    }

    minusBtn.addEventListener('click', function() {
        updateCounter(count - 1);
    });

    plusBtn.addEventListener('click', function() {
        updateCounter(count + 1);
    });
}

/* ========================================
   ANIMATED STATS COUNTER
   ======================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateStats() {
        if (hasAnimated) return;

        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            hasAnimated = true;
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                function updateNumber() {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateNumber);
                    } else {
                        stat.textContent = target;
                    }
                }

                updateNumber();
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Initial check
}

/* ========================================
   CONTACT FORM
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Simulate form submission
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.querySelector('span').textContent = 'Message Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #22d3ee 100%)';
            
            // Reset form
            form.reset();
            
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });

    // Add floating label effect for textarea
    const textarea = form.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
    }
}

/* ========================================
   ADDITIONAL EFFECTS
   ======================================== */

// Cursor Trail Effect - initialized with cleanup support
function initCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i * 0.3}px;
            height: ${8 - i * 0.3}px;
            background: rgba(99, 102, 241, ${0.5 - i * 0.02});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s;
            opacity: 0;
        `;
        document.body.appendChild(dot);
        trail.push({ element: dot, x: 0, y: 0 });
    }

    let mouseX = 0;
    let mouseY = 0;
    let timeout;
    let animationId;

    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        trail.forEach(dot => {
            dot.element.style.opacity = '1';
        });

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            trail.forEach(dot => {
                dot.element.style.opacity = '0';
            });
        }, 100);
    }

    document.addEventListener('mousemove', onMouseMove);

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            
            dot.x = x;
            dot.y = y;
            
            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
            
            x += (nextDot.x - dot.x) * 0.3;
            y += (nextDot.y - dot.y) * 0.3;
        });

        animationId = requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

// Initialize cursor trail when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorTrail);
} else {
    initCursorTrail();
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'B', 'A'];

document.addEventListener('keydown', function(e) {
    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    konamiCode.push(key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

console.log('%c🚀 Ultra Dynamic Website Loaded!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cTry the Konami Code: ↑↑↓↓←→←→BA', 'color: #22d3ee; font-size: 14px;');
