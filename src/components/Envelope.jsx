import { motion, useAnimate, useReducedMotion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { WEDDING_DATA } from '../data/weddingData';
import { dateParts } from '../lib/format';
import { EASE_IN_OUT, EASE_OUT } from '../lib/motion';
import { Ganesha } from './ornaments/Ganesha';
import { Mandala, Sparkle } from './ornaments/Ornaments';

const { bride, groom, wedding, blessing, blessingNative } = WEDDING_DATA;
const WD = dateParts(wedding.dateTime);

/* Irregular wax-blob outline, generated once. */
function blobPath(n = 18, r = 52, jitter = 3) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r + Math.sin(i * 2.7) * jitter + Math.cos(i * 1.3) * jitter * 0.6;
    return [Math.cos(a) * rr, Math.sin(a) * rr];
  });
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const fmt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M${fmt(mid(pts[n - 1], pts[0]))}`;
  for (let i = 0; i < n; i++) d += `Q${fmt(pts[i])} ${fmt(mid(pts[i], pts[(i + 1) % n]))}`;
  return `${d}Z`;
}
const BLOB = blobPath();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function WaxSeal() {
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="wax-body" cx="0.38" cy="0.32" r="0.78">
          <stop offset="0" stopColor="#b8394f" />
          <stop offset="0.5" stopColor="#7f2034" />
          <stop offset="1" stopColor="#4a0f1d" />
        </radialGradient>
        <radialGradient id="wax-well" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#8e2639" />
          <stop offset="1" stopColor="#581325" />
        </radialGradient>
      </defs>
      <path d={BLOB} fill="url(#wax-body)" />
      <circle r="41" fill="url(#wax-well)" stroke="#3a0916" strokeOpacity="0.65" strokeWidth="2.6" />
      <circle r="44.6" fill="none" stroke="#f4b3be" strokeOpacity="0.22" strokeWidth="1" />
      <circle r="37" fill="none" stroke="#e9c46a" strokeOpacity="0.55" strokeWidth="0.8" strokeDasharray="0.1 3.2" strokeLinecap="round" />
      <path d="M-33 -20A39 39 0 0 1 18 -36" fill="none" stroke="#fff" strokeOpacity="0.26" strokeWidth="3.4" strokeLinecap="round" />
      <Ganesha
        x="-33"
        y="-35"
        width="66"
        height="66"
        delay={0.9}
        duration={1.9}
        strokeWidth={3}
        color="#efd189"
        fillOpacity={0.22}
      />
    </svg>
  );
}

/** Ivory card that slides out of the envelope. */
function InviteCard() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-[linear-gradient(180deg,#fffdf8,#f8eedc)] p-[3.5%] shadow-[0_-6px_24px_-10px_rgba(58,15,27,0.45)]">
      <div className="flex h-full flex-col items-center rounded-[4px] border border-gold/60 px-3 pt-[5%] text-center outline outline-1 outline-offset-[-5px] outline-gold/30">
        <Ganesha draw={false} className="h-[18%] w-auto text-gold-deep" />
        <p className="mt-1 font-sans text-[clamp(0.42rem,1.6vw,0.6rem)] uppercase tracking-[0.3em] text-maroon/70">
          {blessing}
        </p>
        <p className="mt-[3%] font-script text-[clamp(1.5rem,7.4vw,2.6rem)] leading-[1.05] text-maroon">
          {bride.name} <span className="text-gold-deep">&amp;</span> {groom.name}
        </p>
        <p className="mt-[2%] font-cinzel text-[clamp(0.5rem,2vw,0.72rem)] uppercase tracking-[0.32em] text-gold-deep">
          {WD.day} {WD.month} {WD.year}
        </p>
      </div>
    </div>
  );
}

const TWINKLES = [
  [12, 18, 0],
  [84, 14, 0.7],
  [8, 62, 1.4],
  [90, 58, 0.4],
  [22, 86, 1.9],
  [76, 84, 1.1],
  [50, 8, 2.3],
  [64, 30, 1.7],
  [30, 36, 2.6],
];

export default function EnvelopeIntro({ onOpenStart, onOpened }) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate();
  const [opening, setOpening] = useState(false);
  const flapRef = useRef(null);
  const sparks = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ a: (i / 14) * Math.PI * 2 + Math.random() * 0.3, d: 70 + Math.random() * 60 })),
    [],
  );

  async function open() {
    if (opening) return;
    setOpening(true);
    onOpenStart?.(); // runs inside the tap, so music is allowed to start

    if (reduce) {
      onOpened();
      return;
    }

    // Each step resolves when its animation ends — or after its duration at the
    // latest, so an interrupted animation can never stall the opening.
    const step = (target, keyframes, options) => {
      const ms = ((options.duration ?? 0.3) + (options.delay ?? 0)) * 1000 + 120;
      return Promise.race([animate(target, keyframes, options), wait(ms)]);
    };

    step('[data-env="hint"]', { opacity: 0, y: 10 }, { duration: 0.4 });
    step('[data-env="spark"]', { opacity: [0, 1, 0], scale: [0.4, 1, 0.6] }, { duration: 0.9, ease: 'easeOut' });
    sparks.forEach((s, i) =>
      step(
        `[data-env="spark"]:nth-child(${i + 1})`,
        { x: Math.cos(s.a) * s.d, y: Math.sin(s.a) * s.d },
        { duration: 0.9, ease: EASE_OUT },
      ),
    );
    await step(
      '[data-env="seal"]',
      { scale: [1, 1.14, 0.35], opacity: [1, 1, 0], rotate: [0, -4, -16], filter: ['blur(0px)', 'blur(0px)', 'blur(6px)'] },
      { duration: 0.75, times: [0, 0.35, 1], ease: 'easeInOut' },
    );
    await step('[data-env="flap"]', { rotateX: 90 }, { duration: 0.42, ease: 'easeIn' });
    if (flapRef.current) flapRef.current.style.zIndex = '1'; // tuck the open flap behind the card
    step('[data-env="flap"]', { rotateX: 180 }, { duration: 0.55, ease: EASE_OUT });
    step('[data-env="stage"]', { y: '9vh' }, { duration: 1.3, ease: EASE_IN_OUT });
    await step('[data-env="card"]', { y: '-60%' }, { duration: 1.2, delay: 0.12, ease: EASE_OUT });
    await wait(420);
    onOpened();
  }

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 z-[60] touch-none overflow-hidden select-none"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1.05, ease: EASE_IN_OUT }}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation — tap the seal to open"
    >
      {/* backdrop: warm glow, slow light rays, a turning mandala, twinkles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,#fffaf3_0%,#fbeee8_42%,#f3d9d6_78%,#ebc6c6_100%)]" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[170vmax] w-[170vmax] -translate-x-1/2 -translate-y-1/2"
        style={{
          maskImage: 'radial-gradient(circle, #000 8%, transparent 46%)',
          WebkitMaskImage: 'radial-gradient(circle, #000 8%, transparent 46%)',
        }}
      >
        <div className="loop-spin-slow h-full w-full bg-[repeating-conic-gradient(from_0deg,rgba(212,175,55,0.16)_0deg_5deg,transparent_5deg_15deg)] will-change-transform" />
      </div>
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 w-[132vmin] -translate-x-1/2 -translate-y-1/2 text-gold opacity-25">
        <Mandala className="loop-spin-rev w-full will-change-transform" />
      </div>
      {TWINKLES.map(([x, y, delay]) => (
        <span key={`${x}-${y}`} aria-hidden="true" className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
          <Sparkle className="loop-twinkle h-3 w-3 text-gold md:h-4 md:w-4" style={{ animationDelay: `${delay}s` }} />
        </span>
      ))}

      <div data-env="stage" className="relative flex h-full flex-col items-center justify-center gap-[4vh] px-4">
        <motion.div
          data-env="hint"
          className="text-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1.1, ease: EASE_OUT }}
        >
          {blessingNative && (
            <p lang="sa" className="font-deva text-xl text-gold-deep md:text-2xl">
              {blessingNative}
            </p>
          )}
          <p className="eyebrow mt-1.5 text-maroon/75">{blessing}</p>
        </motion.div>

        {/* the envelope */}
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.1, ease: EASE_OUT }}
          className="relative aspect-[10/7] w-[min(88vw,460px)] lg:w-[540px]"
          style={{ perspective: '1600px' }}
        >
          <div aria-hidden="true" className="absolute -bottom-7 left-[8%] right-[8%] h-10 rounded-[50%] bg-maroon-ink/35 blur-xl" />

          {/* inside of the envelope */}
          <div className="absolute inset-0 overflow-hidden rounded-[10px] bg-[linear-gradient(180deg,#5a1526,#3d0c1a)]">
            <div className="bg-jaali absolute inset-0 opacity-80" />
          </div>

          {/* card */}
          <div data-env="card" className="absolute inset-x-[6%] top-[5%] z-[2] h-[92%]">
            <InviteCard />
          </div>

          {/* front pocket */}
          <div
            className="absolute inset-0 z-[3] overflow-hidden rounded-[10px] bg-[linear-gradient(180deg,#7d2337_0%,#6b1d2f_45%,#561626_100%)] shadow-[inset_0_-12px_30px_rgba(30,4,10,0.35)]"
            style={{ clipPath: 'polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)' }}
          >
            <div className="bg-jaali absolute inset-0 opacity-50" />
            <div className="absolute inset-[7px] rounded-[6px] border border-gold/45" />
            <div className="absolute inset-x-0 bottom-[7%] text-center">
              <p className="inline-block px-3 py-1 font-script text-[clamp(1.35rem,6.4vw,2.2rem)] leading-none text-gold-static">
                {bride.name} &amp; {groom.name}
              </p>
            </div>
          </div>
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] h-full w-full" viewBox="0 0 100 70" preserveAspectRatio="none">
            <path d="M0 0L50 37.8L100 0" fill="none" stroke="#d4af37" strokeOpacity="0.75" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            <path d="M0 70L44 33M100 70L56 33" fill="none" stroke="#2a0610" strokeOpacity="0.28" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* flap (two faces so the inside liner shows once it flips) */}
          <div
            ref={flapRef}
            data-env="flap"
            className="absolute inset-x-0 top-0 z-[4] h-[58%]"
            style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,#86283d_0%,#6f1f32_60%,#5c1828_100%)]"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="bg-jaali absolute inset-0 opacity-50" />
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 58" preserveAspectRatio="none">
                <path d="M3 1.5L50 54L97 1.5" fill="none" stroke="#d4af37" strokeOpacity="0.85" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div
              className="absolute inset-0 bg-[linear-gradient(0deg,#f6ead2,#e9d3a6)]"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(143,107,23,0.35)_1px,transparent_1.2px)] [background-size:9px_9px]" />
            </div>
          </div>

          {/* wax seal with Ganesha */}
          <div className="absolute left-1/2 top-[56%] z-[5] aspect-square w-[32%] max-w-[150px] -translate-x-1/2 -translate-y-1/2">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {sparks.map((s, i) => (
                <span
                  key={i}
                  data-env="spark"
                  className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 opacity-0"
                >
                  <Sparkle className="h-3 w-3 text-gold-light" />
                </span>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={open}
              disabled={opening}
              aria-label="Tap the seal to open the invitation"
              className="relative block aspect-square w-full cursor-pointer rounded-full outline-none focus-visible:ring-4 focus-visible:ring-gold/70"
              whileHover={opening ? undefined : { scale: 1.05 }}
              whileTap={opening ? undefined : { scale: 0.96 }}
            >
              <span data-env="seal" className="relative block h-full w-full">
                <span aria-hidden="true" className="absolute -inset-[30%] rounded-full bg-[radial-gradient(circle,rgba(240,205,110,0.75)_0%,rgba(212,175,55,0.28)_40%,transparent_68%)] loop-halo" />
                <span className="relative block h-full w-full drop-shadow-[0_10px_14px_rgba(40,5,12,0.55)]">
                  <WaxSeal />
                </span>
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          data-env="hint"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.9, ease: EASE_OUT }}
          className="text-center"
        >
          <button
            type="button"
            onClick={open}
            disabled={opening}
            className="loop-pulse min-h-11 cursor-pointer rounded-full px-5 py-2 font-cinzel text-sm font-semibold uppercase tracking-[0.22em] text-maroon md:text-base"
          >
            Tap the Seal to Open Invitation
          </button>
          <p className="mt-1 font-serif text-base italic text-maroon-ink/60">
            {bride.name} &amp; {groom.name} · {WD.day} {WD.month} {WD.year}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
