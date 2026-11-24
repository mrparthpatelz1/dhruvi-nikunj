import { motion } from 'framer-motion';
import { fadeUp, revealOnce, stagger } from '../lib/motion';
import { Divider } from './ornaments/Ornaments';

/** Script eyebrow, Cinzel title, lotus divider, optional italic subtitle. */
export default function SectionHeading({ eyebrow, title, subtitle, tone = 'light', id, className = '' }) {
  const dark = tone === 'dark';
  return (
    <motion.header {...revealOnce} variants={stagger(0.12)} className={`mx-auto max-w-2xl text-center ${className}`}>
      {eyebrow && (
        <motion.p
          variants={fadeUp}
          className={`font-script text-3xl leading-none md:text-4xl ${dark ? 'text-gold-light' : 'text-gold-deep'}`}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        id={id}
        variants={fadeUp}
        className={`mt-2 font-display text-[clamp(1.9rem,7vw,3.1rem)] font-bold leading-tight ${dark ? 'text-ivory' : 'text-maroon'}`}
      >
        {title}
      </motion.h2>
      <motion.div variants={fadeUp} className="mt-3 flex justify-center">
        <Divider className={`h-6 w-52 md:w-60 ${dark ? 'text-gold' : 'text-gold-deep'}`} />
      </motion.div>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={`mx-auto mt-4 max-w-xl font-serif text-lg italic leading-relaxed md:text-xl ${dark ? 'text-ivory/80' : 'text-maroon-ink/80'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.header>
  );
}
