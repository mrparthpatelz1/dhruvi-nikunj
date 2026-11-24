import { useId } from 'react';

/**
 * Custom SVG peacocks. Every train feather is drawn from its pivot at (0,0) so
 * the CSS loops (.loop-feather / .loop-train) fan and sway it naturally;
 * the eye rings carry a staggered gold glint for an iridescent shimmer.
 * Body coordinates are relative to the rump, facing right.
 */
const BODY =
  'M0 0C14 -12 32 -22 50 -27C64 -31 70 -44 72 -58C74 -72 76 -84 80 -91C84 -96 92 -96 95 -90L97 -85L108 -80.5L97 -77.5C94 -72 90 -66 89 -58C88 -48 92 -36 88 -24C84 -10 72 6 54 12C38 17 18 12 0 0Z';
const WING = 'M71 -33C58 -22 38 -12 14 -4C30 5 51 4 65 -6C73 -12 75 -25 71 -33Z';
const CREST = [
  [78, -114],
  [83, -117.5],
  [88.5, -119],
  [94, -117.5],
  [99, -114],
];

/**
 * A fan of [angle°, length] pairs spread evenly between two angles, longest
 * at the centre, ordered edges-first so the centre feathers sit on top.
 */
function fan(from, to, count, shortest, longest) {
  const mid = (from + to) / 2;
  const half = (to - from) / 2;
  const list = Array.from({ length: count }, (_, i) => {
    const angle = from + ((to - from) * i) / (count - 1);
    const k = (angle - mid) / half;
    return [Number(angle.toFixed(1)), Math.round(longest - (longest - shortest) * k * k)];
  });
  return list.sort((a, b) => Math.abs(b[0] - mid) - Math.abs(a[0] - mid));
}

const STANDING_TRAIN = fan(146, 210, 13, 72, 110);
const STANDING_COVERTS = fan(156, 200, 7, 46, 56);
const PERCHED_TRAIN = fan(96, 132, 9, 102, 134);
const PERCHED_COVERTS = fan(102, 128, 5, 54, 64);

function useIds() {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (n) => `pk-${n}-${raw}`;
  return {
    body: id('body'),
    wing: id('wing'),
    quill: id('quill'),
    vane: id('vane'),
    eyeOuter: id('eo'),
    eyeTeal: id('et'),
    branch: id('br'),
    fanBase: id('fb'),
  };
}

function Defs({ ids }) {
  return (
    <defs>
      <linearGradient id={ids.body} x1="92" y1="-96" x2="8" y2="14" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#3191d1" />
        <stop offset="0.4" stopColor="#17649f" />
        <stop offset="0.74" stopColor="#0f5c6e" />
        <stop offset="1" stopColor="#0a3a46" />
      </linearGradient>
      <linearGradient id={ids.wing} x1="70" y1="-34" x2="18" y2="2" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#f0d58e" />
        <stop offset="0.5" stopColor="#c49a3e" />
        <stop offset="1" stopColor="#80601c" />
      </linearGradient>
      <linearGradient id={ids.quill} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8f6b17" stopOpacity="0.9" />
        <stop offset="1" stopColor="#e4c46e" />
      </linearGradient>
      <linearGradient id={ids.vane} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0f5c6e" stopOpacity="0.05" />
        <stop offset="0.45" stopColor="#13705f" stopOpacity="0.75" />
        <stop offset="1" stopColor="#2d9a6a" />
      </linearGradient>
      <radialGradient id={ids.eyeOuter}>
        <stop offset="0" stopColor="#f7df8c" />
        <stop offset="1" stopColor="#b8892a" />
      </radialGradient>
      <radialGradient id={ids.eyeTeal} cx="0.45" cy="0.45">
        <stop offset="0" stopColor="#3fc0d2" />
        <stop offset="1" stopColor="#0f5c6e" />
      </radialGradient>
      <radialGradient id={ids.fanBase} cx="0" cy="0" r="104" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0f5c6e" stopOpacity="0.15" />
        <stop offset="0.55" stopColor="#13705f" stopOpacity="0.5" />
        <stop offset="1" stopColor="#2d9a6a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={ids.branch} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7a5418" />
        <stop offset="0.5" stopColor="#b48a3c" />
        <stop offset="1" stopColor="#7a5418" />
      </linearGradient>
    </defs>
  );
}

function Feather({ length: L, index, ids }) {
  return (
    <g className="loop-feather" style={{ animationDelay: `${-index * 0.43}s` }}>
      <path
        d={`M0 0Q${L * 0.5} ${-L * 0.035} ${L - 10} 0`}
        fill="none"
        stroke={`url(#${ids.quill})`}
        strokeWidth="1.1"
      />
      <path
        d={`M${L * 0.16} 0C${L * 0.5} -6 ${L - 20} -12.5 ${L - 4} -9.6C${L + 7} -6.6 ${L + 7} 6.6 ${L - 4} 9.6C${L - 20} 12.5 ${L * 0.5} 6 ${L * 0.16} 0Z`}
        fill={`url(#${ids.vane})`}
      />
      <g transform={`translate(${L - 4} 0)`}>
        <ellipse rx="8.6" ry="6.8" fill={`url(#${ids.eyeOuter})`} />
        <ellipse rx="6.4" ry="5" fill="#1d8a66" />
        <ellipse cx="-0.6" rx="4.7" ry="3.7" fill={`url(#${ids.eyeTeal})`} />
        <ellipse cx="-1.1" rx="2.8" ry="2.3" fill="#0b1d4a" />
        <ellipse cx="-2" cy="-0.9" rx="0.9" ry="0.6" fill="#fff" opacity="0.75" />
        <ellipse
          className="loop-glint"
          rx="8.6"
          ry="6.8"
          fill="none"
          stroke="#fff4c9"
          strokeWidth="1.2"
          style={{ animationDelay: `${-index * 0.61}s` }}
        />
      </g>
    </g>
  );
}

function wedge(from, to, r) {
  const p = (a) => `${(r * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`;
  return `M0 0L${p(from)}A${r} ${r} 0 0 1 ${p(to)}Z`;
}

function Train({ x, y, feathers, ids, offset = 0, scale = 1, base }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="loop-train" style={{ animationDelay: `${-offset}s` }}>
        {base && <path d={wedge(...base)} fill={`url(#${ids.fanBase})`} />}
        {feathers.map(([angle, length], i) => (
          <g key={`${angle}-${length}`} transform={`rotate(${angle})`}>
            <Feather length={length} index={i + offset * 3} ids={ids} />
          </g>
        ))}
      </g>
    </g>
  );
}

function Body({ ids, perched }) {
  return (
    <g>
      <g fill="none" stroke="#b28a45" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        {perched ? (
          <>
            <path d="M45 13l2 9M41 25c2-3 4-3 6-3s4 1 5 4" />
            <path d="M58 10l3 11M56 24c2-3 4-3 6-3s4 1 5 4" />
          </>
        ) : (
          <>
            <path d="M44 13L41 50M41 50l-7 3M41 50l1 5M41 50l7 2" />
            <path d="M56 11L60 50M60 50l-7 3M60 50l1 5M60 50l7 2" />
          </>
        )}
      </g>

      <path d={BODY} fill={`url(#${ids.body})`} />
      {/* breast scallops */}
      <g fill="none" stroke="#7cc8e0" strokeOpacity="0.35" strokeWidth="0.9">
        <path d="M79 -26q3 2.5 6 0M73 -15q3 2.5 6 0q3 2.5 6 0M67 -4q3 2.5 6 0q3 2.5 6 0" />
      </g>
      {/* neck sheen */}
      <path d="M92.5 -70C88 -58 90.5 -44 87 -31" fill="none" stroke="#bfe8ff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />

      <path d={WING} fill={`url(#${ids.wing})`} />
      <g fill="none" stroke="#6e4f12" strokeOpacity="0.55" strokeWidth="0.9" strokeLinecap="round">
        <path d="M64 -25C53 -17 40 -11 27 -6" />
        <path d="M67 -15C57 -7 45 -3 34 -1" />
        <path d="M44 -14q3 3 6 1M36 -9q3 3 6 1M52 -19q3 3 6 1" />
      </g>

      {/* head details */}
      <path d="M97 -85L108 -80.5L97 -77.5Z" fill="#c9a24a" />
      <path d="M87.5 -88.5C89.5 -91.5 93.5 -91.5 95.8 -89C93.8 -86.8 89.8 -86.8 87.5 -88.5Z" fill="#fff" />
      <circle cx="92.2" cy="-88.9" r="1.3" fill="#141414" />
      <path d="M86 -83.5C89 -82.6 92.8 -82.8 96 -84.2" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.1" strokeLinecap="round" />

      {/* crest */}
      <g stroke="#1e6f8a" strokeWidth="0.9">
        {CREST.map(([x, y]) => (
          <line key={x} x1="88.5" y1="-94.5" x2={x} y2={y} />
        ))}
      </g>
      {CREST.map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="2.1" ry="2.6" fill="#1aa0a8" stroke="#e7c870" strokeWidth="0.8" />
      ))}
    </g>
  );
}

function Leaf({ x, y, angle, size = 1, tone = '#0f5c6e' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
      <path d="M0 0C6 -6 16 -7 24 0C16 7 6 6 0 0Z" fill={tone} />
      <path d="M1 0H21" stroke="#e2c26c" strokeOpacity="0.7" strokeWidth="0.7" />
    </g>
  );
}

function Blossom({ x, y, r = 4 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r} rx={r * 0.62} ry={r} fill="#f6b8c7" transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.45} fill="#d4af37" />
    </g>
  );
}

export function Peacock({ variant = 'standing', mirrored = false, className }) {
  const ids = useIds();
  const perched = variant === 'perched';

  return (
    <svg
      viewBox={perched ? '0 0 220 262' : '0 0 250 186'}
      className={className}
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <Defs ids={ids} />
      {perched ? (
        <>
          <Train x={80} y={124} feathers={PERCHED_TRAIN} ids={ids} base={[96, 132, 118]} />
          <Train x={80} y={124} feathers={PERCHED_COVERTS} ids={ids} offset={1.3} scale={0.92} />
          <path
            d="M-6 152C40 141 92 150 140 141C170 135 198 137 226 128"
            fill="none"
            stroke={`url(#${ids.branch})`}
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path d="M150 139c10-8 20-12 34-12" fill="none" stroke="#8f6b17" strokeWidth="2.4" strokeLinecap="round" />
          <Leaf x={20} y={147} angle={-150} size={0.9} />
          <Leaf x={36} y={145} angle={-40} size={0.8} tone="#1e8299" />
          <Leaf x={176} y={134} angle={-120} size={0.85} tone="#1e8299" />
          <Leaf x={196} y={131} angle={-20} size={0.95} />
          <Leaf x={184} y={127} angle={-70} size={0.7} />
          <Blossom x={30} y={140} r={4.2} />
          <Blossom x={190} y={124} r={4.6} />
          <Blossom x={204} y={134} r={3.4} />
          <g transform="translate(80 126)">
            <g className="loop-breathe">
              <Body ids={ids} perched />
            </g>
          </g>
        </>
      ) : (
        <>
          <ellipse cx="160" cy="176" rx="62" ry="4" fill="#000" opacity="0.14" />
          <Train x={122} y={118} feathers={STANDING_TRAIN} ids={ids} base={[146, 210, 100]} />
          <Train x={122} y={118} feathers={STANDING_COVERTS} ids={ids} offset={1.7} scale={0.9} />
          <g transform="translate(122 120)">
            <g className="loop-breathe">
              <Body ids={ids} />
            </g>
          </g>
        </>
      )}
    </svg>
  );
}
