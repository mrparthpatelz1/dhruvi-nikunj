import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAmbient } from '../context/AmbientContext';
import { MusicIcon, PauseIcon, SparkleIcon } from './ornaments/Icons';

const btn =
  'relative grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold/60 bg-ivory/90 text-maroon shadow-[0_10px_24px_-12px_rgba(58,15,27,0.6)] backdrop-blur-sm transition hover:border-gold hover:bg-white active:scale-95';

function Equalizer() {
  return (
    <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
      {[0, 0.25, 0.5, 0.15].map((d) => (
        <span
          key={d}
          className="loop-eq block w-[3px] origin-bottom rounded-full bg-maroon"
          style={{ height: '100%', animationDelay: `${-d}s` }}
        />
      ))}
    </span>
  );
}

/** Floating corner buttons: soft music and pause/resume for all ambient motion. */
export default function AmbientControls() {
  const { paused, togglePaused, musicOn, toggleMusic } = useAmbient();
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setHint(true), 2200);
    const hide = setTimeout(() => setHint(false), 8200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex flex-col items-end gap-2.5"
    >
      <div className="relative">
        <AnimatePresence>
          {hint && !musicOn && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-maroon px-3.5 py-2 font-sans text-xs text-gold-pale shadow-lg"
            >
              Tap for soft music ♪
            </motion.span>
          )}
        </AnimatePresence>
        <button
          type="button"
          className={btn}
          onClick={() => {
            setHint(false);
            toggleMusic();
          }}
          aria-pressed={musicOn}
          aria-label={musicOn ? 'Pause background music' : 'Play soft background music'}
          title={musicOn ? 'Pause music' : 'Play music'}
        >
          {musicOn ? <Equalizer /> : <MusicIcon className="h-5 w-5" />}
        </button>
      </div>
      <button
        type="button"
        className={btn}
        onClick={togglePaused}
        aria-pressed={!paused}
        aria-label={paused ? 'Resume petals and animations' : 'Pause petals and animations'}
        title={paused ? 'Resume animations' : 'Pause animations'}
      >
        {paused ? <SparkleIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
      </button>
    </motion.div>
  );
}
