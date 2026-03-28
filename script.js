const colores = ["#ff4d6d", "#ffdb58", "#9b5de5", "#f15bb5", "#00f5d4"];

function crearPetalos() {
    document.querySelectorAll('.petalos-grp').forEach((grp, fIdx) => {
        grp.innerHTML = ''; // Limpiar
        const numPetalos = 6;
        for (let i = 0; i < numPetalos; i++) {
            const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            el.setAttribute("cx", "50"); el.setAttribute("cy", "25");
            el.setAttribute("rx", "12"); el.setAttribute("ry", "25");
            el.setAttribute("class", "petalo");
            el.style.fill = colores[fIdx % colores.length];
            el.style.transform = `rotate(${i * (360 / numPetalos)}deg)`;
            grp.appendChild(el);
        }
    });
}

function iniciarAnimacion() {
    crearPetalos();
    const tl = gsap.timeline();
    
    // Reset
    gsap.set(".tallo", { height: 0 });
    gsap.set(".flor", { scale: 0 });
    document.querySelector(".mensaje").textContent = "";

    // 1. Tallos crecen
    tl.to(".tallo", { height: 200, duration: 1, stagger: 0.2 });
    
    // 2. Flores brotan
    tl.to(".flor", { scale: 1, duration: 0.8, ease: "back.out(2)", stagger: 0.2 }, "-=0.5");

    // 3. Texto rápido con glow
    tl.add(() => {
        const txt = "¡Un ramo especial para ti! 🌸";
        let i = 0;
        const interval = setInterval(() => {
            document.querySelector(".mensaje").textContent += txt[i];
            i++;
            if (i === txt.length) clearInterval(interval);
        }, 50); // 50ms para que sea rápido
    });
}

function estallar(el, color) {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
        const p = document.createElement("div");
        p.className = "particula";
        p.style.width = p.style.height = Math.random() * 8 + 4 + "px";
        p.style.background = color;
        p.style.left = centerX + "px";
        p.style.top = centerY + "px";
        document.body.appendChild(p);

        gsap.to(p, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 0,
            duration: 1,
            onComplete: () => p.remove()
        });
    }
}

window.onload = iniciarAnimacion;