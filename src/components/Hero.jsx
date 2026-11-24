import { motion } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';
import { dateParts, formatTime } from '../lib/format';
import { fadeUp, scaleIn, stagger } from '../lib/motion';
import Countdown from './Countdown';
import { Ganesha } from './ornaments/Ganesha';
import { ChevronDownIcon } from './ornaments/Icons';
import { Mandala, Paisley, Toran } from './ornaments/Ornaments';

const { bride, groom, wedding, invitationLine, blessing, blessingNative } = WEDDING_DATA;
const WD = dateParts(wedding.dateTime);
const WTIME = formatTime(wedding.dateTime);

function Person({ person, side }) {
  return (
    <div className={`flex flex-col items-center ${side === 'left' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
      <p className="text-gold-shimmer font-display text-[clamp(2.9rem,13vw,5.4rem)] font-bold leading-[1.05]">
        {person.name}
      </p>
      <p className="mt-1 font-serif text-[1.05rem] italic leading-snug text-maroon-ink/75 md:text-lg">
        {person.relation}{' '}
        <span className="block font-medium not-italic text-maroon sm:inline">{person.parents}</span>
      </p>
    </div>
  );
}

function DateBand() {
  const side =
    'min-w-[6.5rem] border-y border-gold/60 px-2 py-2 font-cinzel text-[0.8rem] font-medium uppercase tracking-[0.24em] text-maroon md:min-w-[8.5rem] md:text-sm';
  return (
    <div className="flex flex-col items-center">
      <p className="eyebrow text-gold-deep">Save the Date</p>
      <div className="mt-3 flex items-center gap-3 md:gap-6">
        <span className={side}>{WD.weekday}</span>
        <span className="font-display text-[3.4rem] font-bold leading-none text-maroon md:text-7xl">{WD.day}</span>
        <span className={side}>{WTIME}</span>
      </div>
      <p className="mt-3 font-cinzel text-lg font-medium uppercase tracking-[0.32em] text-maroon md:text-xl">
        {WD.month} {WD.year}
      </p>
      <p className="mt-1.5 font-serif text-lg italic text-maroon-ink/75">
        {wedding.city}, {wedding.region}
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden px-4 pb-24 pt-28 text-center md:pt-36">
      {/* backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#fde9ee_0%,transparent_58%),radial-gradient(ellipse_at_0%_100%,rgba(249,198,208,0.38),transparent_52%),radial-gradient(ellipse_at_100%_95%,rgba(212,175,55,0.2),transparent_50%)]" />
        <div className="absolute left-1/2 top-[19rem] w-[min(150vw,980px)] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.17] md:top-[22rem]">
          <Mandala className="loop-spin-slow w-full will-change-transform" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ivory" />
        <Paisley className="absolute bottom-10 left-4 h-14 w-14 -scale-x-100 text-gold/50 md:h-20 md:w-20" />
        <Paisley className="absolute bottom-10 right-4 h-14 w-14 text-gold/50 md:h-20 md:w-20" />
      </div>
      <Toran className="absolute inset-x-0 top-0" />

      <h1 id="hero-title" className="sr-only">
        {bride.name} &amp; {groom.name} — Wedding Invitation
      </h1>

      <motion.div
        variants={stagger(0.17, 0.35)}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-4xl flex-col items-center"
      >
        <motion.div variants={scaleIn} className="relative w-28 md:w-36">
          <span aria-hidden="true" className="loop-halo absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.34),transparent_68%)]" />
          <Ganesha delay={0.6} duration={2} className="relative w-full text-gold-deep" title="Lord Ganesha" />
        </motion.div>

        {blessingNative && (
          <motion.p variants={fadeUp} lang="sa" className="mt-3 font-deva text-xl text-gold-deep md:text-2xl">
            {blessingNative}
          </motion.p>
        )}
        <motion.p variants={fadeUp} className="eyebrow mt-1.5 text-maroon/70">
          {blessing}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-7 max-w-xl font-serif text-lg italic leading-relaxed text-maroon-ink/85 md:text-xl"
        >
          {invitationLine}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-6 grid w-full grid-cols-1 items-center gap-y-1 md:mt-9 md:grid-cols-[1fr_auto_1fr] md:gap-x-8"
        >
          <Person person={bride} side="left" />
          <span aria-hidden="true" className="text-gold-shimmer font-script text-6xl leading-none md:text-8xl">
            &amp;
          </span>
          <Person person={groom} side="right" />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 md:mt-12">
          <DateBand />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 w-full md:mt-12">
          <Countdown target={wedding.dateTime} />
        </motion.div>
      </motion.div>

      <motion.a
        href="#couple"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-gold-deep"
        aria-label="Scroll to the couple"
      >
        <span className="eyebrow text-[0.6rem]">Scroll</span>
        <ChevronDownIcon className="loop-bounce h-5 w-5" />
      </motion.a>
    </section>
  );
}
