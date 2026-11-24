/** Decorative SVG motifs: mandala, dividers, paisley, corner flourishes, toran. */

const f = (n) => Number(n.toFixed(2));
const rot = (x, y, a) => [f(x * Math.cos(a) - y * Math.sin(a)), f(x * Math.sin(a) + y * Math.cos(a))];

/* ── Mandala (generated once, one <path> per ring) ─────────────────────── */
function petalsRing({ r, n, l, w, offset = 0 }) {
  let d = '';
  for (let k = 0; k < n; k++) {
    const a = ((k + offset) / n) * Math.PI * 2;
    const P = (x, y) => rot(x, y - r, a).join(' ');
    d += `M${P(0, 0)}C${P(w, -l * 0.32)} ${P(w * 0.58, -l * 0.84)} ${P(0, -l)}C${P(-w * 0.58, -l * 0.84)} ${P(-w, -l * 0.32)} ${P(0, 0)}Z`;
  }
  return d;
}
function dotsRing({ r, n, s, offset = 0 }) {
  let d = '';
  for (let k = 0; k < n; k++) {
    const [x, y] = rot(0, -r, ((k + offset) / n) * Math.PI * 2);
    d += `M${f(x - s)} ${y}a${s} ${s} 0 1 0 ${f(2 * s)} 0a${s} ${s} 0 1 0 ${f(-2 * s)} 0`;
  }
  return d;
}
function archRing({ r, n, h }) {
  let d = '';
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * Math.PI * 2;
    const a1 = ((k + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const [x0, y0] = rot(0, -r, a0);
    const [x1, y1] = rot(0, -r, a1);
    const [cx, cy] = rot(0, -(r + h * 2), am);
    d += `M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`;
  }
  return d;
}

const MANDALA = {
  petals: [
    petalsRing({ r: 0, n: 8, l: 14, w: 5.5 }),
    petalsRing({ r: 17, n: 16, l: 13, w: 4.2, offset: 0.5 }),
    petalsRing({ r: 38, n: 24, l: 18, w: 6 }),
    petalsRing({ r: 66, n: 32, l: 16, w: 4.6, offset: 0.5 }),
    petalsRing({ r: 91, n: 48, l: 7.5, w: 2.6 }),
  ].join(''),
  dots: dotsRing({ r: 33.5, n: 32, s: 0.9 }) + dotsRing({ r: 86, n: 48, s: 1.05, offset: 0.5 }),
  arches: archRing({ r: 58, n: 36, h: 3.6 }),
  circles: [16, 37, 58, 90],
};

export function Mandala({ className, strokeWidth = 0.55 }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
        <path d={MANDALA.petals} />
        <path d={MANDALA.arches} />
        {MANDALA.circles.map((r) => (
          <circle key={r} r={r} />
        ))}
      </g>
      <path d={MANDALA.dots} fill="currentColor" />
    </svg>
  );
}

/* ── Divider with a lotus bud ──────────────────────────────────────────── */
export function Divider({ className = 'h-7 w-56 text-gold' }) {
  return (
    <svg viewBox="0 0 260 28" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M14 14H96M164 14H246" strokeWidth="1" />
        <path d="M44 14h44M172 14h44" strokeWidth="2.4" opacity="0.45" />
      </g>
      <g fill="currentColor">
        <circle cx="8" cy="14" r="2.4" />
        <circle cx="252" cy="14" r="2.4" />
        <path d="M99 14l5.5-4.2 5.5 4.2-5.5 4.2z" />
        <path d="M150 14l5.5-4.2 5.5 4.2-5.5 4.2z" />
        <path d="M130 2.5C124.4 7.6 124.2 16 130 25.5C135.8 16 135.6 7.6 130 2.5Z" />
        <path d="M130 25.5C122.6 24 117.6 19.4 116.6 13.2C122.6 14 127.4 18.4 130 25.5Z" opacity="0.72" />
        <path d="M130 25.5C137.4 24 142.4 19.4 143.4 13.2C137.4 14 132.6 18.4 130 25.5Z" opacity="0.72" />
      </g>
    </svg>
  );
}

/* ── Paisley (kairi) ───────────────────────────────────────────────────── */
export function Paisley({ className = 'h-10 w-10 text-gold' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M9 33C3.5 23 7 10.5 17.5 6.2c8-3.2 15.4 1.6 15.4 8.6 0 6-5 9.2-9.2 8.2-3-.8-4.2-4-2-6.2" strokeWidth="1.2" />
      <path d="M12.6 30c-2.6-7 .4-15 7.8-18.2 5-2.2 9.4.6 9.4 5" strokeWidth="0.9" opacity="0.7" />
      <path d="M9 33c6.4 1.2 12.6-2 15.8-7.4" strokeWidth="1.2" />
      <circle cx="22.6" cy="16.6" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="15.4" cy="24.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.6" cy="28.4" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Corner flourish (top-left orientation; rotate for others) ─────────── */
export function CornerFlourish({ className = 'h-12 w-12 text-gold' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M3 45V14C3 7.9 7.9 3 14 3h31" strokeWidth="1.3" />
      <path d="M8 45V17c0-5 4-9 9-9h28" strokeWidth="0.8" opacity="0.6" />
      <path d="M14 14c4-4 10-3 11 2s-4 7-7 4 0-6 3-4" strokeWidth="1.1" />
      <circle cx="14" cy="14" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="31" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="8" cy="31" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Four flourishes pinned to the corners of a relatively positioned parent. */
export function CardCorners({ className = 'text-gold/70', size = 'h-9 w-9 md:h-11 md:w-11', inset = 'inset-2.5' }) {
  const pos = [
    ['left-0 top-0', ''],
    ['right-0 top-0', 'rotate-90'],
    ['right-0 bottom-0', 'rotate-180'],
    ['left-0 bottom-0', '-rotate-90'],
  ];
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${inset} ${className}`}>
      {pos.map(([p, r]) => (
        <CornerFlourish key={p} className={`absolute ${p} ${r} ${size}`} />
      ))}
    </div>
  );
}

/* ── Four-point sparkle ───────────────────────────────────────────────── */
export function Sparkle({ className = 'h-3 w-3 text-gold', style }) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden="true">
      <path d="M10 0C10.8 6 14 9.2 20 10C14 10.8 10.8 14 10 20C9.2 14 6 10.8 0 10C6 9.2 9.2 6 10 0Z" fill="currentColor" />
    </svg>
  );
}

/* ── Toran: a beaded gold swag with swaying marigold-and-bell drops ───── */
function Marigold({ y, r = 5.4 }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <circle r={r} fill="#e3862a" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <circle key={a} cx={0} cy={-r * 0.72} r={r * 0.46} fill="#f2b23e" transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.36} fill="#c2591a" />
    </g>
  );
}

function ToranUnit({ i }) {
  const leaf = i % 2 === 1;
  const beads = [];
  for (let k = 1; k < 8; k++) {
    const t = k / 8;
    const x = 72 * t;
    const y = 4 + 26 * t * (1 - t) * 4 * 0.5;
    beads.push(<circle key={k} cx={f(x)} cy={f(y)} r={k % 2 ? 1.9 : 1.3} fill={k % 2 ? '#d4af37' : '#7d2235'} />);
  }
  return (
    <svg viewBox="0 0 72 96" className="h-[78px] w-[58px] shrink-0 overflow-visible md:h-[96px] md:w-[72px]" aria-hidden="true">
      <path d="M0 4Q36 30 72 4" fill="none" stroke="#c99a2e" strokeWidth="1.3" />
      {beads}
      <g className="loop-sway" style={{ transformOrigin: '0px 4px', animationDelay: `${-(i % 6) * 0.63}s` }}>
        {leaf ? (
          <>
            <line x1="0" y1="4" x2="0" y2="16" stroke="#c99a2e" strokeWidth="1" />
            <path d="M0 15C-7 24-7 36 0 46C7 36 7 24 0 15Z" fill="#0f5c6e" />
            <path d="M0 18V43" stroke="#e2c26c" strokeWidth="0.8" />
            <circle cy="48.5" r="1.8" fill="#d4af37" />
          </>
        ) : (
          <>
            <line x1="0" y1="4" x2="0" y2="62" stroke="#c99a2e" strokeWidth="1" />
            <Marigold y={18} />
            <Marigold y={31} r={4.8} />
            <circle cy="41" r="2.2" fill="#7d2235" />
            <path d="M-5.6 58C-5.6 50.5-3 46.5 0 46.5S5.6 50.5 5.6 58Z" fill="#d4af37" />
            <path d="M-7 58H7" stroke="#b8901f" strokeWidth="1.6" strokeLinecap="round" />
            <circle cy="61" r="1.6" fill="#b8901f" />
          </>
        )}
      </g>
    </svg>
  );
}

export function Toran({ className = '', units = 31 }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none flex flex-col items-center overflow-hidden ${className}`}>
      <div className="h-[5px] w-full bg-gradient-to-b from-gold-light via-gold to-gold-deep shadow-[0_2px_6px_rgba(143,107,23,0.35)]" />
      <div className="flex shrink-0">
        {Array.from({ length: units }, (_, i) => (
          <ToranUnit key={i} i={i} />
        ))}
      </div>
    </div>
  );
}
