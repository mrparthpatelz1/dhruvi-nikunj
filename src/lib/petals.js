/**
 * Sakura petal rain + celebration bursts on a single full-viewport canvas.
 * Petals are pre-rendered sprites drawn with one setTransform each, so even
 * 40+ petals cost almost nothing per frame. The 3D tumble is faked by
 * squashing the sprite's x-scale with cos(flip) and swapping to a paler
 * "back side" sprite when it turns over.
 */

const PETAL_PATH =
  'M50 95C22 82 8 52 18 28C24 14 38 6 46 12L50 20L54 12C62 6 76 14 82 28C92 52 78 82 50 95Z';

const VARIANTS = [
  // [front base, front tip, back base, back tip]
  ['#f0a0b5', '#ffe4ec', '#f7c4d1', '#fff2f6'],
  ['#f6b6c5', '#fff0f4', '#fad2dc', '#fff8fa'],
  ['#ec8fa8', '#fdd9e3', '#f4b8c8', '#ffeef3'],
];

function petalSprite(base, tip) {
  const S = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d');
  g.scale(S / 100, S / 100);
  const grad = g.createLinearGradient(50, 95, 50, 8);
  grad.addColorStop(0, base);
  grad.addColorStop(1, tip);
  g.fillStyle = grad;
  g.fill(new Path2D(PETAL_PATH));
  g.strokeStyle = 'rgba(214, 96, 128, 0.22)';
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(50, 88);
  g.quadraticCurveTo(47, 60, 50, 30);
  g.stroke();
  return cv;
}

function sparkSprite() {
  const S = 48;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d');
  g.translate(S / 2, S / 2);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, S / 2);
  rg.addColorStop(0, 'rgba(255,250,228,1)');
  rg.addColorStop(0.3, 'rgba(244,214,128,0.95)');
  rg.addColorStop(1, 'rgba(212,175,55,0)');
  g.fillStyle = rg;
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r = i % 2 ? 4.5 : S / 2;
    g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  g.closePath();
  g.fill();
  return cv;
}

const rand = (a, b) => a + Math.random() * (b - a);

export function createPetalEngine(canvas) {
  const ctx = canvas.getContext('2d');
  const sprites = VARIANTS.flatMap(([a, b, c, d]) => [petalSprite(a, b), petalSprite(c, d)]);
  const spark = sparkSprite();
  const petals = [];
  const particles = [];
  let W = 0;
  let H = 0;
  let dpr = 1;
  let target = 0;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let raining = false;
  let bursts = true;

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = w;
    H = h;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    // density scales with screen size — fewer petals on phones for battery life
    target = W < 640 ? 20 : W < 1024 ? 30 : 42;
  }

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (canvas.clientWidth !== W || Math.abs(canvas.clientHeight - H) > 80) resize();
    }, 150);
  };
  resize();
  window.addEventListener('resize', onResize);

  function makePetal(fromAbove) {
    const small = W < 640;
    const size = small ? rand(9, 17) : rand(11, 21);
    return {
      x: rand(-20, W + 20),
      y: fromAbove ? rand(-H * 0.9, -20) : rand(-60, -20),
      size,
      vy: rand(24, 50) + size * 0.8,
      sway: rand(14, 40),
      swayF: rand(0.5, 1.25),
      phase: rand(0, Math.PI * 2),
      drift: rand(4, 18),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.9, 0.9),
      flip: rand(0, Math.PI * 2),
      vflip: rand(1, 3.2),
      variant: (Math.random() * VARIANTS.length) | 0,
      alpha: rand(0.55, 0.92),
    };
  }

  function draw(img, x, y, size, rot, sx, alpha) {
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    ctx.globalAlpha = alpha;
    ctx.setTransform(c * sx * dpr, s * sx * dpr, -s * dpr, c * dpr, x * dpr, y * dpr);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  }

  function drawPetal(p, alpha) {
    let sx = Math.cos(p.flip);
    const back = sx < 0;
    sx = (back ? -1 : 1) * Math.max(0.14, Math.abs(sx));
    draw(sprites[p.variant * 2 + (back ? 1 : 0)], p.x, p.y, p.size, p.rot, sx, alpha);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    clock += dt;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (raining && petals.length < target && Math.random() < dt * 5) petals.push(makePetal(false));

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.y += p.vy * dt;
      p.x += (p.drift + Math.cos(clock * p.swayF + p.phase) * p.sway * p.swayF) * dt;
      p.rot += p.vr * dt;
      p.flip += p.vflip * dt;
      if (p.y > H + 30 || p.x > W + 50 || p.x < -50) {
        if (raining && petals.length <= target) Object.assign(p, makePetal(false));
        else petals.splice(i, 1);
        continue;
      }
      drawPetal(p, p.alpha);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const q = particles[i];
      q.life -= dt;
      if (q.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      const drag = Math.pow(q.drag, dt * 60);
      q.vx *= drag;
      q.vy = q.vy * drag + q.g * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.rot += q.vr * dt;
      q.flip += q.vflip * dt;
      const fade = Math.min(1, q.life / q.fade);
      if (q.spark) {
        const tw = 0.65 + 0.35 * Math.sin(q.flip * 2.5);
        draw(spark, q.x, q.y, q.size * tw, q.rot, 1, fade);
      } else {
        drawPetal(q, fade * 0.95);
      }
    }

    ctx.globalAlpha = 1;
    if (raining || petals.length || particles.length) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function run() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  return {
    setRaining(on) {
      if (on === raining) return;
      raining = on;
      if (on) {
        if (!W) resize();
        while (petals.length < target) petals.push(makePetal(true));
        run();
      } else {
        petals.length = 0;
      }
    },
    setBursts(on) {
      bursts = on;
      if (!on) particles.length = 0;
    },
    /** Explode petals + gold sparkles from a viewport point. */
    burst(x, y, { petals: np = 26, sparks: ns = 36, power = 1 } = {}) {
      if (!bursts) return;
      if (!W) resize();
      for (let i = 0; i < np; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(120, 380) * power;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 140 * power,
          g: 170,
          drag: 0.955,
          size: rand(10, 19),
          rot: rand(0, Math.PI * 2),
          vr: rand(-4, 4),
          flip: rand(0, Math.PI * 2),
          vflip: rand(3, 7),
          variant: (Math.random() * VARIANTS.length) | 0,
          life: rand(2.2, 3.4),
          fade: 1.1,
        });
      }
      for (let i = 0; i < ns; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(160, 460) * power;
        particles.push({
          spark: true,
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 90 * power,
          g: 110,
          drag: 0.93,
          size: rand(9, 20),
          rot: rand(0, Math.PI),
          vr: rand(-3, 3),
          flip: rand(0, Math.PI * 2),
          vflip: rand(4, 9),
          life: rand(0.9, 1.9),
          fade: 0.7,
        });
      }
      run();
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    },
  };
}
