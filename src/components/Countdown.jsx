import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { EASE_OUT } from '../lib/motion';

function useCountdown(iso) {
  const target = useMemo(() => new Date(iso).getTime(), [iso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let id;
    const tick = () => {
      setNow(Date.now());
      id = setTimeout(tick, 1000 - (Date.now() % 1000) + 8); // stay aligned to the second
    };
    id = setTimeout(tick, 1000 - (Date.now() % 1000) + 8);
    return () => clearTimeout(id);
  }, []);

  const diff = Math.max(0, target - now);
  return {
    done: diff === 0,
    days: Math.floor(diff / 864e5),
    hours: Math.floor(diff / 36e5) % 24,
    minutes: Math.floor(diff / 6e4) % 60,
    seconds: Math.floor(diff / 1e3) % 60,
  };
}

function Digit({ char }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-block h-[1.2em] w-[0.74em] overflow-hidden [perspective:300px]">
      <AnimatePresence initial={false}>
        <motion.span
          key={char}
          className="absolute inset-0 flex items-center justify-center"
          initial={reduce ? { opacity: 0 } : { y: '-75%', opacity: 0, rotateX: 75 }}
          animate={reduce ? { opacity: 1 } : { y: '0%', opacity: 1, rotateX: 0 }}
          exit={reduce ? { opacity: 0 } : { y: '75%', opacity: 0, rotateX: -75 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const UNITS = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Minutes'],
  ['seconds', 'Seconds'],
];

export default function Countdown({ target }) {
  const t = useCountdown(target);

  if (t.done) {
    return (
      <p className="font-script text-4xl text-gold-deep md:text-5xl">The celebrations have begun!</p>
    );
  }

  return (
    <div>
      <p className="eyebrow mb-4 text-maroon/70">Counting down to forever</p>
      <div
        role="timer"
        aria-label={`${t.days} days, ${t.hours} hours and ${t.minutes} minutes to go`}
        className="mx-auto grid max-w-lg grid-cols-4 gap-2 sm:gap-4"
      >
        {UNITS.map(([key, label]) => (
          <div
            key={key}
            className="relative rounded-2xl bg-[linear-gradient(180deg,#fffdf8,#f7ecd9)] px-1 py-3 shadow-[0_14px_28px_-20px_rgba(58,15,27,0.7)] ring-1 ring-gold/55 sm:py-4"
          >
            <span aria-hidden="true" className="absolute inset-1 rounded-xl border border-gold/25" />
            <div aria-hidden="true" className="flex justify-center font-cinzel text-[clamp(1.6rem,7.5vw,2.6rem)] font-semibold leading-none text-maroon">
              {String(t[key])
                .padStart(2, '0')
                .split('')
                .map((ch, i, arr) => (
                  <Digit key={arr.length - i} char={ch} />
                ))}
            </div>
            <p className="mt-1.5 font-sans text-[0.58rem] uppercase tracking-[0.22em] text-gold-deep sm:text-[0.66rem]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
