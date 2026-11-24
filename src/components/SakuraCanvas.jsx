import { useEffect, useRef } from 'react';
import { useAmbient } from '../context/AmbientContext';
import { createPetalEngine } from '../lib/petals';

/** Fixed, click-through canvas for the petal rain and celebration bursts. */
export default function SakuraCanvas({ active }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const { paused, registerBurst } = useAmbient();

  useEffect(() => {
    const engine = createPetalEngine(canvasRef.current);
    engineRef.current = engine;
    registerBurst((x, y, options) => engine.burst(x, y, options));
    return () => {
      registerBurst(null);
      engine.destroy();
      engineRef.current = null;
    };
  }, [registerBurst]);

  useEffect(() => {
    engineRef.current?.setRaining(active && !paused);
    engineRef.current?.setBursts(!paused);
  }, [active, paused]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 h-screen w-full supports-[height:100lvh]:h-lvh"
    />
  );
}
