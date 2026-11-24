import { motion } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';
import { formatNumericDate, formatPhone, telHref, whatsappHref } from '../lib/format';
import { EASE_OUT, fadeUp, revealOnce, stagger } from '../lib/motion';
import { Ganesha } from './ornaments/Ganesha';
import { PhoneIcon, WhatsAppIcon } from './ornaments/Icons';
import { Mandala } from './ornaments/Ornaments';
import { Peacock } from './ornaments/Peacock';
import SectionHeading from './SectionHeading';

const { bride, groom, wedding, compliments, contacts } = WEDDING_DATA;

export default function Footer() {
  return (
    <footer id="blessings" aria-labelledby="blessings-title" className="relative isolate overflow-hidden bg-maroon-deep text-ivory">
      <div aria-hidden="true" className="bg-jaali absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 w-[min(150vw,900px)] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.13]">
        <Mandala className="loop-spin-rev w-full will-change-transform" />
      </div>
      <div aria-hidden="true" className="h-2 bg-[linear-gradient(90deg,#8f6b17,#f3dc94,#d4af37,#f3dc94,#8f6b17)]" />

      <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-20 text-center md:pb-24 md:pt-24">
        <SectionHeading id="blessings-title" tone="dark" eyebrow="With love" title={compliments.heading} />

        <motion.ul {...revealOnce} variants={stagger(0.15)} className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-6">
          {compliments.families.map((f) => (
            <motion.li key={f.names} variants={fadeUp} className="rounded-3xl border border-gold/30 bg-white/[0.04] px-6 py-7">
              <p className="eyebrow text-[0.62rem] text-gold-light/80">{f.note}</p>
              <p className="mt-2 font-display text-[1.45rem] font-bold leading-snug text-gold-light md:text-2xl">{f.names}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p {...revealOnce} variants={fadeUp} className="mx-auto mt-10 max-w-xl font-serif text-xl italic leading-relaxed text-ivory/85 md:text-2xl">
          {compliments.closingLine}
        </motion.p>

        <motion.div {...revealOnce} variants={stagger(0.12)} className="mt-14">
          <motion.p variants={fadeUp} className="eyebrow text-gold-light">
            For any assistance
          </motion.p>
          <ul className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-3">
            {contacts.map((c) => (
              <motion.li key={c.phone} variants={fadeUp} className="rounded-3xl border border-gold/35 bg-maroon/70 p-5">
                {c.name && <p className="font-serif text-xl text-ivory">{c.name}</p>}
                <p className="font-cinzel text-lg font-medium tracking-[0.08em] text-gold-pale">{formatPhone(c.phone)}</p>
                <div className="mt-4 flex gap-2.5">
                  <a href={telHref(c.phone)} className="btn btn-gold flex-1 px-3" aria-label={`Call ${c.name || formatPhone(c.phone)}`}>
                    <PhoneIcon className="h-4 w-4" />
                    Call
                  </a>
                  <a
                    href={whatsappHref(c.phone, `Namaste! I have a question about ${bride.name} & ${groom.name}'s wedding.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost-light flex-1 px-3"
                    aria-label={`WhatsApp ${c.name || formatPhone(c.phone)}`}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...revealOnce} variants={fadeUp} className="mt-16 flex flex-col items-center">
          <Ganesha draw={false} className="w-14 text-gold" />
          <p className="mt-3 px-2 font-script text-5xl leading-tight text-gold-static">
            {bride.name} &amp; {groom.name}
          </p>
          <p className="eyebrow mt-2 text-ivory/60">
            {formatNumericDate(wedding.dateTime)} · {wedding.city}
          </p>
        </motion.div>
      </div>

      {/* perched peacock: in the flow on phones, a corner flourish on larger screens */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.4, ease: EASE_OUT }}
        className="pointer-events-none -mt-6 w-[60vw] max-w-[260px] -translate-x-[4%] pb-[env(safe-area-inset-bottom)] md:absolute md:bottom-0 md:left-0 md:mt-0 md:w-[22vw] md:max-w-[300px] md:translate-x-0 lg:left-4"
      >
        <Peacock variant="perched" />
      </motion.div>
    </footer>
  );
}
