const colores = ["#ff4d6d","#ffd166","#00f5d4","#9b5de5","#f15bb5"];
const mensaje = document.querySelector(".mensaje");

function animar() {
  // Tallos
  gsap.fromTo(".tallo",
    {height:0},
    {height:110, duration:1, stagger:0.2, ease:"power2.out"}
  );

  // Flores
  gsap.utils.toArray(".flor").forEach((flor, index) => {
    const petalos = flor.querySelectorAll(".petalo");

    // Color aleatorio
    petalos.forEach(p => p.style.fill = colores[Math.floor(Math.random()*colores.length)]);

    // Distribución circular
    gsap.set(petalos, {
      rotation: (i) => i * (360 / petalos.length)
    });

    // Animación de apertura
    gsap.fromTo(petalos,
      {scaleY:0},
      {
        scaleY:1,
        duration:0.8,
        stagger:0.08,
        delay:0.5 + index * 0.3,
        ease:"back.out(2)"
      }
    );

    // Movimiento vivo
    gsap.to(flor, {
      y:"+=5",
      repeat:-1,
      yoyo:true,
      duration:2 + Math.random()
    });
  });

  // Partículas
  for(let i=0;i<25;i++){
    let part = document.createElement("div");
    part.className = "particula";
    document.body.appendChild(part);

    gsap.fromTo(part,
      {x:window.innerWidth/2, y:window.innerHeight/2, opacity:1},
      {
        x:"+=" + (Math.random()*200-100),
        y:"+=" + (Math.random()*200-100),
        opacity:0,
        scale:Math.random()*1.5+0.5,
        duration:1.5,
        onComplete:()=>part.remove()
      }
    );
  }

  // Mensaje tipo "typing"
  mensaje.textContent = "";
  mensaje.style.opacity = 1;
  const texto = "Para ti 💖";
  texto.split("").forEach((letra,i)=>{
    setTimeout(()=> mensaje.textContent += letra, 200*i + 1500);
  });
}

// Primera vez
animar();

// Replay
document.querySelector(".replay").addEventListener("click", () => {
  gsap.killTweensOf("*");
  mensaje.style.opacity = 0;
  animar();
});