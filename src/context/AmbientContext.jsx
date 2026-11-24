import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { WEDDING_DATA } from '../data/weddingData';
import { createMusicPlayer } from '../lib/music';

const AmbientContext = createContext(null);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Owns the "ambience": the pause switch for every decorative loop (petals,
 * CSS loops), the background music, and a burst() hook the petal canvas
 * registers so any section can trigger a celebration.
 */
export function AmbientProvider({ children }) {
  // Guests who ask their OS for reduced motion start paused; they can still opt in.
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [musicOn, setMusicOn] = useState(false);
  const playerRef = useRef(null);
  const wantMusic = useRef(false);
  const burstRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'running';
  }, [paused]);

  const player = () => (playerRef.current ??= createMusicPlayer(WEDDING_DATA.music));

  const startMusic = useCallback(async () => {
    wantMusic.current = true;
    const ok = await player().play();
    if (!ok) wantMusic.current = false;
    setMusicOn(ok);
    return ok;
  }, []);

  const stopMusic = useCallback(() => {
    wantMusic.current = false;
    playerRef.current?.pause();
    setMusicOn(false);
  }, []);

  const toggleMusic = useCallback(
    () => (wantMusic.current ? stopMusic() : startMusic()),
    [startMusic, stopMusic],
  );

  // Fall silent while the tab is hidden; pick up again when the guest returns.
  useEffect(() => {
    const onVisibility = () => {
      const p = playerRef.current;
      if (!p || !wantMusic.current) return;
      if (document.hidden) p.pause();
      else
        p.play().then((ok) => {
          if (!ok) {
            wantMusic.current = false;
            setMusicOn(false);
          }
        });
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => () => playerRef.current?.dispose(), []);

  const registerBurst = useCallback((fn) => {
    burstRef.current = fn;
  }, []);
  const burst = useCallback((x, y, options) => burstRef.current?.(x, y, options), []);
  const togglePaused = useCallback(() => setPaused((p) => !p), []);

  const value = useMemo(
    () => ({ paused, togglePaused, musicOn, toggleMusic, startMusic, burst, registerBurst }),
    [paused, togglePaused, musicOn, toggleMusic, startMusic, burst, registerBurst],
  );

  return <AmbientContext.Provider value={value}>{children}</AmbientContext.Provider>;
}

export const useAmbient = () => useContext(AmbientContext);
