const mensajeDiv = document.querySelector(".mensaje");

function animar() {
    // Reset completo
    gsap.killTweensOf("*");
    mensajeDiv.textContent = "";
    document.querySelectorAll(".particula").forEach(p => p.remove());
    
    const tl = gsap.timeline();

    // 1. Los tallos crecen coordinados (\ | /)
    tl.fromTo(".tallo", 
        { height: 0 }, 
        { height: 100, duration: 1.5, stagger: 0.3, ease: "power2.out" }
    );

    // 2. Las flores fotorrealistas brotan
    tl.to(".flor-img, .flor-centro-btn", {
        scale: 1,
        duration: 0.8,
        ease: "back.out(2)",
        stagger: 0.2,
        onComplete: () => {
            // Añadir detector de eventos a los botones centrales
            document.querySelectorAll(".flor-centro-btn").forEach(btn => {
                btn.addEventListener("click", generarParticulasClick);
            });
        }
    }, "-=1.0"); // Empieza un poco antes de que terminen los tallos

    // 3. Escribir mensaje mecanografiado
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

// Función para manejar el clic y generar partículas del color de la flor
function generarParticulasClick(event) {
    const centroTarget = event.target;
    const color = centroTarget.getAttribute("data-color");
    const florElement = centroTarget.closest(".tallo-container");
    
    crearParticulasDeColor(florElement, color);
}

function crearParticulasDeColor(flor, color) {
    const rect = flor.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
        const p = document.createElement("div");
        p.className = "particula";
        document.body.appendChild(p);
        
        p.style.background = color; // Usar el color de la flor

        // Explosión desde el centro fotorrealista (rect.left, rect.top + 45)
        gsap.fromTo(p, 
            { 
                x: rect.left + rect.width / 2, 
                y: rect.top + 45, // Ajusta esta coordenada para que nazca del centro brillante
                opacity: 1,
                scale: 1
            },
            { 
                x: (rect.left + rect.width / 2) + (Math.random() * 160 - 80),
                y: (rect.top + 45) + (Math.random() * 160 - 80),
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