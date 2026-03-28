const colores = ["#ff4d6d", "#ffd166", "#00f5d4", "#9b5de5", "#f15bb5"];
const mensajeDiv = document.querySelector(".mensaje");

function crearPetalosBase() {
    document.querySelectorAll(".capa-petalos").forEach(capa => {
        capa.innerHTML = ""; // Limpiar
        // Crear 8 pétalos por flor
        for (let i = 0; i < 8; i++) {
            const p = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            p.setAttribute("class", "petalo");
            p.setAttribute("cx", "50");
            p.setAttribute("cy", "30"); // Desplazados del centro
            p.setAttribute("rx", "15");
            p.setAttribute("ry", "25");
            capa.appendChild(p);
        }
    });
}

function animar() {
    gsap.killTweensOf("*");
    mensajeDiv.textContent = "";
    document.querySelectorAll(".particula").forEach(p => p.remove());
    crearPetalosBase();
    
    const tl = gsap.timeline();

    // 1. Crecimiento de tallos
    tl.to(".tallo", {
        height: 200,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out"
    });

    // 2. Aparición de flores
    document.querySelectorAll(".flor-completa").forEach((fc, index) => {
        const flor = fc.querySelector(".flor");
        const petalos = fc.querySelectorAll(".petalo");
        const centro = fc.querySelector(".centro");
        const color = colores[Math.floor(Math.random() * colores.length)];

        // Configuración inicial de pétalos en círculo
        gsap.set(petalos, { 
            fill: color,
            rotation: (i) => i * 45,
            scale: 0
        });

        tl.to(flor, { scale: 1, duration: 0.5 }, "-=0.8");
        
        tl.to([petalos, centro], {
            scale: 1,
            stagger: 0.05,
            duration: 0.7,
            ease: "back.out(2)",
            onComplete: () => crearParticulas(flor, color)
        }, "-=0.5");
    });

    // 3. Mensaje
    tl.add(() => {
        const texto = "¡Un ramo especial para ti! 🌸";
        let i = 0;
        const interval = setInterval(() => {
            mensajeDiv.textContent += texto[i];
            i++;
            if (i === texto.length) clearInterval(interval);
        }, 70);
    }, "+=0.2");
}

function crearParticulas(flor, color) {
    const rect = flor.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const p = document.createElement("div");
        p.className = "particula";
        p.style.background = color;
        document.body.appendChild(p);

        gsap.fromTo(p, 
            { x: cx, y: cy, scale: 1, opacity: 1 },
            { 
                x: cx + (Math.random() * 160 - 80),
                y: cy + (Math.random() * 160 - 80),
                scale: 0,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => p.remove()
            }
        );
    }
}

animar();
document.querySelector(".replay").addEventListener("click", animar);