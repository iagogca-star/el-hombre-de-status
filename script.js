/* ========================================
   EL HOMBRE DE STATUS v2 — Animations
   ======================================== */

(function () {
    'use strict';

    // ---------- PRELOADER ----------
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.classList.add('hidden');
            const hero = document.querySelector('.hero');
            if (hero) hero.classList.add('loaded');
            initAnimations();
        }, 1600);
    });

    function initAnimations() {
        initScrollAnimations();
        initParallax();
        initNavScroll();
        initTimer();
        initSmoothScroll();
        initCarousel();
        initFAQ();
        initButtonRipple();
    }

    // ---------- SCROLL ANIMATIONS ----------
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
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    // ---------- PARALLAX ----------
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-img');
        if (parallaxElements.length === 0) return;

        function updateParallax() {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.3;
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const elementCenter = rect.top + rect.height / 2;
                    const windowCenter = window.innerHeight / 2;
                    const distance = elementCenter - windowCenter;
                    el.style.transform = `scale(1.1) translateY(${distance * speed}px)`;
                }
            });
            requestAnimationFrame(updateParallax);
        }

        updateParallax();
    }

    // ---------- NAV SCROLL ----------
    function initNavScroll() {
        const nav = document.getElementById('nav');
        if (!nav) return;

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

    // ---------- COUNTDOWN TIMER (15 minutes) ----------
    function initTimer() {
        let targetTime = localStorage.getItem('ehds_timer_v2');

        if (!targetTime || isNaN(parseInt(targetTime))) {
            targetTime = Date.now() + (15 * 60 * 1000);
            localStorage.setItem('ehds_timer_v2', targetTime);
        }

        targetTime = parseInt(targetTime);

        const minutesEl = document.getElementById('timerMinutes');
        const secondsEl = document.getElementById('timerSeconds');

        if (!minutesEl || !secondsEl) return;

        function updateTimer() {
            const now = Date.now();
            let remaining = targetTime - now;

            if (remaining <= 0) {
                targetTime = Date.now() + (15 * 60 * 1000);
                localStorage.setItem('ehds_timer_v2', targetTime);
                remaining = 15 * 60 * 1000;
            }

            const minutes = Math.floor(remaining / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

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
                    const offset = 70;
                    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ---------- CAROUSEL ----------
    function initCarousel() {
        const track = document.getElementById('carouselTrack');
        const dotsContainer = document.getElementById('carouselDots');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');

        if (!track || !dotsContainer) return;

        const slides = track.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoplayInterval;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * (100 + (16 / slides[0].offsetWidth * 100))}%)`;

            // Simpler approach: translate by percentage
            const slideWidth = slides[0].offsetWidth + 16; // gap
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Update dots
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide((currentIndex + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 4000);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        startAutoplay();

        // Touch/drag support
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;

        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const diff = e.touches[0].clientX - startX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) prevSlide();
                else nextSlide();
                isDragging = false;
                resetAutoplay();
            }
        }, { passive: true });

        track.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Handle resize
        window.addEventListener('resize', () => goToSlide(currentIndex));
    }

    // ---------- FAQ ACCORDION ----------
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(i => i.classList.remove('active'));

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ---------- BUTTON RIPPLE ----------
    function initButtonRipple() {
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
                    z-index: 2;
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
    }

})();
