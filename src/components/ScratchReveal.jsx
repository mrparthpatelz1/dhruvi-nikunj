import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAmbient } from '../context/AmbientContext';
import { WEDDING_DATA } from '../data/weddingData';
import { EASE_OUT, revealOnce, scaleIn } from '../lib/motion';
import { HandIcon, SparkleIcon } from './ornaments/Icons';
import { Sparkle } from './ornaments/Ornaments';
import SectionHeading from './SectionHeading';

const { bride, groom, couplePhoto } = WEDDING_DATA;

const COLS = 30;
const ROWS = 40;
const THRESHOLD = 0.55;
/**
 * Pointed "jharokha" arch: two cubic curves meeting at the apex. The canvas
 * uses the exact curves; the CSS clip samples them into a percentage polygon,
 * which every browser supports (no SVG clipPath reference needed).
 */
const ARCH_LEFT = [[0, 0.36], [0, 0.16], [0.3, 0.1], [0.5, 0]];
const ARCH_RIGHT = [[0.5, 0], [0.7, 0.1], [1, 0.16], [1, 0.36]];
const cubicAt = (pts, t) => {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [0, 1].map((axis) => pts.reduce((sum, p, i) => sum + p[axis] * k[i], 0));
};
const ARCH_POLYGON = (() => {
  const pts = [[0, 1], ARCH_LEFT[0]];
  for (const curve of [ARCH_LEFT, ARCH_RIGHT]) for (let i = 1; i <= 18; i++) pts.push(cubicAt(curve, i / 18));
  pts.push([1, 1]);
  return `polygon(${pts.map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(', ')})`;
})();

function archPath(w, h) {
  const p = new Path2D();
  p.moveTo(0, h);
  p.lineTo(0, h * 0.36);
  p.bezierCurveTo(0, h * 0.16, w * 0.3, h * 0.1, w * 0.5, 0);
  p.bezierCurveTo(w * 0.7, h * 0.1, w, h * 0.16, w, h * 0.36);
  p.lineTo(w, h);
  p.closePath();
  return p;
}

/** Which grid cells lie inside the arch: 1 = foil, 0 = outside. */
function makeGrid() {
  const probe = document.createElement('canvas').getContext('2d');
  const path = archPath(COLS, ROWS);
  const grid = new Uint8Array(COLS * ROWS);
  let total = 0;
  for (let j = 0; j < ROWS; j++)
    for (let i = 0; i < COLS; i++)
      if (probe.isPointInPath(path, i + 0.5, j + 0.5)) {
        grid[j * COLS + i] = 1;
        total++;
      }
  return { grid, total };
}

function fitFont(ctx, text, weightFamily, size, maxWidth) {
  ctx.font = `${weightFamily.replace('{s}', size)}`;
  const w = ctx.measureText(text).width;
  if (w > maxWidth) {
    size *= maxWidth / w;
    ctx.font = `${weightFamily.replace('{s}', size)}`;
  }
  return size;
}

function paintFoil(canvas, w, h) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.save();
  ctx.clip(archPath(w, h));

  // metallic gold sweep
  const g = ctx.createLinearGradient(0, 0, w, h);
  [
    [0, '#9a6f1f'],
    [0.16, '#e3c473'],
    [0.31, '#b78829'],
    [0.47, '#f8e8b2'],
    [0.62, '#c29239'],
    [0.8, '#edd18b'],
    [1, '#966d20'],
  ].forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // rose-gold bloom
  const rg = ctx.createRadialGradient(w * 0.74, h * 0.26, 0, w * 0.74, h * 0.26, w * 0.95);
  rg.addColorStop(0, 'rgba(236,170,158,0.5)');
  rg.addColorStop(1, 'rgba(236,170,158,0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);

  // brushed-metal grain
  for (let i = 0; i < 170; i++) {
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.075)' : 'rgba(92,60,8,0.06)';
    ctx.fillRect(0, Math.random() * h, w, Math.random() * 1.4 + 0.3);
  }

  // embossed jaali lattice
  const s = Math.max(24, w / 11);
  ctx.strokeStyle = 'rgba(255,246,214,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let k = -h; k < w + h; k += s) {
    ctx.moveTo(k, 0);
    ctx.lineTo(k + h, h);
    ctx.moveTo(k, h);
    ctx.lineTo(k + h, 0);
  }
  ctx.stroke();

  // medallion behind the words
  const cx = w / 2;
  const cy = h * 0.55;
  const R = w * 0.37;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  glow.addColorStop(0, 'rgba(255,249,228,0.62)');
  glow.addColorStop(1, 'rgba(255,249,228,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(112,72,10,0.38)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([1, 5]);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, R + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // engraved words
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const emboss = (text, x, y) => {
    ctx.fillStyle = 'rgba(255,250,232,0.75)';
    ctx.fillText(text, x + 0.8, y + 1);
    ctx.fillStyle = '#5a1427';
    ctx.fillText(text, x, y);
  };
  fitFont(ctx, 'SCRATCH TO REVEAL', '600 {s}px "Cinzel", Georgia, serif', w * 0.052, w * 0.64);
  emboss('SCRATCH TO REVEAL', cx, cy - w * 0.075);
  fitFont(ctx, 'the Couple', '{s}px "Great Vibes", cursive', w * 0.15, w * 0.6);
  emboss('the Couple', cx, cy + w * 0.06);

  // glints
  const star = (x, y, r) => {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const rr = i % 2 ? r * 0.22 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  };
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  star(w * 0.24, h * 0.3, 7);
  star(w * 0.8, h * 0.42, 5);
  star(w * 0.3, h * 0.84, 6);
  star(w * 0.74, h * 0.8, 8);
  ctx.restore();
}

function ArchFrame() {
  const outer = 'M6 452V181C6 96 102 68 170 22C238 68 334 96 334 181V452';
  const dotted = 'M12 448V182.5C12 99.5 105.5 73 170 30C234.5 73 328 99.5 328 182.5V448';
  const inner = 'M17.5 444V183.5C17.5 102.5 108.5 77.5 170 36.5C231.5 77.5 322.5 102.5 322.5 183.5V444';
  return (
    <svg viewBox="0 0 340 462" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="arch-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc94" />
          <stop offset="0.35" stopColor="#c99a2e" />
          <stop offset="0.6" stopColor="#f6e6b0" />
          <stop offset="1" stopColor="#a67c1f" />
        </linearGradient>
      </defs>
      <path d={outer} fill="none" stroke="url(#arch-gold)" strokeWidth="3.6" />
      <path d={dotted} fill="none" stroke="#c99a2e" strokeWidth="2" strokeDasharray="0.1 6.4" strokeLinecap="round" />
      <path d={inner} fill="none" stroke="url(#arch-gold)" strokeWidth="2" />
      {/* lotus finial */}
      <g transform="translate(170 22)" fill="url(#arch-gold)">
        <path d="M0-21C-6.5-12.5-6.5-5 0 0C6.5-5 6.5-12.5 0-21Z" />
        <path d="M0 0C-8.5-1-12.5-6.5-13.5-12C-7.5-11-3 -6.5 0 0Z" />
        <path d="M0 0C8.5-1 12.5-6.5 13.5-12C7.5-11 3-6.5 0 0Z" />
        <circle cy="-25" r="2.6" />
      </g>
      {/* capitals where the arch springs, with hanging drops */}
      <g fill="url(#arch-gold)">
        <rect x="-2" y="177" width="26" height="6" rx="3" />
        <rect x="316" y="177" width="26" height="6" rx="3" />
        <path d="M2 177c0-6 4-9 9-9s9 3 9 9zM320 177c0-6 4-9 9-9s9 3 9 9z" />
      </g>
      <g stroke="#c99a2e" strokeWidth="1">
        <path d="M11 183v20M329 183v20" />
      </g>
      <g fill="url(#arch-gold)">
        <path d="M11 203c-3 0-4.5 3-4.5 6.5S8 216 11 218c3-2 4.5-5 4.5-8.5S14 203 11 203z" />
        <path d="M329 203c-3 0-4.5 3-4.5 6.5S326 216 329 218c3-2 4.5-5 4.5-8.5S332 203 329 203z" />
      </g>
      {/* plinth */}
      <rect x="-4" y="450" width="348" height="10" rx="3.5" fill="url(#arch-gold)" />
      <path d="M150 455h40" stroke="#7a5612" strokeWidth="1" />
      <path d="M170 449.5l4 5.5-4 5.5-4-5.5z" fill="#7a5612" />
    </svg>
  );
}

function ScratchHint() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none absolute inset-x-0 top-[73%] flex justify-center"
    >
      <div className="relative">
        <Sparkle className="loop-twinkle absolute -left-10 -top-4 h-3.5 w-3.5 text-ivory" />
        <Sparkle className="loop-twinkle absolute -right-9 top-1 h-3 w-3 text-ivory [animation-delay:-1.2s]" />
        <span className="loop-hand block text-maroon-ink drop-shadow-[0_2px_3px_rgba(255,240,200,0.7)]">
          <HandIcon className="h-10 w-10" strokeWidth={1.5} />
        </span>
      </div>
    </motion.div>
  );
}

export default function ScratchReveal() {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const st = useRef({ w: 0, h: 0, r: 20, grid: null, total: 1, cleared: 0, drawing: false, last: null, dirty: false, done: false });
  const [started, setStarted] = useState(false);
  const [fading, setFading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { burst } = useAmbient();

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || st.current.done) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    Object.assign(st.current, { w, h, r: Math.max(17, w * 0.075) });
    if (!st.current.grid) Object.assign(st.current, makeGrid());
    paintFoil(canvas, w, h);
  }, []);

  // First paint, repaint once the engraved fonts arrive, and keep scratches on resize.
  useEffect(() => {
    const canvas = canvasRef.current;
    let alive = true;
    setup();
    if (document.fonts?.load) {
      Promise.all([
        document.fonts.load('600 20px "Cinzel"'),
        document.fonts.load('40px "Great Vibes"'),
      ]).finally(() => alive && !st.current.dirty && setup());
    }
    const ro = new ResizeObserver(() => {
      const s = st.current;
      if (!alive || s.done || !canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || (Math.abs(w - s.w) < 1 && Math.abs(h - s.h) < 1)) return;
      if (!s.dirty) return setup();
      const copy = document.createElement('canvas');
      copy.width = canvas.width;
      copy.height = canvas.height;
      copy.getContext('2d').drawImage(canvas, 0, 0);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(copy, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      Object.assign(s, { w, h, r: Math.max(17, w * 0.075) });
    });
    ro.observe(canvas);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [setup]);

  const reveal = useCallback(() => {
    const s = st.current;
    if (s.done) return;
    s.done = true;
    s.drawing = false;
    setStarted(true);
    setFading(true);
    const rect = frameRef.current?.getBoundingClientRect();
    if (rect) burst(rect.left + rect.width / 2, rect.top + rect.height * 0.45, { petals: 30, sparks: 46 });
    setTimeout(() => setRevealed(true), 1000);
  }, [burst]);

  const markAt = (x, y) => {
    const s = st.current;
    const cw = s.w / COLS;
    const ch = s.h / ROWS;
    const c0 = Math.max(0, Math.floor((x - s.r) / cw));
    const c1 = Math.min(COLS - 1, Math.floor((x + s.r) / cw));
    const r0 = Math.max(0, Math.floor((y - s.r) / ch));
    const r1 = Math.min(ROWS - 1, Math.floor((y + s.r) / ch));
    for (let j = r0; j <= r1; j++)
      for (let i = c0; i <= c1; i++) {
        const idx = j * COLS + i;
        if (s.grid[idx] !== 1) continue;
        const px = (i + 0.5) * cw - x;
        const py = (j + 0.5) * ch - y;
        if (px * px + py * py <= s.r * s.r) {
          s.grid[idx] = 2;
          s.cleared++;
        }
      }
  };

  const scratch = (from, to) => {
    const s = st.current;
    const ctx = canvasRef.current.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = s.r * 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(to.x, to.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / (s.r * 0.5)));
    for (let k = 0; k <= steps; k++) markAt(from.x + ((to.x - from.x) * k) / steps, from.y + ((to.y - from.y) * k) / steps);
    if (s.cleared / s.total >= THRESHOLD) reveal();
  };

  const point = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const s = st.current;
    return { x: ((e.clientX - rect.left) * s.w) / rect.width, y: ((e.clientY - rect.top) * s.h) / rect.height };
  };

  const onPointerDown = (e) => {
    const s = st.current;
    if (s.done || !s.grid) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture?.(e.pointerId);
    s.drawing = true;
    s.dirty = true;
    s.last = point(e);
    setStarted(true);
    scratch(s.last, s.last);
  };
  const onPointerMove = (e) => {
    const s = st.current;
    if (!s.drawing || s.done) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    for (const ev of events.length ? events : [e.nativeEvent]) {
      const p = point(ev);
      scratch(s.last, p);
      s.last = p;
      if (s.done) break;
    }
  };
  const onPointerUp = () => {
    st.current.drawing = false;
  };

  return (
    <section id="couple" aria-labelledby="couple-title" className="relative overflow-hidden px-4 py-20 md:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent,rgba(249,198,208,0.22)_45%,transparent)]" />
      <SectionHeading
        id="couple-title"
        eyebrow="Two hearts, one soul"
        title="Meet the Couple"
        subtitle="Scratch away the golden foil to unveil a glimpse of the bride and groom."
      />

      <motion.div {...revealOnce} variants={scaleIn} className="relative mx-auto mt-12 w-[min(84vw,400px)] md:mt-14">
        <div aria-hidden="true" className="absolute inset-x-[12%] -bottom-3 h-10 rounded-[50%] bg-maroon-ink/30 blur-xl" />
        <div ref={frameRef} className="relative aspect-[340/462] w-full">
          <div
            className="absolute left-[5.88%] top-[8.66%] h-[86.58%] w-[88.24%] overflow-hidden bg-parchment"
            style={{ clipPath: ARCH_POLYGON, WebkitClipPath: ARCH_POLYGON }}
          >
            <motion.img
              src={couplePhoto.src}
              alt={couplePhoto.alt}
              draggable={false}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              initial={false}
              animate={{ scale: fading ? 1 : 1.08 }}
              transition={{ duration: 1.8, ease: EASE_OUT }}
            />
            {!revealed && (
              <canvas
                ref={canvasRef}
                aria-hidden="true"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onContextMenu={(e) => e.preventDefault()}
                className={`absolute inset-0 h-full w-full cursor-crosshair touch-none select-none transition-opacity duration-1000 ease-out ${fading ? 'opacity-0' : 'opacity-100'}`}
              />
            )}
            <AnimatePresence>{!started && <ScratchHint key="hint" />}</AnimatePresence>
          </div>
          <ArchFrame />
        </div>
      </motion.div>

      <div className="mt-9 flex min-h-[5.5rem] justify-center text-center">
        <AnimatePresence mode="wait">
          {fading ? (
            <motion.div key="caption" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT }}>
              <p className="font-script text-5xl leading-tight text-maroon md:text-6xl">
                {bride.name} <span className="text-gold-deep">&amp;</span> {groom.name}
              </p>
              <p className="mt-1 font-serif text-lg italic text-maroon-ink/75">Two souls, one beautiful journey.</p>
            </motion.div>
          ) : (
            <motion.button
              key="tap"
              type="button"
              onClick={reveal}
              exit={{ opacity: 0 }}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-full px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-maroon/70 underline decoration-gold/60 underline-offset-4 transition hover:text-maroon"
            >
              <SparkleIcon className="h-4 w-4 text-gold-deep" />
              Tap to reveal instead
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
