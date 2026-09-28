/* Fondo animado del inicio: líneas finas y partículas que suben desde un
   horizonte luminoso con un haz de luz, recreando el aspecto de
   "Rising Lines" de React Bits Pro (sin su código, que es de pago).
   Efecto propio de KAMEX Tech en WebGL puro (sin librerías).
   El horizonte se ubica justo encima de las tarjetas de "Muestras de
   proyectos realizados": todo el texto queda arriba, dentro del efecto.
   Si el navegador no tiene WebGL, el lienzo queda vacío y no pasa nada. */
(function () {
    'use strict';

    // Nombres y valores por defecto de Rising Lines. Colores adaptados a la
    // marca: líneas azules y haz dorado.
    var CONFIG = {
        color: '#4fa8ff',          // líneas y partículas que suben
        horizonColor: '#33AAFF',   // resplandor del horizonte
        haloColor: '#dcb75a',      // haz de luz sobre el horizonte
        riseSpeed: 0.1,
        riseScale: 11.5,           // densidad de las líneas
        riseIntensity: 1.0,
        flowSpeed: 0.2,
        flowIntensity: 0.6,
        horizonIntensity: 0.85,
        haloIntensity: 7.5,
        scale: 3.5,
        brightness: 1.0,
        // Propios de KAMEX: distancia (px) entre el horizonte y las tarjetas,
        // y cuánto baja el lienzo por detrás de ellas para fundir el brillo
        horizonGap: 14,
        spill: 40
    };

    var lienzo = document.querySelector('.rising-lines');
    if (!lienzo) return;
    var hero = lienzo.parentElement;
    var ancla = document.querySelector('.loop-viewport');

    var gl = lienzo.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power'
    });
    if (!gl) return;

    var VERTICES = [
        'attribute vec2 aPos;',
        'void main() { gl_Position = vec4(aPos, 0.0, 1.0); }'
    ].join('\n');

    var FRAGMENTOS = [
        'precision highp float;',
        'uniform vec2 uRes;',
        'uniform float uDpr;',
        'uniform float uTime;',
        'uniform float uHor;',
        'uniform vec3 uColor;',
        'uniform vec3 uHorizon;',
        'uniform vec3 uHalo;',
        'uniform float uRiseSpeed, uRiseScale, uRiseInt;',
        'uniform float uFlowSpeed, uFlowInt;',
        'uniform float uHorInt, uHaloInt, uScale, uBright;',

        'float h11(float n) { return fract(sin(n * 127.1) * 43758.5453); }',
        'float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',

        'void main() {',
        // Coordenadas en px CSS, origen abajo a la izquierda
        '  vec2 fc = gl_FragCoord.xy / uDpr;',
        '  float W = uRes.x / uDpr;',
        '  float t = uTime;',
        '  float nx = (fc.x - 0.5 * W) / (0.5 * W);',
        '  float ax = fc.x - 0.5 * W;',
        // El horizonte se curva apenas hacia abajo en los costados
        '  float ay = fc.y - uHor + nx * nx * 7.0;',
        '  float unidad = 500.0 * 3.5 / uScale;',
        '  float au = ay / unidad;',
        '  float envX = 0.4 + 0.6 * exp(-nx * nx * 1.6);',
        '  float fadeUp = exp(-au * au * 5.0);',
        '  vec3 col = vec3(0.0);',

        // 1. Líneas finas que suben (varias capas de columnas)
        '  if (ay > 0.0) {',
        '    vec3 lineas = vec3(0.0);',
        '    float densidad = 11.5 / uRiseScale;',
        '    for (int i = 0; i < 5; i++) {',
        '      float fi = float(i);',
        '      float cw = 6.0 * pow(1.45, fi) * densidad;',
        '      float xs = fc.x + fi * 53.7;',
        '      float celda = floor(xs / cw);',
        '      float s = celda * 1.731 + fi * 97.3;',
        '      if (h11(s) < 0.52) continue;',
        '      float r2 = h11(s + 3.1);',
        '      float r3 = h11(s + 7.7);',
        '      float r4 = h11(s + 11.3);',
        '      float r5 = h11(s + 19.9);',
        '      float r6 = h11(s + 23.3);',
        '      float dx = (xs - (celda + 0.2 + 0.6 * r2) * cw) * uDpr;',
        '      float largo = 0.03 + r3 * r3 * r3 * 0.4;',
        '      float ciclo = 1.3 + largo + r4 * 1.1;',
        '      float vel = uRiseSpeed * (0.6 + r5 * 1.2) * 2.4;',
        '      float cabeza = mod(t * vel + r4 * 17.0, ciclo);',
        '      float sp = (au - (cabeza - largo)) / largo;',
        '      if (sp <= 0.0 || sp >= 1.0) continue;',
        '      float perfil = smoothstep(0.0, 0.55, sp) * smoothstep(1.0, 0.9, sp);',
        '      float nucleo = exp(-dx * dx * 1.3);',
        '      float brillo = exp(-dx * dx * 0.25) * 0.15;',
        '      float fuerza = 0.25 + 0.75 * r6 * r6;',
        '      lineas += (uColor * (nucleo * 0.85 + brillo) + vec3(nucleo) * 0.5 * r6) * perfil * fuerza;',
        '    }',
        '    col += lineas * fadeUp * envX * uRiseInt * 1.5;',

        // 2. Partículas redondas, más grandes cerca del horizonte
        '    for (int i = 0; i < 2; i++) {',
        '      float fi = float(i);',
        '      float cs = 62.0 + fi * 34.0;',
        '      float xs = fc.x + fi * 71.0;',
        '      float ci = floor(xs / cs);',
        '      float rc = h11(ci * 3.17 + fi * 41.0);',
        '      float ys = ay - t * uRiseSpeed * (0.5 + rc) * unidad * 1.6 - rc * 1000.0;',
        '      float fila = floor(ys / cs);',
        '      vec2 id = vec2(ci, fila) + fi * 13.1;',
        '      if (h21(id) < 0.6) continue;',
        '      vec2 centro = (vec2(ci, fila) + 0.3 + 0.4 * vec2(h21(id + 1.7), h21(id + 4.3))) * cs;',
        '      float dist = length(vec2(xs, ys) - centro) * uDpr;',
        '      float rad = (0.8 + 1.8 * pow(h21(id + 9.1), 3.0)) * (0.7 + 1.5 * exp(-au * 5.0)) * uDpr;',
        '      float punto = smoothstep(rad + 0.7, rad - 0.5, dist);',
        '      float halo = exp(-dist * dist / (rad * rad * 5.0)) * 0.6;',
        '      col += mix(uColor, vec3(1.0), 0.3) * (punto + halo) * (0.5 + 0.9 * h21(id + 2.2)) * fadeUp * envX * uRiseInt;',
        '    }',
        '  }',

        // 3. Horizonte: destellos cortos que parpadean sobre la línea
        '  float ex = exp(-nx * nx * 2.6);',
        '  float aay = abs(ay);',
        '  if (ay > -1.0) {',
        '    float gc = floor(fc.x / 2.0);',
        '    float gf = fract(fc.x / 2.0) - 0.5;',
        '    float tt = t * 5.0 * (0.5 + h11(gc * 0.37));',
        '    float hh = mix(h11(gc + floor(tt) * 13.7), h11(gc + (floor(tt) + 1.0) * 13.7), smoothstep(0.0, 1.0, fract(tt)));',
        '    float alto = (3.0 + 40.0 * pow(hh, 4.0)) * (0.3 + 0.7 * ex);',
        '    float g = clamp(1.0 - max(ay, 0.0) / alto, 0.0, 1.0);',
        '    g = g * g * exp(-gf * gf * 6.0);',
        '    col += mix(uColor, uHalo, 0.3) * g * (0.35 + 0.65 * ex) * 1.6 * uHorInt;',
        '  }',

        // 4. Resplandor del horizonte
        '  col += uHorizon * (exp(-max(ay, 0.0) / 70.0) * 0.12 + exp(-aay / 9.0) * 0.45) * ex * uHorInt;',

        // 5. Haz de luz: línea fina, destellos que corren y cúpula central
        '  float tramo = smoothstep(0.55, 1.0, sin(abs(ax) * 0.018 - t * uFlowSpeed * 9.0) * 0.5 + 0.5);',
        '  col += uHalo * exp(-aay / 1.6) * ex * uHaloInt * 0.2;',
        '  col += uHalo * exp(-aay / 3.0) * tramo * ex * uFlowInt * 0.6;',
        '  col += vec3(1.0) * exp(-aay / 0.7) * exp(-nx * nx * 9.0) * uHaloInt * 0.05;',
        '  float dc = length(vec2(ax, ay * 1.1)) / 26.0;',
        '  col += mix(uHalo, vec3(1.0), 0.25) * (exp(-dc * dc) * 0.16 + exp(-dc * 0.9) * 0.05) * uHaloInt;',

        '  col *= uBright;',
        '  col = 1.0 - exp(-col * 1.15);',
        '  float alfa = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);',
        '  gl_FragColor = vec4(min(col, vec3(alfa)), alfa);',
        '}'
    ].join('\n');

    function compilar(tipo, fuente) {
        var s = gl.createShader(tipo);
        gl.shaderSource(s, fuente);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('fondo-lineas: no compiló el shader', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    var vs = compilar(gl.VERTEX_SHADER, VERTICES);
    var fs = compilar(gl.FRAGMENT_SHADER, FRAGMENTOS);
    if (!vs || !fs) return;
    var programa = gl.createProgram();
    gl.attachShader(programa, vs);
    gl.attachShader(programa, fs);
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return;
    gl.useProgram(programa);

    // Un triángulo que cubre toda la pantalla
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(programa, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    function hexARgb(hex) {
        var n = parseInt(hex.replace('#', ''), 16);
        return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
    var u = function (nombre) { return gl.getUniformLocation(programa, nombre); };
    var uRes = u('uRes');
    var uDpr = u('uDpr');
    var uTime = u('uTime');
    var uHor = u('uHor');
    gl.uniform3fv(u('uColor'), hexARgb(CONFIG.color));
    gl.uniform3fv(u('uHorizon'), hexARgb(CONFIG.horizonColor));
    gl.uniform3fv(u('uHalo'), hexARgb(CONFIG.haloColor));
    gl.uniform1f(u('uRiseSpeed'), CONFIG.riseSpeed);
    gl.uniform1f(u('uRiseScale'), CONFIG.riseScale);
    gl.uniform1f(u('uRiseInt'), CONFIG.riseIntensity);
    gl.uniform1f(u('uFlowSpeed'), CONFIG.flowSpeed);
    gl.uniform1f(u('uFlowInt'), CONFIG.flowIntensity);
    gl.uniform1f(u('uHorInt'), CONFIG.horizonIntensity);
    gl.uniform1f(u('uHaloInt'), CONFIG.haloIntensity);
    gl.uniform1f(u('uScale'), CONFIG.scale);
    gl.uniform1f(u('uBright'), CONFIG.brightness);

    var sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var visible = true;
    var cuadro = null;
    var inicio = performance.now();
    var TIEMPO_FIJO = 14;

    // El lienzo va desde arriba del inicio hasta un poco por debajo del borde
    // superior de las tarjetas, y el horizonte queda horizonGap px sobre ellas.
    function ubicar() {
        if (!ancla) return;
        var alto = ancla.getBoundingClientRect().top - hero.getBoundingClientRect().top - CONFIG.horizonGap + CONFIG.spill;
        lienzo.style.height = Math.max(200, Math.round(alto)) + 'px';
    }

    function ajustarTamano() {
        ubicar();
        // Resolución limitada: el efecto es suave y así no pesa en celulares
        var dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
        var ancho = Math.max(1, Math.round(lienzo.clientWidth * dpr));
        var alto = Math.max(1, Math.round(lienzo.clientHeight * dpr));
        if (lienzo.width !== ancho || lienzo.height !== alto) {
            lienzo.width = ancho;
            lienzo.height = alto;
            gl.viewport(0, 0, ancho, alto);
        }
        gl.uniform2f(uRes, ancho, alto);
        gl.uniform1f(uDpr, ancho / Math.max(1, lienzo.clientWidth));
        gl.uniform1f(uHor, CONFIG.spill);
    }

    function dibujar(tiempo) {
        gl.uniform1f(uTime, tiempo);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function bucle(ahora) {
        cuadro = null;
        if (!visible || document.hidden) return;
        dibujar((ahora - inicio) / 1000 + TIEMPO_FIJO);
        cuadro = requestAnimationFrame(bucle);
    }

    function arrancar() {
        if (sinMovimiento) { dibujar(TIEMPO_FIJO); return; }
        if (cuadro === null && visible && !document.hidden) cuadro = requestAnimationFrame(bucle);
    }

    ajustarTamano();
    dibujar(TIEMPO_FIJO);
    lienzo.classList.add('lista');

    function alCambiar() { ajustarTamano(); if (sinMovimiento) dibujar(TIEMPO_FIJO); }
    if ('ResizeObserver' in window) {
        // Se vuelve a medir si cambia el alto del inicio o del título de las muestras
        var ro = new ResizeObserver(alCambiar);
        ro.observe(hero);
        if (ancla) ro.observe(ancla.parentElement);
    }
    window.addEventListener('resize', alCambiar);
    window.addEventListener('load', alCambiar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(alCambiar);

    // Se pausa cuando el inicio sale de pantalla o la pestaña queda oculta
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entradas) {
            visible = entradas[0].isIntersecting;
            if (visible) arrancar();
        }).observe(lienzo);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) arrancar(); });

    arrancar();
})();
