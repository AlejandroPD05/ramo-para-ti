const colores = ["#ff4d6d","#ffd166","#00f5d4","#9b5de5","#f15bb5"];
// Colores de las flores, mapeados a f1, f2, f3
const colorFlores = ["#ff4d6d", "#ff85a1", "#ffb3c1"]; 
const mensajeDiv = document.querySelector(".mensaje");
const timeline = gsap.timeline();

function animar() {
    // Reset completo
    timeline.clear(); // Limpia la timeline anterior
    gsap.killTweensOf("*");
    mensajeDiv.textContent = "";
    document.querySelectorAll(".particula").forEach(p => p.remove());
    
    // Eliminar detectores de eventos anteriores de los grupos de pétalos
    gsap.utils.toArray(".petalos").forEach(petalosGroup => {
        petalosGroup.removeEventListener("click", generarParticulasClick);
    });

    // 1. Los tallos crecen
    timeline.fromTo(".tallo", 
        { height: 0 }, 
        { height: 180, duration: 1.2, stagger: 0.2, ease: "power2.out" }
    );

    // 2. Las flores fotorrealistas brotan
    gsap.utils.toArray(".flor").forEach((flor, index) => {
        const petalos = flor.querySelectorAll(".petalo");
        const centro = flor.querySelector(".centro");
        const petalosGroup = flor.querySelector(".petalos");

        // Configuración inicial de pétalos
        gsap.set(petalos, { 
            fill: colorFlores[index],
            rotation: (i) => i * (360 / petalos.length),
            scale: 0,
            transformOrigin: "50% 50%"
        });
        gsap.set(centro, { scale: 0, transformOrigin: "50% 50%" });

        // Animación de brote
        timeline.to([centro, petalos], {
            scale: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "back.out(2)",
            // Al completar, añadir el detector de eventos sobre el grupo de pétalos
            onComplete: () => {
                petalosGroup.addEventListener("click", generarParticulasClick);
            }
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

    // 3. Escribir mensaje mecanografiado (MÁS RÁPIDO: 60ms)
    timeline.add(() => {
        const texto = "¡Un ramo especial para ti! 🌸";
        let i = 0;
        const escribiendo = setInterval(() => {
            mensajeDiv.textContent += texto[i];
            i++;
            if (i === texto.length) clearInterval(escribiendo);
        }, 60); // CORRECCIÓN: Intervalo reducido de 100ms a 60ms
    }, "+=0.2");
}

// Función para manejar el clic y generar partículas del color de la flor
function generarParticulasClick(event) {
    // CORRECCIÓN INTERACTIVA: Ahora obtenemos la flor del grupo de pétalos
    const petalosGroupTarget = event.target.closest(".petalos");
    if (!petalosGroupTarget) return; // Seguridad si el clic es en un borde
    
    const florElement = petalosGroupTarget.closest(".flor");
    const florIndex = gsap.utils.toArray(".flor").indexOf(florElement);
    const florColor = colorFlores[florIndex % colorFlores.length];
    
    crearParticulasDeColor(florElement, florColor);
}

function crearParticulasDeColor(flor, color) {
    const rect = flor.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
        const p = document.createElement("div");
        p.className = "particula";
        document.body.appendChild(p);
        
        p.style.background = color; // Usar el color de la flor

        // Explosión desde el centro de la flor (45px fotorrealistas)
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