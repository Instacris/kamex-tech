/* ============================================================
   PRECIOS DE KAMEX TECH — fuente única
   Todo monto que aparece en el sitio sale de aquí: las tarjetas
   de planes (opción A), el panel de la opción B y la línea "menos
   que dos deliverys". Para cambiar un precio, cámbialo solo aquí.

   El HTML trae los mismos valores escritos como respaldo (para
   buscadores y por si el JavaScript no carga); script.js los
   reemplaza por estos al abrir la página.

   Montos en pesos chilenos (CLP), sin puntos.
   ============================================================ */
window.KAMEX_PRECIOS = Object.freeze({

    // Tarjetas de "Nuestros Planes": `desarrollo` es la opción A (pago único)
    // y `mensual` la opción B (mensualidad sin pago inicial)
    planes: {
        basico:  { desarrollo: 280000, mensual: 25000 },
        premium: { desarrollo: 450000, mensual: 45000 },
        medida:  { desarrollo: 900000, mensual: 90000 }  // ambos "desde"
    }
});
