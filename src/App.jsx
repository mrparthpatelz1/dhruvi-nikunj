import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AmbientControls from './components/AmbientControls';
import EnvelopeIntro from './components/Envelope';
import Events from './components/Events';
import Footer from './components/Footer';
import Hero from './components/Hero';
import SakuraCanvas from './components/SakuraCanvas';
import ScratchReveal from './components/ScratchReveal';
import Venue from './components/Venue';
import { AmbientProvider, useAmbient } from './context/AmbientContext';
import { ToastProvider } from './context/ToastContext';
import { WEDDING_DATA } from './data/weddingData';

function Invitation() {
  const [opened, setOpened] = useState(false);
  const { startMusic } = useAmbient();

  // The envelope owns the screen until it's opened: lock scrolling underneath.
  useEffect(() => {
    document.documentElement.classList.toggle('scroll-locked', !opened);
  }, [opened]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SakuraCanvas active={opened} />

      {opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1 }}>
          <main>
            <Hero />
            <ScratchReveal />
            <Events />
            <Venue />
          </main>
          <Footer />
          <AmbientControls />
        </motion.div>
      )}

      <AnimatePresence>
        {!opened && (
          <EnvelopeIntro
            key="envelope"
            onOpenStart={() => {
              if (WEDDING_DATA.music.autoplayOnOpen) startMusic();
            }}
            onOpened={() => setOpened(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AmbientProvider>
          <Invitation />
        </AmbientProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
