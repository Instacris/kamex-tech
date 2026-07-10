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
    document.querySelectorAll('.benefits-grid, .plans-grid, .portfolio-grid-home, .portfolio-grid-full, .portfolio-showcase').forEach(parent => {
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
        document.querySelectorAll('.plan-card, .portfolio-item, .benefit-card, .section-title, .contact-form-wrapper, .contact-info-item, .portfolio-item-full, .showcase-card, .quote-builder').forEach(el => {
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

    // Arma tu propio plan: la selección se envía por WhatsApp
    const quoteSend = document.getElementById('quote-send');
    if (quoteSend) {
        const quoteOther = document.getElementById('quote-other');
        const buildQuoteLink = () => {
            const opts = [...document.querySelectorAll('.quote-chip input:checked')].map(i => i.value);
            const other = quoteOther ? quoteOther.value.trim() : '';
            if (other) opts.push(other);
            const base = 'Hola KAMEX, quiero cotizar una página web';
            const msg = opts.length ? `${base} con: ${opts.join(', ')}.` : `${base}.`;
            quoteSend.href = 'https://wa.me/56940443203?text=' + encodeURIComponent(msg);
        };
        document.querySelectorAll('.quote-chip input').forEach(i => i.addEventListener('change', buildQuoteLink));
        if (quoteOther) quoteOther.addEventListener('input', buildQuoteLink);
        buildQuoteLink();
    }

    // Inclinación 3D sutil de la tarjeta de código del hero (solo mouse)
    const tiltCard = document.querySelector('.floating-card');
    const hero = document.querySelector('.hero');
    if (tiltCard && hero && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
        hero.addEventListener('mousemove', (e) => {
            const r = tiltCard.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
            const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
            tiltCard.style.transform = `rotateY(${(dx * 8).toFixed(2)}deg) rotateX(${(-dy * 8).toFixed(2)}deg)`;
        });
        hero.addEventListener('mouseleave', () => {
            tiltCard.style.transform = '';
        });
    }

});
