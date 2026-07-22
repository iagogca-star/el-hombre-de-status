/* ========================================
   EL HOMBRE DE STATUS — Animations
   ======================================== */

(function () {
    'use strict';

    // ---------- PRELOADER ----------
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            preloader.classList.add('hidden');
            document.querySelector('.hero').classList.add('loaded');
            initAnimations();
        }, 1800);
    });

    function initAnimations() {
        initCursor();
        initScrollAnimations();
        initParallax();
        initZoomImages();
        initNavScroll();
        initTimer();
        initSmoothScroll();
        initTransitionLines();
    }

    // ---------- CUSTOM CURSOR ----------
    function initCursor() {
        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursorFollower');

        if (!cursor || !follower) return;
        if (window.innerWidth <= 768) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;

            cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
            follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

            requestAnimationFrame(animate);
        }
        animate();

        // Hover effects on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .module-card, .tag');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(2)';
                follower.style.width = '60px';
                follower.style.height = '60px';
                follower.style.borderColor = 'rgba(201, 168, 76, 0.6)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(2)', '');
                follower.style.width = '40px';
                follower.style.height = '40px';
                follower.style.borderColor = 'rgba(201, 168, 76, 0.4)';
            });
        });
    }

    // ---------- SCROLL ANIMATIONS (Intersection Observer) ----------
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.anim-fade-up');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    // ---------- PARALLAX ----------
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-img');

        if (parallaxElements.length === 0) return;

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.3;
                const rect = el.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const windowCenter = window.innerHeight / 2;
                const distance = elementCenter - windowCenter;

                // Only animate if element is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.style.transform = `scale(1.1) translateY(${distance * speed}px)`;
                }
            });

            requestAnimationFrame(updateParallax);
        }

        updateParallax();
    }

    // ---------- ZOOM IMAGES ON SCROLL ----------
    function initZoomImages() {
        const zoomImages = document.querySelectorAll('.zoom-img');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        zoomImages.forEach(img => observer.observe(img));

        // Additional scroll-driven zoom
        function updateZoom() {
            zoomImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const progress = 1 - (rect.top / (window.innerHeight + rect.height));
                    const clampedProgress = Math.max(0, Math.min(1, progress));
                    const scale = 1.15 - (clampedProgress * 0.1);
                    const opacity = 0.85 + (clampedProgress * 0.15);
                    img.style.transform = `scale(${scale})`;
                    img.style.opacity = opacity;
                }
            });
            requestAnimationFrame(updateZoom);
        }

        updateZoom();
    }

    // ---------- NAV SCROLL STATE ----------
    function initNavScroll() {
        const nav = document.getElementById('nav');

        function updateNav() {
            if (window.scrollY > 80) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateNav, { passive: true });
        updateNav();
    }

    // ---------- COUNTDOWN TIMER ----------
    function initTimer() {
        // Set countdown to 24 hours from first visit
        let targetTime = localStorage.getItem('ehds_timer');

        if (!targetTime) {
            targetTime = Date.now() + (24 * 60 * 60 * 1000);
            localStorage.setItem('ehds_timer', targetTime);
        }

        targetTime = parseInt(targetTime);

        const hoursEl = document.getElementById('timerHours');
        const minutesEl = document.getElementById('timerMinutes');
        const secondsEl = document.getElementById('timerSeconds');

        if (!hoursEl || !minutesEl || !secondsEl) return;

        function updateTimer() {
            const now = Date.now();
            let remaining = targetTime - now;

            if (remaining <= 0) {
                // Reset timer
                targetTime = Date.now() + (24 * 60 * 60 * 1000);
                localStorage.setItem('ehds_timer', targetTime);
                remaining = 24 * 60 * 60 * 1000;
            }

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ---------- SMOOTH SCROLL ----------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ---------- TRANSITION LINES SCROLL EFFECT ----------
    function initTransitionLines() {
        const lines = document.querySelectorAll('.transition-line');

        function updateLines() {
            lines.forEach((line, index) => {
                const rect = line.getBoundingClientRect();
                const windowH = window.innerHeight;

                if (rect.top < windowH * 0.85 && rect.bottom > 0) {
                    const progress = 1 - (rect.top / (windowH * 0.85));
                    const clamped = Math.max(0, Math.min(1, progress));
                    line.style.opacity = clamped;
                    line.style.transform = `translateX(${(1 - clamped) * 30}px)`;
                }
            });
            requestAnimationFrame(updateLines);
        }

        updateLines();
    }

    // ---------- TILT EFFECT ON MODULE CARDS ----------
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ---------- BUTTON RIPPLE EFFECT ----------
    document.querySelectorAll('.btn-gold').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                pointer-events: none;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
            `;
            btn.appendChild(ripple);

            ripple.animate([
                { width: '0px', height: '0px', opacity: 0.6 },
                { width: '300px', height: '300px', opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ---------- OFFER PRICE ANIMATION ----------
    const priceAmount = document.getElementById('priceAmount');
    if (priceAmount) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(priceAmount, 0, 97, 1200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(priceAmount);
    }

    function animateNumber(el, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

})();
