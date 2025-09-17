[star tic.html](https://github.com/user-attachments/files/22374249/star.tic.html)# prototipo-de-juegos
juegos creados a medias en mi tiempo libre
[<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Juego de la Estrella</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #1a1a1a;
      color: white;
      font-family: sans-serif;
    }

    canvas {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1; /* detrás de todo */
    }

    #info {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 10;
    }

    #contador, #record {
      font-size: 24px;
      margin-bottom: 5px;
    }

    #estrella {
      position: absolute;
      width: 60px;
      height: 60px;
      cursor: pointer;
      top: 100px;
      left: 100px;
      transition: top 0.2s ease, left 0.2s ease;
      z-index: 5;
    }

    /* 🔹 Estilo del botón en la esquina */
    #boton-derecha {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 15px 30px;
      font-size: 1.2rem;
      font-weight: bold;
      color: #fff;
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid #fff;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      z-index: 10;
    }

    #boton-derecha:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.08);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    }
  </style>
</head>
<body>
  <canvas id="fondo"></canvas>

  <div id="info">
    <div id="contador">Clics: 0</div>
    <div id="record">Máximo: 0</div>
  </div>

  <img id="estrella" src="estrelladeprueb.png" alt="Estrella" />

  <!-- 🔹 Botón en la esquina -->
  <a id="boton-derecha" href="portada.html">Inicio</a>
  
  <script>
    const estrella = document.getElementById('estrella');
    const contadorDiv = document.getElementById('contador');
    const recordDiv = document.getElementById('record');
    const canvas = document.getElementById('fondo');
    const ctx = canvas.getContext('2d');

    let clics = 0;
    let record = parseInt(localStorage.getItem('recordEstrella')) || 0;
    let activo = false;
    let timeout;

    // Ajustar canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Sistema de partículas de fondo (estrellas)
    let estrellas = [];
    let animarFondo = false;

    function crearEstrellas(n) {
      estrellas = [];
      for (let i = 0; i < n; i++) {
        estrellas.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 1,
          vel: Math.random() * 0.5 + 0.2,
          alpha: Math.random(),
          delta: (Math.random() * 0.02) - 0.01
        });
      }
    }

    // Sistema de chispas
    let chispas = [];

    function crearChispas(x, y, cantidad) {
      for (let i = 0; i < cantidad; i++) {
        const angulo = Math.random() * 2 * Math.PI;
        const velocidad = Math.random() * 3 + 1;
        chispas.push({
          x: x,
          y: y,
          vx: Math.cos(angulo) * velocidad,
          vy: Math.sin(angulo) * velocidad,
          vida: 1.0,
          radio: Math.random() * 3 + 2
        });
      }
    }

    function dibujarEstrellas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Estrellas del fondo
      estrellas.forEach(est => {
        est.alpha += est.delta;
        if (est.alpha <= 0 || est.alpha >= 1) {
          est.delta *= -1;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${est.alpha})`;
        ctx.beginPath();
        ctx.arc(est.x, est.y, est.r, 0, Math.PI * 2);
        ctx.fill();

        est.y += est.vel;
        if (est.y > canvas.height) {
          est.y = 0;
          est.x = Math.random() * canvas.width;
        }
      });

      // Chispas amarillas
      chispas.forEach((c, i) => {
        ctx.fillStyle = `rgba(255, 215, 0, ${c.vida})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radio, 0, Math.PI * 2);
        ctx.fill();

        c.x += c.vx;
        c.y += c.vy;
        c.vida -= 0.02;
        if (c.vida <= 0) {
          chispas.splice(i, 1);
        }
      });
    }

    function animar() {
      if (animarFondo) {
        dibujarEstrellas();
      }
      requestAnimationFrame(animar);
    }

    recordDiv.textContent = `Máximo: ${record}`;

    function moverEstrella() {
      const maxX = window.innerWidth - estrella.offsetWidth;
      const maxY = window.innerHeight - estrella.offsetHeight;
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;

      estrella.style.left = `${x}px`;
      estrella.style.top = `${y}px`;
    }

    function actualizarContador() {
      contadorDiv.textContent = `Clics: ${clics}`;
    }

    function actualizarRecord() {
      if (clics > record) {
        record = clics;
        localStorage.setItem('recordEstrella', record);
        recordDiv.textContent = `Máximo: ${record}`;
      }
    }

    function iniciarJuego() {
      actualizarRecord();
      clics = 0;
      actualizarContador();
      activo = false;
      clearTimeout(timeout);
      moverEstrella();
    }

    estrella.addEventListener('click', (e) => {
      e.stopPropagation();

      // Activar estrellas del fondo en el primer clic
      if (!animarFondo) {
        crearEstrellas(120);
        animarFondo = true;
        animar();
      }

      // Crear chispas
      const rect = estrella.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      crearChispas(x, y, 20);

      if (!activo) {
        activo = true;
      }

      clics++;
      actualizarContador();
      moverEstrella();

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        iniciarJuego();
      }, 1000);
    });

    document.body.addEventListener('click', () => {
      if (activo) {
        iniciarJuego();
      }
    });

    window.onload = () => {
      moverEstrella();
    };
  </script>
</body>
</html>
Uploading star tic.html…]()
