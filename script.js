document.addEventListener('DOMContentLoaded', function() {

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Menú móvil
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
    }

    // Header con sombra al hacer scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Retraso escalonado para las tarjetas dentro de cada grilla
    document.querySelectorAll('.benefits-grid, .plans-grid, .portfolio-grid-home, .portfolio-grid-full, .portfolio-showcase, .process-grid, .faq-list').forEach(parent => {
        Array.from(parent.children).forEach((child, i) => {
            child.dataset.revealDelay = Math.min(i * 90, 450);
        });
    });

    // Animación de entrada al hacer scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Number(el.dataset.revealDelay || 0);
          el.style.transitionDelay = delay + 'ms';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          // Limpiar el delay y la transición para no ralentizar los efectos hover
          setTimeout(() => {
            el.style.transitionDelay = '';
            el.style.transition = '';
          }, 750 + delay);
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    if (!reducedMotion) {
        document.querySelectorAll('.plan-card, .portfolio-item, .benefit-card, .section-title, .contact-form-wrapper, .contact-info-item, .portfolio-item-full, .showcase-card, .quote-builder, .process-step, .faq-item').forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
          observer.observe(el);
        });
    }

    // Smooth scroll para anclas en la misma página
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Asegurarse de que no sea solo un #
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 🌧️ Lluvia de partículas de código
    const particles = document.querySelectorAll('.code-particle');
    particles.forEach(particle => {
        const randomX = Math.random() * 100; // posición horizontal
        const duration = 6 + Math.random() * 6; // 6 a 12 seg
        const delay = Math.random() * 6; // retraso aleatorio

        particle.style.left = `${randomX}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
    });

    // Planes: botón "Ver todo lo que incluye" despliega las características extra
    document.querySelectorAll('.features-toggle').forEach(btn => {
        const extra = btn.previousElementSibling;
        const label = btn.querySelector('.toggle-label');
        btn.addEventListener('click', () => {
            const isOpen = extra.classList.toggle('open');
            btn.classList.toggle('open', isOpen);
            label.textContent = isOpen ? 'Ver menos' : 'Ver todo lo que incluye';
        });
    });

    // Arma tu proyecto en 3 pasos: precio estimado en vivo + envío por WhatsApp
    const quoteBuilder = document.querySelector('.quote-builder');
    if (quoteBuilder) {
        const steps = [...quoteBuilder.querySelectorAll('.quote-step')];
        const dots = [...quoteBuilder.querySelectorAll('.quote-step-dot')];
        const prevBtn = document.getElementById('quote-prev');
        const nextBtn = document.getElementById('quote-next');
        const sendBtn = document.getElementById('quote-send');
        const totalEl = document.getElementById('quote-total-amount');
        const perYearEl = quoteBuilder.querySelector('.per-year');
        let current = 1;

        const clp = n => '$' + n.toLocaleString('es-CL');

        const updateTotal = () => {
            const base = quoteBuilder.querySelector('input[name="q-base"]:checked');
            const extras = [...quoteBuilder.querySelectorAll('input[type="checkbox"]:checked')];
            let total = base ? Number(base.dataset.price) : 0;
            let yearly = 0;
            extras.forEach(i => {
                if (i.dataset.yearly) {
                    yearly += Number(i.dataset.price);
                } else {
                    total += Number(i.dataset.price);
                }
            });
            totalEl.textContent = clp(total);
            perYearEl.textContent = yearly ? ` + ${clp(yearly)}/año` : '';

            const parts = [];
            if (base) parts.push(base.value);
            extras.forEach(i => parts.push(i.value));
            const msg = 'Hola KAMEX, quiero cotizar: ' + parts.join(', ') +
                '. Precio estimado: ' + clp(total) + (yearly ? ` + ${clp(yearly)}/año` : '') + '.';
            sendBtn.href = 'https://wa.me/56940443203?text=' + encodeURIComponent(msg);
        };

        const goTo = (n) => {
            current = Math.min(3, Math.max(1, n));
            steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === current));
            dots.forEach((d, i) => d.classList.toggle('active', i + 1 <= current));
            prevBtn.disabled = current === 1;
            nextBtn.hidden = current === 3;
            sendBtn.hidden = current !== 3;
        };

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));
        dots.forEach((d, i) => d.addEventListener('click', () => goTo(i + 1)));
        quoteBuilder.querySelectorAll('input').forEach(i => i.addEventListener('change', updateTotal));
        goTo(1);
        updateTotal();
    }

    // Inclinación 3D uniforme en todas las tarjetas (la misma de "Tu Web Increíble")
    if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
        document.querySelectorAll('.floating-card, .benefit-card, .plan-card, .showcase-card, .process-step').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const dx = (e.clientX - r.left) / r.width - 0.5;
                const dy = (e.clientY - r.top) / r.height - 0.5;
                // Transición corta para que la tarjeta responda al instante
                card.style.transition = 'transform 0.08s ease-out';
                card.style.transform = `perspective(800px) rotateY(${(dx * 8).toFixed(2)}deg) rotateX(${(-dy * 8).toFixed(2)}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = '';
                card.style.transform = '';
            });
        });

        // Parallax: fondo, orbes, anillos y marcos se desplazan hacia donde va el mouse
        const parallaxTargets = [
            [document.querySelector('.background-animation'), 30, 20],
            [document.querySelector('.deco-ring'), 46, 34],
            [document.querySelector('.deco-dots'), 60, 44],
            [document.querySelector('.floating-card'), 24, 18]
        ].filter(t => t[0]);
        if (parallaxTargets.length) {
            let targetX = 0, targetY = 0, curX = 0, curY = 0;
            window.addEventListener('mousemove', (e) => {
                targetX = e.clientX / window.innerWidth - 0.5;
                targetY = e.clientY / window.innerHeight - 0.5;
            });
            const animateParallax = () => {
                curX += (targetX - curX) * 0.06;
                curY += (targetY - curY) * 0.06;
                parallaxTargets.forEach(([el, fx, fy]) => {
                    el.style.translate = `${(curX * fx).toFixed(1)}px ${(curY * fy).toFixed(1)}px`;
                });
                requestAnimationFrame(animateParallax);
            };
            animateParallax();
        }
    }

});
