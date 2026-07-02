const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const canvas = document.getElementById("neural");
const ctx = canvas.getContext("2d", { alpha: true });

let width = 0;
let height = 0;
let ratio = 1;
let nodes = [];
let lastTime = performance.now();

function resize(){
  ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  width = canvas.width = Math.floor(window.innerWidth * ratio);
  height = canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  const count = Math.min(95, Math.max(48, Math.floor(window.innerWidth / 17)));
  nodes = Array.from({length: count}, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 22 * ratio,
    vy: (Math.random() - 0.5) * 22 * ratio,
    r: (Math.random() * 1.2 + 1) * ratio
  }));
}

function animate(now){
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  ctx.clearRect(0, 0, width, height);

  for (const n of nodes) {
    n.x += n.vx * dt;
    n.y += n.vy * dt;

    if (n.x < 0) { n.x = 0; n.vx *= -1; }
    if (n.x > width) { n.x = width; n.vx *= -1; }
    if (n.y < 0) { n.y = 0; n.vy *= -1; }
    if (n.y > height) { n.y = height; n.vy *= -1; }
  }

  const maxDist = 170 * ratio;
  const maxDistSq = maxDist * maxDist;

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];

    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < maxDistSq) {
        const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.34;
        ctx.strokeStyle = `rgba(43,188,255,${alpha})`;
        ctx.lineWidth = 0.7 * ratio;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  ctx.fillStyle = "rgba(43,188,255,.92)";
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize, { passive: true });
resize();
requestAnimationFrame(animate);
