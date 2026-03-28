// Una lista más variada y vibrante de colores
const colores = ["#ff4d6d", "#ffd166", "#00f5d4", "#9b5de5", "#f15bb5", "#4caff0", "#ff8c00", "#7cfc00"];
const colorFlores = []; // Vacío para forzar colores aleatorios cada vez
const mensaje = document.querySelector(".mensaje");

function animar() {
  // Reset
  gsap.killTweensOf("*");
  mensaje.style.opacity = 0;
  document.querySelectorAll(".particula").forEach(p => p.remove());

  // Tallos
  gsap.fromTo(".tallo",
    {height:0},
    {height:110, duration:1.2, stagger:0.2, ease:"power2.out"}
  );

  // Flores
  gsap.utils.toArray(".flor").forEach((flor, index) => {
    const petalos = flor.querySelectorAll(".petalo");

    // Siempre elegirá un color aleatorio para cada flor
    const randomColor = colores[Math.floor(Math.random()*colores.length)];
    petalos.forEach(p => p.style.fill = randomColor);

    // Distribución circular
    gsap.set(petalos, {rotation: (i) => i * (360 / petalos.length)});

    // Animación de apertura
    gsap.fromTo(petalos,
      {scaleY:0},
      {
        scaleY:1,
        duration:1,
        stagger:0.1,
        delay:0.5 + index * 0.3,
        ease:"back.out(2.5)",
        onComplete:()=> crearParticulas(flor)
      }
    );

    // Movimiento vivo vertical
    gsap.to(flor, {y:"+=8", repeat:-1, yoyo:true, duration:2.5 + Math.random(), ease: "sine.inOut"});

    // Movimiento giratorio suave de pétalos
    petalos.forEach(p => {
      gsap.to(p, {
        rotation:"+=12",
        repeat:-1,
        yoyo:true,
        duration:3 + Math.random(),
        ease:"sine.inOut"
      });
    });
  });

  // Mensaje tipo "typing" con el texto de tu imagen
  setTimeout(() => {
    mensaje.textContent = "";
    mensaje.style.opacity = 1;
    const texto = "¡Un ramo especial para ti! 🌸";
    texto.split("").forEach((letra,i)=>{
      setTimeout(()=> mensaje.textContent += letra, 100*i);
    });
  }, 1200);
}

// Crear partículas desde la flor
function crearParticulas(flor){
  const rect = flor.getBoundingClientRect();
  const x0 = rect.left + rect.width/2;
  const y0 = rect.top + rect.height/2;

  for(let i=0;i<15;i++){
    let part = document.createElement("div");
    part.className = "particula";
    document.body.appendChild(part);

    gsap.fromTo(part,
      {x:x0, y:y0, opacity:1, scale:Math.random()*0.6+0.4},
      {
        x:x0 + (Math.random()*120-60),
        y:y0 + (Math.random()*120-60),
        opacity:0,
        scale:0,
        duration:1.5 + Math.random()*0.5,
        ease:"power1.out",
        onComplete:()=> part.remove()
      }
    );
  }
}

// Primera vez
animar();

// Replay
document.querySelector(".replay").addEventListener("click", animar);