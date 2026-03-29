const NS = "http://www.w3.org/2000/svg";

const PALETAS = [
    { petalo: '#ff4d7d', centro: '#ffe066' },
    { petalo: '#ff8c42', centro: '#fff176' },
    { petalo: '#a855f7', centro: '#fde68a' },
    { petalo: '#22d3ee', centro: '#fef08a' },
    { petalo: '#f472b6', centro: '#fef9c3' },
    { petalo: '#facc15', centro: '#fde68a' }
];

const FLORES_CONFIG = [
    { x: 88,  y: 90,  rot: -28, escala: 1.0,  numPetalos: 6 },
    { x: 170, y: 55,  rot: 2,   escala: 1.15, numPetalos: 8 },
    { x: 252, y: 90,  rot: 22,  escala: 1.0,  numPetalos: 6 },
    { x: 118, y: 165, rot: -14, escala: 0.85, numPetalos: 5 },
    { x: 222, y: 165, rot: 16,  escala: 0.85, numPetalos: 5 },
    { x: 170, y: 150, rot: 5,   escala: 0.75, numPetalos: 6 }
];

const TALLOS_CONFIG = [
    { x1: 148, y1: 305, x2: 88,  y2: 90,  curva: -30 },
    { x1: 170, y1: 302, x2: 170, y2: 55,  curva: 0   },
    { x1: 192, y1: 305, x2: 252, y2: 90,  curva: 30  },
    { x1: 155, y1: 304, x2: 118, y2: 165, curva: -15 },
    { x1: 185, y1: 304, x2: 222, y2: 165, curva: 15  },
    { x1: 170, y1: 303, x2: 170, y2: 150, curva: 0   }
];

// Estrellas
(function() {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*1.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,240,255,${Math.random()*0.5})`;
        ctx.fill();
    }
})();

function crearParticulas(x, y, color) {
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'particula';
        p.style.background = color;
        p.style.width = p.style.height = (Math.random() * 6 + 4) + 'px';
        p.style.left = x + 'px'; p.style.top = y + 'px';
        document.body.appendChild(p);
        const a = Math.random() * Math.PI * 2;
        const d = Math.random() * 80 + 40;
        gsap.to(p, {
            x: Math.cos(a) * d, y: Math.sin(a) * d,
            opacity: 0, scale: 0, duration: 1, ease: "power2.out",
            onComplete: () => p.remove()
        });
    }
}

function crearFlor(cfg, paleta, id) {
    const g = document.createElementNS(NS, 'g');
    g.id = 'flor-' + id;
    g.style.cursor = 'pointer';

    gsap.set(g, {
        x: cfg.x,
        y: cfg.y,
        rotation: cfg.rot,
        scale: 0, // Empieza invisible
        transformOrigin: "0px 0px"
    });

    const nP = cfg.numPetalos;
    const ryP = 16; 

    for (let i = 0; i < nP; i++) {
        const pg = document.createElementNS(NS, 'g');
        pg.setAttribute('transform', `rotate(${(360/nP)*i})`);
        const petalo = document.createElementNS(NS, 'ellipse');
        petalo.setAttribute('cx', '0'); petalo.setAttribute('cy', -ryP * 0.7);
        petalo.setAttribute('rx', '10'); petalo.setAttribute('ry', ryP);
        petalo.setAttribute('fill', paleta.petalo);
        pg.appendChild(petalo);
        g.appendChild(pg);
    }

    const centro = document.createElementNS(NS, 'circle');
    centro.setAttribute('r', '8');
    centro.setAttribute('fill', paleta.centro);
    centro.setAttribute('filter', 'url(#glow-centro)');
    g.appendChild(centro);

    g.addEventListener('click', (e) => {
        crearParticulas(e.clientX, e.clientY, paleta.petalo);
        gsap.fromTo(centro, { r: 8 }, { r: 13, duration: 0.2, yoyo: true, repeat: 1 });
    });

    return g;
}

function animar() {
    // *** CAMBIO CLAVE: Limpiamos tweens/intervalos anteriores para evitar errores y destellos ***
    gsap.killTweensOf("*");
    if (window.typingInterval) clearInterval(window.typingInterval);

    const gFlores = document.getElementById('g-flores');
    gFlores.innerHTML = '';
    document.getElementById('mensaje').textContent = '';
    
    // Ocultar el papel para re-animarlo
    gsap.set('#g-papel', { opacity: 0 });

    // *** CAMBIO CLAVE: Desordenar aleatoriamente las paletas para cambiar los colores ***
    const shuffledPalettes = [...PALETAS].sort(() => 0.5 - Math.random());

    const tl = gsap.timeline();

    TALLOS_CONFIG.forEach((cfg, i) => {
        const t = document.createElementNS(NS, 'path');
        t.setAttribute('d', `M ${cfg.x1} ${cfg.y1} Q ${(cfg.x1+cfg.x2)/2 + cfg.curva} ${(cfg.y1+cfg.y2)/2} ${cfg.x2} ${cfg.y2}`);
        t.setAttribute('stroke', '#2d6a4f'); t.setAttribute('stroke-width', '3'); t.setAttribute('fill', 'none');
        gFlores.appendChild(t);

        const len = t.getTotalLength();
        gsap.set(t, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(t, { strokeDashoffset: 0, duration: 1 }, i * 0.15);

        // *** CAMBIO CLAVE: Usamos la paleta desordenada aleatoria ***
        const flowerPalette = shuffledPalettes[i % shuffledPalettes.length];
        const f = crearFlor(FLORES_CONFIG[i], flowerPalette, i);
        gFlores.appendChild(f);

        tl.to(f, { 
            scale: FLORES_CONFIG[i].escala, 
            duration: 0.8, 
            ease: "back.out(1.7)",
            onComplete: () => {
                // Balanceo (brisa)
                gsap.to(f, { 
                    rotation: "+=5", 
                    duration: 2 + Math.random(), 
                    repeat: -1, yoyo: true, ease: "sine.inOut" 
                });
            }
        }, "-=0.6");
    });

    tl.to('#g-papel', { opacity: 1, duration: 0.8 }, 0);
    tl.add(() => {
        const txt = '¡Para ti con mucho cariño! 🌸';
        let k = 0;
        // Guardamos el intervalo en una variable global para poder limpiarlo al reiniciar
        window.typingInterval = setInterval(() => {
            document.getElementById('mensaje').textContent += txt[k++];
            if (k === txt.length) clearInterval(window.typingInterval);
        }, 60);
    }, "+=0.2");
}

document.getElementById('btn-replay').addEventListener('click', animar);
animar();