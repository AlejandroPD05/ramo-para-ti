const colores = ["#ff4d6d","#ffd166","#00f5d4","#9b5de5","#f15bb5"];
const mensajeDiv = document.querySelector(".mensaje");

function animar() {
    gsap.killTweensOf("*");
    mensajeDiv.textContent = "";
    document.querySelectorAll(".particula").forEach(p => p.remove());
    
    const tl = gsap.timeline();

    tl.fromTo(".tallo", 
        { height: 0 }, 
        { height: 180, duration: 1, stagger: 0.2, ease: "power2.out" }
    );

    gsap.utils.toArray(".flor").forEach((flor, index) => {
        const petalos = flor.querySelectorAll(".petalo");
        const centro = flor.querySelector(".centro");
        const randomColor = colores[Math.floor(Math.random() * colores.length)];

        gsap.set(petalos, { 
            fill: randomColor,
            rotation: (i) => i * (360 / petalos.length),
            scale: 0
        });
        gsap.set(centro, { scale: 0 });

        tl.to([centro, petalos], {
            scale: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(2)",
            onComplete: () => crearParticulas(flor)
        }, "-=0.5");
    });

    tl.add(() => {
        const texto = "¡Un ramo especial para ti! 🌸";
        let i = 0;
        const escribiendo = setInterval(() => {
            mensajeDiv.textContent += texto[i];
            i++;
            if (i === texto.length) clearInterval(escribiendo);
        }, 800 / texto.length);
    });
}

function crearParticulas(flor) {
    const rect = flor.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
        const p = document.createElement("div");
        p.className = "particula";
        p.style.background = colores[Math.floor(Math.random() * colores.length)];
        document.body.appendChild(p);

        gsap.fromTo(p, 
            { x: centroX, y: centroY, opacity: 1, scale: 1 },
            { 
                x: centroX + (Math.random() * 200 - 100),
                y: centroY + (Math.random() * 200 - 100),
                opacity: 0,
                scale: 0,
                duration: 1.5,
                onComplete: () => p.remove()
            }
        );
    }
}

animar();
document.querySelector(".replay").addEventListener("click", animar);