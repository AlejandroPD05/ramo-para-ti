// ─── Estrellas de fondo ───────────────────────────────────────────────────────
(function() {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for (let i = 0; i < 120; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 1.2;
        const alpha = Math.random() * 0.6 + 0.1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,255,${alpha})`;
        ctx.fill();
    }
})();

// ─── Paletas de colores ───────────────────────────────────────────────────────
const PALETAS = [
    { petalo: '#ff4d7d', centro: '#ffe066', oscuro: '#c0124a', claro: '#ffb3cc' },
    { petalo: '#ff8c42', centro: '#fff176', oscuro: '#c05a00', claro: '#ffd4a8' },
    { petalo: '#a855f7', centro: '#fde68a', oscuro: '#6b21a8', claro: '#ddb6ff' },
    { petalo: '#22d3ee', centro: '#fef08a', oscuro: '#0e7490', claro: '#a5f3fc' },
    { petalo: '#f472b6', centro: '#fef9c3', oscuro: '#9d174d', claro: '#fbcfe8' },
    { petalo: '#facc15', centro: '#fde68a', oscuro: '#a16207', claro: '#fef08a' },
    { petalo: '#34d399', centro: '#fefce8', oscuro: '#065f46', claro: '#a7f3d0' },
    { petalo: '#f87171', centro: '#fef08a', oscuro: '#991b1b', claro: '#fecaca' },
];

// ─── Config flores ────────────────────────────────────────────────────────────
const FLORES_CONFIG = [
    { x: 88,  y: 90,  rot: -28, escala: 1.0,  numPetalos: 6, tipo: 'redonda' },
    { x: 170, y: 55,  rot: 2,   escala: 1.15, numPetalos: 8, tipo: 'redonda' },
    { x: 252, y: 90,  rot: 22,  escala: 1.0,  numPetalos: 6, tipo: 'redonda' },
    { x: 118, y: 165, rot: -14, escala: 0.85, numPetalos: 5, tipo: 'punta'   },
    { x: 222, y: 165, rot: 16,  escala: 0.85, numPetalos: 5, tipo: 'punta'   },
    { x: 170, y: 150, rot: 5,   escala: 0.75, numPetalos: 6, tipo: 'punta'   },
];

// ─── Config tallos (x2,y2 = centro exacto de cada flor) ──────────────────────
const TALLOS_CONFIG = [
    { x1: 148, y1: 305, x2: 88,  y2: 90,  curva: -30 },
    { x1: 170, y1: 302, x2: 170, y2: 55,  curva: 0   },
    { x1: 192, y1: 305, x2: 252, y2: 90,  curva: 30  },
    { x1: 155, y1: 304, x2: 118, y2: 165, curva: -15 },
    { x1: 185, y1: 304, x2: 222, y2: 165, curva: 15  },
    { x1: 170, y1: 303, x2: 170, y2: 150, curva: 0   },
];

// ─── Config hojas ─────────────────────────────────────────────────────────────
const HOJAS_CONFIG = [
    { talloIdx: 0, t: 0.45, lado: -1 },
    { talloIdx: 2, t: 0.45, lado: 1  },
    { talloIdx: 1, t: 0.5,  lado: -1 },
    { talloIdx: 1, t: 0.5,  lado: 1  },
    { talloIdx: 3, t: 0.5,  lado: -1 },
    { talloIdx: 4, t: 0.5,  lado: 1  },
];

const NS = "http://www.w3.org/2000/svg";
let paletas = [];

// Convierte coordenadas SVG a coordenadas de pantalla
function svgAScreen(x, y) {
    const svg = document.getElementById('ramo-svg');
    const pt = svg.createSVGPoint();
    pt.x = x; pt.y = y;
    const s = pt.matrixTransform(svg.getScreenCTM());
    return { x: s.x, y: s.y };
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function bezierPunto(x1, y1, cx, cy, x2, y2, t) {
    const mt = 1 - t;
    return {
        x: mt*mt*x1 + 2*mt*t*cx + t*t*x2,
        y: mt*mt*y1 + 2*mt*t*cy + t*t*y2,
        dx: 2*mt*(cx-x1) + 2*t*(x2-cx),
        dy: 2*mt*(cy-y1) + 2*t*(y2-cy),
    };
}

function crearPetalo(tipo, rx, ry) {
    const el = document.createElementNS(NS, 'ellipse');
    el.setAttribute('cx', '0');
    el.setAttribute('cy', tipo === 'punta' ? -ry * 0.55 : -ry * 0.5);
    el.setAttribute('rx', String(rx));
    el.setAttribute('ry', String(ry));
    return el;
}

function crearFlor(cfg, paleta, id) {
    const g = document.createElementNS(NS, 'g');
    g.id = 'flor-' + id;
    g.setAttribute('transform', `translate(${cfg.x}, ${cfg.y}) rotate(${cfg.rot}) scale(${cfg.escala})`);
    g.style.opacity = '0';

    const nP = cfg.numPetalos;
    const rxP = cfg.tipo === 'punta' ? 9 : 11;
    const ryP = cfg.tipo === 'punta' ? 22 : 18;

    for (let i = 0; i < nP; i++) {
        const ang = (360 / nP) * i;
        const pg = document.createElementNS(NS, 'g');
        pg.setAttribute('transform', `rotate(${ang})`);
        pg.setAttribute('class', 'petalo-g');

        const pb = crearPetalo(cfg.tipo, rxP * 0.7, ryP);
        pb.setAttribute('fill', paleta.oscuro);
        pb.setAttribute('opacity', '0.5');
        pg.appendChild(pb);

        const pp = crearPetalo(cfg.tipo, rxP, ryP);
        pp.setAttribute('fill', paleta.petalo);
        pp.setAttribute('opacity', '0.95');
        pg.appendChild(pp);

        const cy0 = cfg.tipo === 'punta' ? -ryP * 0.55 : -ryP * 0.5;
        const vena = document.createElementNS(NS, 'line');
        vena.setAttribute('x1', '0'); vena.setAttribute('y1', '0');
        vena.setAttribute('x2', '0'); vena.setAttribute('y2', String(cy0 - ryP * 0.4));
        vena.setAttribute('stroke', paleta.claro);
        vena.setAttribute('stroke-width', '1');
        vena.setAttribute('opacity', '0.5');
        pg.appendChild(vena);

        g.appendChild(pg);
    }

    const nI = Math.ceil(nP / 2);
    for (let i = 0; i < nI; i++) {
        const ang = (360 / nI) * i + (180 / nP);
        const pg2 = document.createElementNS(NS, 'g');
        pg2.setAttribute('transform', `rotate(${ang})`);
        const pi = document.createElementNS(NS, 'ellipse');
        pi.setAttribute('cx', '0');
        pi.setAttribute('cy', String(-ryP * 0.28));
        pi.setAttribute('rx', String(rxP * 0.5));
        pi.setAttribute('ry', String(ryP * 0.4));
        pi.setAttribute('fill', paleta.claro);
        pi.setAttribute('opacity', '0.75');
        pg2.appendChild(pi);
        g.appendChild(pg2);
    }

    // Centro con glow e interacción
    const centroG = document.createElementNS(NS, 'g');
    centroG.setAttribute('filter', 'url(#glow-centro)');
    centroG.style.cursor = 'pointer';

    const centro = document.createElementNS(NS, 'circle');
    centro.setAttribute('cx', '0'); centro.setAttribute('cy', '0');
    centro.setAttribute('r', cfg.tipo === 'punta' ? '8' : '10');
    centro.setAttribute('fill', paleta.centro);
    centroG.appendChild(centro);

    // Zona de click ampliada invisible
    const hitArea = document.createElementNS(NS, 'circle');
    hitArea.setAttribute('cx', '0'); hitArea.setAttribute('cy', '0');
    hitArea.setAttribute('r', '16');
    hitArea.setAttribute('fill', 'transparent');
    centroG.appendChild(hitArea);

    for (let i = 0; i < 6; i++) {
        const ang = (Math.PI * 2 / 6) * i;
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx', String(Math.cos(ang) * 4.5));
        dot.setAttribute('cy', String(Math.sin(ang) * 4.5));
        dot.setAttribute('r', '1.5');
        dot.setAttribute('fill', paleta.oscuro);
        dot.setAttribute('opacity', '0.6');
        centroG.appendChild(dot);
    }

    // Click → partículas + pulso
    centroG.addEventListener('click', (e) => {
        e.stopPropagation();
        const pos = svgAScreen(cfg.x, cfg.y);
        crearParticulas(pos.x, pos.y, paleta.petalo, 22, paleta.claro);
        gsap.fromTo(centro,
            { attr: { r: cfg.tipo === 'punta' ? 8 : 10 } },
            { attr: { r: cfg.tipo === 'punta' ? 14 : 17 }, duration: 0.15,
              ease: 'power2.out', yoyo: true, repeat: 1 }
        );
    });

    g.appendChild(centroG);
    return g;
}

function crearTallo(cfg, id) {
    const cx = (cfg.x1 + cfg.x2) / 2 + cfg.curva;
    const cy = (cfg.y1 + cfg.y2) / 2;
    const path = document.createElementNS(NS, 'path');
    path.id = 'tallo-' + id;
    path.setAttribute('d', `M ${cfg.x1} ${cfg.y1} Q ${cx} ${cy} ${cfg.x2} ${cfg.y2}`);
    path.setAttribute('stroke', '#2d6a4f');
    path.setAttribute('stroke-width', id < 3 ? '3.5' : '2.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.style.opacity = '0';
    const len = path.getTotalLength?.() || 200;
    path.setAttribute('stroke-dasharray', String(len + 5));
    path.setAttribute('stroke-dashoffset', String(len + 5));
    return path;
}

function crearHoja(talloIdx, t, lado) {
    const cfg = TALLOS_CONFIG[talloIdx];
    const cx = (cfg.x1 + cfg.x2) / 2 + cfg.curva;
    const cy = (cfg.y1 + cfg.y2) / 2;
    const pt = bezierPunto(cfg.x1, cfg.y1, cx, cy, cfg.x2, cfg.y2, t);
    const ang = Math.atan2(pt.dy, pt.dx) * 180 / Math.PI + 90 + lado * 45;

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `translate(${pt.x}, ${pt.y}) rotate(${ang + (lado > 0 ? 30 : -30)})`);
    g.style.opacity = '0';

    const hoja = document.createElementNS(NS, 'ellipse');
    hoja.setAttribute('cx', '0'); hoja.setAttribute('cy', '-14');
    hoja.setAttribute('rx', '6'); hoja.setAttribute('ry', '14');
    hoja.setAttribute('fill', '#40916c');
    hoja.setAttribute('opacity', '0.85');
    g.appendChild(hoja);

    const vena = document.createElementNS(NS, 'line');
    vena.setAttribute('x1', '0'); vena.setAttribute('y1', '0');
    vena.setAttribute('x2', '0'); vena.setAttribute('y2', '-24');
    vena.setAttribute('stroke', '#74c69d');
    vena.setAttribute('stroke-width', '0.8');
    vena.setAttribute('opacity', '0.5');
    g.appendChild(vena);

    return g;
}

function buildSVG() {
    const gFlores = document.getElementById('g-flores');
    gFlores.innerHTML = '';
    paletas = shuffle(PALETAS).slice(0, 6);

    TALLOS_CONFIG.forEach((cfg, i) => gFlores.appendChild(crearTallo(cfg, i)));

    HOJAS_CONFIG.forEach((hcfg, i) => {
        const h = crearHoja(hcfg.talloIdx, hcfg.t, hcfg.lado);
        h.id = 'hoja-' + i;
        gFlores.appendChild(h);
    });

    FLORES_CONFIG.forEach((cfg, i) => gFlores.appendChild(crearFlor(cfg, paletas[i], i)));
}

// ─── ANIMACIÓN PRINCIPAL ─────────────────────────────────────────────────────
function animar() {
    gsap.killTweensOf('*');
    document.querySelectorAll('.particula').forEach(p => p.remove());
    document.getElementById('mensaje').textContent = '';

    buildSVG();

    const tl = gsap.timeline();

    tl.to('#g-papel', { opacity: 1, duration: 0.5, ease: 'power2.out' });

    tl.fromTo('#g-lazo', { scaleX: 0, transformOrigin: '170px 308px' },
        { scaleX: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.1');

    TALLOS_CONFIG.forEach((_, i) => {
        const el = document.getElementById('tallo-' + i);
        if (!el) return;
        const len = el.getTotalLength?.() || 200;
        el.setAttribute('stroke-dasharray', String(len + 5));
        el.setAttribute('stroke-dashoffset', String(len + 5));
        tl.to(el, {
            opacity: 1,
            attr: { 'stroke-dashoffset': 0 },
            duration: 0.7 + i * 0.07,
            ease: 'power2.out'
        }, 0.6 + i * 0.1);
    });

    HOJAS_CONFIG.forEach((_, i) => {
        tl.to('#hoja-' + i, {
            opacity: 1, scale: 1,
            transformOrigin: 'center center',
            duration: 0.4,
            ease: 'back.out(1.8)'
        }, 1.0 + i * 0.08);
    });

    FLORES_CONFIG.forEach((cfg, i) => {
        const el = document.getElementById('flor-' + i);
        if (!el) return;

        gsap.set(el, { scale: 0, transformOrigin: `${cfg.x}px ${cfg.y}px` });

        tl.to(el, {
            opacity: 1, scale: 1,
            transformOrigin: `${cfg.x}px ${cfg.y}px`,
            duration: 0.6,
            ease: 'elastic.out(1.1, 0.5)',
            onComplete: () => {
                const pos = svgAScreen(cfg.x, cfg.y);
                crearParticulas(pos.x, pos.y, paletas[i].petalo);
            }
        }, 1.2 + i * 0.18);

        const petGrupos = el.querySelectorAll('.petalo-g');
        gsap.set(petGrupos, { scale: 0, transformOrigin: '0px 0px' });
        tl.to(petGrupos, {
            scale: 1, stagger: 0.04,
            duration: 0.5, ease: 'back.out(2)',
        }, 1.25 + i * 0.18);
    });

    tl.add(() => {
        const texto = '¡Un ramo especial para ti! 🌸';
        let k = 0;
        const iv = setInterval(() => {
            document.getElementById('mensaje').textContent += texto[k++];
            if (k === texto.length) clearInterval(iv);
        }, 65);
    }, '+=0.3');
}

// ─── PARTÍCULAS ───────────────────────────────────────────────────────────────
function crearParticulas(cx, cy, color, cantidad = 14, colorAlt = null) {
    for (let i = 0; i < cantidad; i++) {
        const p = document.createElement('div');
        p.className = 'particula';
        p.style.background = (colorAlt && i % 3 === 0) ? colorAlt : color;
        const size = 4 + Math.random() * 5;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        document.body.appendChild(p);
        const angulo = (Math.PI * 2 / cantidad) * i + Math.random() * 0.4;
        const dist = 55 + Math.random() * 110;
        gsap.fromTo(p,
            { x: cx, y: cy, scale: 1, opacity: 1 },
            {
                x: cx + Math.cos(angulo) * dist,
                y: cy + Math.sin(angulo) * dist,
                scale: 0, opacity: 0,
                duration: 0.9 + Math.random() * 0.7,
                ease: 'power2.out',
                onComplete: () => p.remove()
            }
        );
    }
}

// ─── Botón ────────────────────────────────────────────────────────────────────
document.getElementById('btn-replay').addEventListener('click', animar);
animar();