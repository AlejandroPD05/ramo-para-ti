// Una lista más variada y alegre de colores para las flores
const colores = [
    "#ff4d6d", // Rojo rosado
    "#ffd166", // Amarillo naranja
    "#00f5d4", // Turquesa
    "#9b5de5", // Violeta
    "#f15bb5", // Rosa chicle
    "#ff9f43", // Naranja vibrante
    "#0984e3"  // Azul brillante
];
// Vacío para forzar colores aleatorios cada vez que se pulse 'Repetir'
const colorFlores = []; 

const mensajeDiv = document.querySelector(".mensaje");

function animar() {
    // Reset completo
    gsap.killTweensOf("*");
    mensajeDiv.textContent = "";
    document.querySelectorAll(".particula").forEach(p => p.remove());

    const tl = gsap.timeline();

    // 1. Los tallos crecen desde el envoltorio
    tl.fromTo(".tallo",
        {height: 0},
        {height: 120, duration: 1.5, stagger: 0.3, ease: "power2.out"}
    );

    // 2. Las flores brotan y se abren
    gsap.utils.toArray(".flor").forEach((flor, index) => {
        const petalos = flor.querySelectorAll(".petalo");
        const centro = flor.querySelector(".centro");

        // Elegimos un color aleatorio para cada flor
        const randomColor = colores[Math.floor(Math.random() * colores.length)];
        gsap.set(petalos, {fill: randomColor});

        // CLAVE: Distribuir pétalos en círculo alrededor del centro (50,50)
        gsap.set(petalos, {
            rotation: (i) => i * (360 / petalos.length),
            scale: 0,
            transformOrigin: "50% 50%" // Punto de giro central
        });
        gsap.set(centro, {scale: 0, transformOrigin: "50% 50%"});

        // Animación de aparición (Back ease hace que 'reboten' al abrirse)
        tl.to([centro, petalos], {
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: "back.out(2.5)",
            // Explosión de partículas al terminar de abrirse
            onComplete: () => crearEstallidoParticulas(flor, randomColor)
        }, "-=1.0"); // Empieza un poco antes de que termine el tallo

        // Movimiento vivo horizontal (balanceo suave)
        gsap.to(flor, {
            x: index % 2 === 0 ? "+=10" : "-=10",
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Movimiento giratorio casi imperceptible de los pétalos
        petalos.forEach(p => {
            gsap.to(p, {
                rotation: "+=5",
                repeat: -1,
                yoyo: true,
                duration: 3 + Math.random(),
                ease: "sine.inOut"
            });
        });
    });

    // 3. Mensaje mecanografiado con el texto de tu imagen
    tl.add(() => {
        const texto = "¡Un ramo especial para ti! 🌸";
        let i = 0;
        const escribiendo = setInterval(() => {
            mensajeDiv.textContent += texto[i];
            i++;
            if (i === texto.length) clearInterval(escribiendo);
        }, 100); // Velocidad de escritura
    }, "+=0.5");
}

// Crea una explosión de partículas del color de la flor
function crearEstallidoParticulas(flor, color) {
    const rect = flor.getBoundingClientRect();
    // Centro de la flor en la pantalla
    const x0 = rect.left + rect.width / 2;
    const y0 = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
        const part = document.createElement("div");
        part.className = "particula";
        document.body.appendChild(part);
        
        // Las partículas son del color de la flor pero con brillo blanco
        part.style.background = color;
        part.style.boxShadow = `0 0 10px white, 0 0 5px ${color}`;

        // Explosión radial
        gsap.fromTo(part,
            {x: x0, y: y0, opacity: 1, scale: Math.random() * 0.7 + 0.3},
            {
                // Dirección aleatoria
                x: x0 + (Math.random() * 160 - 80),
                y: y0 + (Math.random() * 160 - 80),
                opacity: 0,
                scale: 0,
                duration: 1.5 + Math.random() * 0.5,
                ease: "power2.out",
                // Limpieza del DOM
                onComplete: () => part.remove()
            }
        );
    }
}

// Iniciar al cargar la página
animar();

// Botón Replay
document.querySelector(".replay").addEventListener("click", animar);