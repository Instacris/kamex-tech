document.addEventListener('DOMContentLoaded', function() {

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Precios =====
    // Todos los montos salen de precios.js (window.KAMEX_PRECIOS). El HTML trae
    // los mismos valores como respaldo; aquí se reemplazan por la fuente única
    // para que un cambio de precio se haga en un solo archivo.
    const PRECIOS = window.KAMEX_PRECIOS || null;
    // Separador de miles chileno (punto), sin depender del locale del navegador
    const miles = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const clp = n => '$' + miles(n);

    if (PRECIOS) {
        document.querySelectorAll('[data-precio]').forEach(el => {
            const valor = el.dataset.precio.split('.')
                .reduce((obj, clave) => (obj ? obj[clave] : undefined), PRECIOS);
            if (typeof valor !== 'number') return;
            const texto = el.hasAttribute('data-sin-signo') ? miles(valor) : clp(valor);
            el.textContent = (el.dataset.prefijo || '') + texto;
        });
    }

    // ===== Menú móvil =====
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navBackdrop = document.querySelector('.nav-backdrop');

    if (menuToggle && navMenu) {
        const setMenu = (abrir) => {
            navMenu.classList.toggle('active', abrir);
            menuToggle.classList.toggle('active', abrir);
            if (navBackdrop) navBackdrop.classList.toggle('active', abrir);
            menuToggle.setAttribute('aria-expanded', String(abrir));
            menuToggle.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
            // Bloquear el scroll del fondo mientras el panel está abierto
            document.body.style.overflow = abrir ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenu(!navMenu.classList.contains('active'));
        });

        // Cerrar al tocar un enlace del menú
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        // Cerrar al tocar fuera del panel
        if (navBackdrop) navBackdrop.addEventListener('click', () => setMenu(false));

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) setMenu(false);
        });

        // Si se vuelve a escritorio con el menú abierto, dejar todo limpio
        window.matchMedia('(min-width: 769px)').addEventListener('change', (ev) => {
            if (ev.matches) setMenu(false);
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
        document.querySelectorAll('.plan-card, .portfolio-item, .benefit-card, .contact-form-wrapper, .contact-info-item, .portfolio-item-full, .showcase-card, .process-step, .faq-item').forEach(el => {
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

    // ===== Fondo decorativo: líneas de código quietas (sin animación, por rendimiento) =====
    // Cada línea es una lista de pares [claseDeColor, texto]. Se construye con
    // createElement/textContent, así el navegador nunca interpreta esto como HTML.
    const CODE_LINES = [
        [['tk-key','def '],['tk-fn','optimizar_sitio'],['tk-pun','('],['tk-var','cliente'],['tk-pun','): '],['tk-key','return '],['tk-pun','{'],['tk-str','"velocidad"'],['tk-pun',': '],['tk-num','98'],['tk-pun',', '],['tk-str','"seo"'],['tk-pun',': '],['tk-key','True'],['tk-pun','}']],
        [['tk-key','const '],['tk-var','menu'],['tk-pun',' = '],['tk-key','await '],['tk-fn','fetch'],['tk-pun','('],['tk-str',"'/api/productos'"],['tk-pun',').'],['tk-fn','then'],['tk-pun','('],['tk-var','r'],['tk-pun',' => '],['tk-var','r'],['tk-pun','.'],['tk-fn','json'],['tk-pun','());']],
        [['tk-com','# control de stock en tiempo real  '],['tk-key','class '],['tk-cls','Inventario'],['tk-pun',': '],['tk-key','def '],['tk-fn','alertar_vencimiento'],['tk-pun','('],['tk-var','self'],['tk-pun',', '],['tk-var','dias'],['tk-pun','='],['tk-num','7'],['tk-pun','):']],
        [['tk-key','public async '],['tk-cls','Task'],['tk-pun','<'],['tk-cls','Reserva'],['tk-pun','> '],['tk-fn','CrearReserva'],['tk-pun','('],['tk-cls','int '],['tk-var','clienteId'],['tk-pun',') { '],['tk-key','return await '],['tk-var','_db'],['tk-pun','.'],['tk-fn','GuardarAsync'],['tk-pun','(); }']],
        [['tk-key','import '],['tk-var','pandas'],['tk-key',' as '],['tk-var','pd'],['tk-pun','; '],['tk-var','df'],['tk-pun',' = '],['tk-var','pd'],['tk-pun','.'],['tk-fn','read_excel'],['tk-pun','('],['tk-str','"mermas.xlsx"'],['tk-pun',').'],['tk-fn','groupby'],['tk-pun','('],['tk-str','"categoria"'],['tk-pun',').'],['tk-fn','sum'],['tk-pun','()']],
        [['tk-key','export default function '],['tk-fn','Carrito'],['tk-pun','({ '],['tk-var','items'],['tk-pun',' }) { '],['tk-key','return '],['tk-pun','<'],['tk-cls','Total'],['tk-pun',' '],['tk-var','valor'],['tk-pun','={'],['tk-fn','sumar'],['tk-pun','('],['tk-var','items'],['tk-pun',')} /> }']],
        [['tk-var','db'],['tk-pun','.'],['tk-fn','query'],['tk-pun','('],['tk-str',"'SELECT * FROM pedidos WHERE estado = $1'"],['tk-pun',', ['],['tk-str',"'pendiente'"],['tk-pun',']);']],
        [['tk-pun','@'],['tk-fn','app'],['tk-pun','.'],['tk-fn','route'],['tk-pun','('],['tk-str','"/turnos/siguiente"'],['tk-pun',')  '],['tk-key','def '],['tk-fn','siguiente_turno'],['tk-pun','(): '],['tk-key','return '],['tk-fn','jsonify'],['tk-pun','('],['tk-var','numero'],['tk-pun','='],['tk-var','n'],['tk-pun',' + '],['tk-num','1'],['tk-pun',')']],
        [['tk-com','// despliegue en Hostinger  '],['tk-key','const '],['tk-var','build'],['tk-pun',' = '],['tk-key','await '],['tk-fn','deploy'],['tk-pun','({ '],['tk-var','ssl'],['tk-pun',': '],['tk-key','true'],['tk-pun',', '],['tk-var','cdn'],['tk-pun',': '],['tk-key','true'],['tk-pun',' });']]
    ];

    const bgLayer = document.querySelector('.background-animation');
    if (bgLayer && !reducedMotion) {
        const stream = document.createElement('div');
        stream.className = 'code-stream';
        stream.setAttribute('aria-hidden', 'true');

        CODE_LINES.forEach((tokens, i) => {
            const row = document.createElement('div');
            row.className = 'code-row';
            row.style.top = (5 + i * 10.2) + '%';
            // Cada línea parte en un punto distinto para que no queden todas alineadas
            row.style.left = ((i * 37) % 55 - 10) + '%';

            tokens.forEach(([cls, text]) => {
                const span = document.createElement('span');
                span.className = cls;
                span.textContent = text;
                row.appendChild(span);
            });
            stream.appendChild(row);
        });

        bgLayer.appendChild(stream);
    }

    // ===== Ventana emergente de los 4 beneficios del inicio =====
    // El contenido es estático y definido aquí (no viene de ninguna entrada
    // del usuario), por eso es seguro insertarlo en el cuadro de diálogo.
    const INFO_CONTENT = {
        tecnologias: {
            title: 'Tecnologías que Usamos',
            body: `
                <p>No usamos plantillas prearmadas: cada sitio se construye a mano con herramientas profesionales, las mismas que ocupan las empresas grandes.</p>
                <p><strong>Para la parte visual</strong></p>
                <div class="info-tags">
                    <span class="info-tag">HTML5</span><span class="info-tag">CSS3</span>
                    <span class="info-tag">JavaScript</span><span class="info-tag">React</span>
                    <span class="info-tag">Vite</span><span class="info-tag">Tailwind</span>
                </div>
                <p><strong>Para sistemas y datos</strong></p>
                <div class="info-tags">
                    <span class="info-tag">Node.js</span><span class="info-tag">Python</span>
                    <span class="info-tag">PostgreSQL</span><span class="info-tag">APIs REST</span>
                    <span class="info-tag">Excel / Power Query</span>
                </div>
                <p><strong>Herramientas de trabajo</strong></p>
                <div class="info-tags">
                    <span class="info-tag">Visual Studio Code</span><span class="info-tag">Git &amp; GitHub</span>
                    <span class="info-tag">Hostinger</span>
                </div>
                <p>Todo queda documentado y ordenado, de modo que tu proyecto pueda crecer más adelante sin tener que empezar de cero.</p>
            `
        },
        responsive: {
            title: '100% Responsivo',
            body: `
                <p><strong>Responsivo</strong> significa que tu página se adapta sola al tamaño de cualquier pantalla: no es una versión reducida, es el mismo sitio reacomodándose para verse bien en cada dispositivo.</p>
                <ul>
                    <li><strong>Celular:</strong> menús que se abren con el pulgar, textos legibles sin hacer zoom y botones grandes.</li>
                    <li><strong>Tablet:</strong> aprovecha el ancho extra sin dejar espacios vacíos.</li>
                    <li><strong>Computador:</strong> diseño amplio, con imágenes en alta calidad.</li>
                </ul>
                <p>Esto importa porque <strong>la mayoría de tus clientes te va a encontrar desde el celular</strong>. Una web que se ve mal en el teléfono pierde ventas antes de que alguien lea lo que ofreces.</p>
                <p>Probamos cada proyecto en pantallas reales de distintos tamaños antes de entregarlo.</p>
            `
        },
        seguridad: {
            title: 'Hosting Seguro con Hostinger',
            body: `
                <p>Publicamos y mantenemos tu proyecto en <strong>Hostinger</strong>, uno de los proveedores de hosting más usados del mundo. Tú no tienes que configurar nada técnico.</p>
                <ul>
                    <li><strong>Certificado SSL (HTTPS):</strong> el candado del navegador. Todo lo que un visitante escriba viaja cifrado y Google no marca tu sitio como "no seguro".</li>
                    <li><strong>Respaldos automáticos:</strong> copias periódicas del sitio. Si algo falla, se restaura.</li>
                    <li><strong>Protección contra ataques:</strong> cortafuegos y mitigación de DDoS incluidos en la infraestructura.</li>
                    <li><strong>Dominio propio:</strong> tunegocio.cl en vez de una dirección genérica.</li>
                    <li><strong>Disponibilidad 24/7:</strong> monitoreo constante para que tu web no se caiga.</li>
                </ul>
                <p>Además, los sitios que entregamos son <strong>estáticos o con base de datos aislada</strong>: no guardan contraseñas de tus clientes en el servidor, así que no hay información sensible que robar.</p>
                <p>Con la <strong>opción B (mensualidad)</strong> todo esto va incluido, sin costos escondidos.</p>
            `
        },
        soporte: {
            title: 'Soporte Real',
            body: `
                <p>Hablas directamente por WhatsApp con la persona que construyó tu web. No hay call center, ni tickets, ni respuestas automáticas.</p>
                <ul>
                    <li><strong>Respuesta en menos de 24 horas hábiles.</strong></li>
                    <li><strong>Explicaciones en español simple</strong>, sin tecnicismos innecesarios.</li>
                    <li><strong>Capacitación incluida</strong> para que sepas administrar tu sitio.</li>
                    <li><strong>Cambios incluidos</strong> con la opción B (1 al mes en el Plan Básico y 4 en el Premium).</li>
                </ul>
                <p>Si algo se cae o deja de funcionar, lo resolvemos nosotros: no tienes que buscar a otra persona ni entender el problema técnico.</p>
            `
        }
    };

    const infoModal = document.getElementById('info-modal');
    if (infoModal) {
        const modalBox = infoModal.querySelector('.info-modal-box');
        const modalTitle = document.getElementById('info-modal-title');
        const modalBody = document.getElementById('info-modal-body');
        const modalIcon = document.getElementById('info-modal-icon');
        const closeBtn = infoModal.querySelector('.info-modal-close');
        let lastFocused = null;

        const openModal = (key, sourceCard) => {
            const data = INFO_CONTENT[key];
            if (!data) return;
            lastFocused = sourceCard || document.activeElement;

            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.body;

            // Reutiliza el mismo ícono de la tarjeta que se pulsó
            modalIcon.textContent = '';
            const srcIcon = sourceCard && sourceCard.querySelector('.benefit-icon svg');
            if (srcIcon) modalIcon.appendChild(srcIcon.cloneNode(true));

            infoModal.hidden = false;
            // Forzar reflow para que la transición de entrada se vea
            void infoModal.offsetWidth;
            infoModal.classList.add('open');
            document.body.classList.add('modal-open');
            closeBtn.focus();
        };

        const closeModal = () => {
            infoModal.classList.remove('open');
            document.body.classList.remove('modal-open');
            setTimeout(() => { infoModal.hidden = true; }, 300);
            if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        };

        document.querySelectorAll('.benefit-card[data-modal]').forEach(card => {
            card.addEventListener('click', () => openModal(card.dataset.modal, card));
        });

        closeBtn.addEventListener('click', closeModal);
        infoModal.addEventListener('click', (e) => {
            if (!modalBox.contains(e.target)) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && infoModal.classList.contains('open')) closeModal();
        });
    }

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


    // "¿Por qué una mensualidad?": entrada escalonada de las 4 tarjetas.
    // Anima la propiedad `translate` (no `transform`) para no pisar el
    // levantamiento del hover. Sin JS o con movimiento reducido quedan quietas.
    const mensual = document.querySelector('.mensual');
    if (mensual && !reducedMotion && 'IntersectionObserver' in window) {
        mensual.querySelectorAll('.mensual-card').forEach((card, i) => card.style.setProperty('--orden', i));
        mensual.classList.add('mensual--preparada');
        new IntersectionObserver((entradas, obs) => {
            if (!entradas.some(e => e.isIntersecting)) return;
            mensual.classList.add('mensual--visible');
            obs.disconnect();
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }).observe(mensual);
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

        // El fondo (código, orbes y anillos) se mueve solo con sus propias
        // animaciones CSS: ya no sigue al cursor.
    }


    // ===== Cinta de proyectos del inicio =====
    // Se puede deslizar con el dedo de izquierda a derecha. Sola avanza despacio;
    // se detiene mientras la tocan (o el mouse está encima) y retoma 2,5 s después.
    // La pista trae los proyectos dos veces: al llegar a la mitad se salta al
    // inicio (y viceversa) sin que se note, así nunca se acaba.
    const loop = document.querySelector('.loop-viewport');
    const loopTrack = loop && loop.querySelector('.loop-track');
    if (loop && loopTrack) {
        loop.classList.add('loop-js');
        const VELOCIDAD = 40;   // px por segundo (antes ~130 en celular)
        const ESPERA = 2500;    // ms sin tocar antes de seguir sola
        let pos = 0;            // posición propia (con decimales) para un avance suave
        let tocando = false;
        let encima = false;
        let enPantalla = true;
        let retomar = 0;
        let ultimo = 0;
        let rafId = 0;
        const mitad = () => loopTrack.scrollWidth / 2;
        const envolver = () => {
            const m = mitad();
            if (m <= 0) return;
            if (loop.scrollLeft >= m) loop.scrollLeft -= m;
            else if (loop.scrollLeft <= 0) loop.scrollLeft += m;
        };

        const avanzar = (t) => {
            rafId = 0;
            const dt = ultimo ? Math.min(t - ultimo, 100) : 0;
            ultimo = t;
            if (!reducedMotion && !tocando && !encima && t > retomar) {
                pos += VELOCIDAD * dt / 1000;
                if (pos >= mitad()) pos -= mitad();
                loop.scrollLeft = pos;
            }
            if (enPantalla && !document.hidden) rafId = requestAnimationFrame(avanzar);
        };
        const arrancar = () => { if (!rafId) { ultimo = 0; rafId = requestAnimationFrame(avanzar); } };

        // Si la persona la movió, la cinta sigue desde donde la dejó
        loop.addEventListener('scroll', () => {
            if (Math.abs(loop.scrollLeft - pos) > 2) {
                envolver();
                pos = loop.scrollLeft;
                retomar = performance.now() + ESPERA;
            }
        }, { passive: true });
        loop.addEventListener('touchstart', () => { tocando = true; }, { passive: true });
        const soltar = () => { tocando = false; retomar = performance.now() + ESPERA; };
        loop.addEventListener('touchend', soltar, { passive: true });
        loop.addEventListener('touchcancel', soltar, { passive: true });
        // Solo el mouse real pausa por estar encima (en el celular el toque simula un mouse que nunca "sale")
        loop.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') encima = true; });
        loop.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') encima = false; });

        // Solo se anima cuando se ve (ahorra batería)
        if ('IntersectionObserver' in window) {
            new IntersectionObserver((e) => {
                const antes = enPantalla;
                enPantalla = e[0].isIntersecting;
                if (enPantalla && !antes) arrancar();
            }).observe(loop);
        }
        document.addEventListener('visibilitychange', () => { if (!document.hidden && enPantalla) arrancar(); });
        // Arranca un poco adentro para poder deslizar también hacia atrás
        loop.scrollLeft = pos = 1;
        arrancar();
    }

    // Formulario de contacto: se envía a FormSubmit sin salir de la página y
    // avisa con una ventana. Si JavaScript falla, el formulario se envía igual
    // de la forma tradicional y termina en gracias.html.
    const contactForm = document.querySelector('.contact-form');
    const envioModal = document.getElementById('envio-modal');
    if (contactForm && envioModal && window.fetch) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const textoOriginal = submitBtn.textContent;
        const envioTitulo = document.getElementById('envio-titulo');
        const envioTexto = document.getElementById('envio-texto');
        const envioOk = envioModal.querySelector('.envio-modal__acciones .btn-primary');
        const envioWsp = envioModal.querySelector('.envio-modal__wsp');
        const destino = contactForm.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/');
        let enviando = false;

        const AVISOS = {
            ok: {
                titulo: '¡Gracias por contactar a KAMEX Tech!',
                texto: 'Recibimos tu mensaje y te responderemos a la brevedad, normalmente en menos de 24 horas hábiles.',
                boton: '¡Okey!'
            },
            error: {
                titulo: 'No pudimos enviar tu mensaje',
                texto: 'Revisa tu conexión e inténtalo otra vez. Si prefieres, escríbenos directo por WhatsApp.',
                boton: 'Intentar de nuevo'
            }
        };

        const abrirAviso = (tipo) => {
            const aviso = AVISOS[tipo];
            envioModal.classList.toggle('es-error', tipo === 'error');
            envioTitulo.textContent = aviso.titulo;
            envioTexto.textContent = aviso.texto;
            envioOk.textContent = aviso.boton;
            envioWsp.hidden = tipo !== 'error';
            envioModal.hidden = false;
            void envioModal.offsetWidth;
            envioModal.classList.add('open');
            document.body.classList.add('modal-open');
            // La ventana pasa de oculta a visible con transición: el foco se da
            // un instante después, cuando el botón ya se puede enfocar.
            setTimeout(() => envioOk.focus(), 80);
        };

        const cerrarAviso = () => {
            if (!envioModal.classList.contains('open')) return;
            envioModal.classList.remove('open');
            document.body.classList.remove('modal-open');
            setTimeout(() => { envioModal.hidden = true; }, 300);
            submitBtn.focus();
        };

        envioModal.querySelectorAll('[data-cerrar-envio]').forEach(b => b.addEventListener('click', cerrarAviso));
        envioModal.addEventListener('click', (e) => { if (e.target === envioModal) cerrarAviso(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarAviso(); });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (enviando) return;

            const datos = Object.fromEntries(new FormData(contactForm));
            delete datos._next;

            // Trampa para bots: si completaron el campo oculto, se simula el envío
            if (datos._honey) {
                contactForm.reset();
                abrirAviso('ok');
                return;
            }

            enviando = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando…';
            const control = new AbortController();
            const limite = setTimeout(() => control.abort(), 15000);

            try {
                const respuesta = await fetch(destino, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(datos),
                    signal: control.signal
                });
                const resultado = await respuesta.json().catch(() => ({}));
                if (!respuesta.ok || String(resultado.success) !== 'true') {
                    throw new Error(resultado.message || 'Respuesta ' + respuesta.status);
                }
                contactForm.reset();
                abrirAviso('ok');
            } catch (error) {
                abrirAviso('error');
            } finally {
                clearTimeout(limite);
                enviando = false;
                submitBtn.disabled = false;
                submitBtn.textContent = textoOriginal;
            }
        });
    }

});
