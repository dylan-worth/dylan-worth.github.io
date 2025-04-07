const canvas = document.getElementById('sporeCanvas');
const ctx = canvas.getContext('2d');
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 1;
canvas.style.pointerEvents = 'none';

let spores = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 60; i++) {
  spores.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.2,
    alpha: Math.random() * 0.5 + 0.3
  });
}

function drawSpores() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spores.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(200,255,200,${s.alpha})`;
    ctx.fill();

    s.y -= s.speed;
    if (s.y < -5) {
      s.y = canvas.height + 5;
      s.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawSpores);
}
drawSpores();
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});
