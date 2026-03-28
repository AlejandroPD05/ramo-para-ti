const colores = ["#ff4d6d","#ffd166","#00f5d4","#9b5de5","#f15bb5"];
const colorFlores = ["#ff4d6d", "#ff85a1", "#ffb3c1"]; 
const mensajeDiv = document.querySelector(".mensaje");

function animar() {
    // Reset
    gsap.killTweensOf("*");
    mensajeDiv.textContent = "";
    document.querySelectorAll(".particula").forEach(p => p.remove());
    
    const tl = gsap.timeline();

    // 1. Los tallos crecen desde el papel
    tl.fromTo(".tallo", 
        { height: 0 }, 
        { height: 180, duration: 1.2, stagger: 0.2, ease: "power2.out" }
    );

    // 2. Las flores brotan
    gsap.utils.toArray(".flor").forEach((flor, index) => {
        const petalos = flor.querySelectorAll(".petalo");
        const centro = flor.querySelector(".centro");

        // Configuración inicial de pétalos (rotados y ocultos)
        gsap.set(petalos, { 
            fill: colorFlores[index],
            rotation: (i) => i * (360 / petalos.length),
            scale: 0,
            transformOrigin: "50% 50%" // Asegura el centro en JS también
        });
        gsap.set(centro, { scale: 0, transformOrigin: "50% 50%" });

        // Animación de aparición
        tl.to([centro, petalos], {
            scale: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(2)",
            onComplete: () => crearParticulas(flor)
        }, "-=0.6");

        // Balanceo suave infinito
        gsap.to(flor, {
            y: "-=15",
            rotation: index % 2 === 0 ? 5 : -5,
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    // 3. Escribir mensaje
    tl.add(() => {
        const texto = "¡Un ramo especial para ti! 🌸";
        let i = 0;
        const escribiendo = setInterval(() => {
            mensajeDiv.textContent += texto[i];
            i++;
            if (i === texto.length) clearInterval(escribiendo);
        }, 100);
    }, "+=0.2");
}

function crearParticulas(flor) {
    const rect = flor.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
        const p = document.createElement("div");
        p.className = "particula";
        document.body.appendChild(p);
        
        const color = colores[Math.floor(Math.random() * colores.length)];
        p.style.background = color;

        // Explosión desde el centro de la flor
        gsap.fromTo(p, 
            { 
                x: rect.left + rect.width / 2, 
                y: rect.top + rect.height / 2, 
                opacity: 1,
                scale: 1
            },
            { 
                x: (rect.left + rect.width / 2) + (Math.random() * 160 - 80),
                y: (rect.top + rect.height / 2) + (Math.random() * 160 - 80),
                opacity: 0,
                scale: 0,
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => p.remove()
            }
        );
    }
}

// Iniciar al cargar
animar();

// Botón Replay
document.querySelector(".replay").addEventListener("click", animar);