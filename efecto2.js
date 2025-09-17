const estrella = document.getElementById('estrella');
const contadorDiv = document.getElementById('contador');

let clics = 0;
let activo = true;
let timeout;

function moverEstrella() {
  const maxX = window.innerWidth - estrella.offsetWidth;
  const maxY = window.innerHeight - estrella.offsetHeight;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  estrella.style.left = `${x}px`;
  estrella.style.top = `${y}px`;
}

function iniciarJuego() {
  clics = 0;
  actualizarContador();
  activo = true;
  clearTimeout(timeout);
  moverEstrella();
}

function actualizarContador() {
  contadorDiv.textContent = `Clics: ${clics}`;
}

estrella.addEventListener('click', (e) => {
  e.stopPropagation(); // evitar que el body detecte este clic

  if (!activo) {
    activo = true;
  }

  clics++;
  actualizarContador();
  moverEstrella();

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    iniciarJuego();
  }, 1000); // 1 segundo para el próximo clic
});

// Clic fuera de la estrella reinicia el juego
document.body.addEventListener('click', () => {
  if (activo) {
    iniciarJuego();
  }
});

// Inicial
window.onload = () => {
  moverEstrella();
};
