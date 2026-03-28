const colores = ["#ff4d6d","#ffd166","#00f5d4","#9b5de5","#f15bb5"];
const colorFlores = ["#ff758c", "#ffcc33", "#b28dff"]; 
const mensajeDiv = document.querySelector(".mensaje");

function animar() {
    // 1. Reset completo
    gsap.killTweensOf("*");
    mensajeDiv.textContent = "";
    document.querySelectorAll(".particula").forEach(p => p.remove());
    
    const tl = gsap.timeline();

    // 2. Animación de los tallos (Crecen desde el papel)
    tl.fromTo(".tallo", 
        { height: 0 }, 
        { height: 160, duration: 1.5, stagger: 0.3, ease: "power2.out" }
    );

    // 3. Animación de cada flor
    gsap.utils.toArray(".flor").forEach((flor, index) => {
        const petalos = flor.querySelectorAll(".petalo");
        const centro = flor.querySelector(".centro");

        // Color y rotación inicial de pétalos
        gsap.set(petalos, { 
            fill: colorFlores[index],
            rotation: (i) => i * (360 / petalos.length),
            scale: 0
        });
        gsap.set(centro, { scale: 0 });

        // Aparecer flores después de que crezca su tallo
        tl.to([centro, petalos], {
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(2)",
            onComplete: () => crearParticulas(flor)
        }, "-=0.5"); // Empieza un poco antes de que termine el tallo

        // Movimiento sutil infinito
        gsap.to(flor, {
            y: "-=10",
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    // 4. Mensaje mecanografiado
    tl.add(() => {
        const texto = "¡Un ramo especial para ti! 🌸";
        let i = 0;
        const interval = setInterval(() => {
            mensajeDiv.textContent += texto[i];
            i++;
            if (i === texto.length) clearInterval(interval);
        }, 100);
    }, "+=0.5");
}

function crearParticulas(flor) {
    const rect = flor.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const p = document.createElement("div");
        p.className = "particula";
        document.body.appendChild(p);
        
        const color = colores[Math.floor(Math.random() * colores.length)];
        p.style.background = color;

        gsap.fromTo(p, 
            { x: rect.left + 45, y: rect.top + 45, opacity: 1 },
            { 
                x: rect.left + 45 + (Math.random() * 100 - 50),
                y: rect.top + 45 + (Math.random() * 100 - 50),
                opacity: 0,
                duration: 1,
                onComplete: () => p.remove()
            }
        );
    }
}

// Iniciar
animar();

// Botón de reinicio
document.querySelector(".replay").addEventListener("click", animar);