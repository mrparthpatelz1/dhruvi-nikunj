import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { WEDDING_DATA } from '../data/weddingData';
import { mapEmbedSrc } from '../lib/format';
import { EASE_OUT, fadeUp, revealOnce } from '../lib/motion';
import { CopyIcon, DirectionsIcon, PinIcon, SparkleIcon } from './ornaments/Icons';
import { CardCorners } from './ornaments/Ornaments';
import SectionHeading from './SectionHeading';

const { events, venues } = WEDDING_DATA;

// Every venue used by an event, in the order the events happen.
const VENUES = [];
for (const ev of [...events].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))) {
  let v = VENUES.find((x) => x.key === ev.venue);
  if (!v) VENUES.push((v = { key: ev.venue, ...venues[ev.venue], events: [] }));
  v.events.push(ev.title);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export default function Venue() {
  const [active, setActive] = useState(0);
  const toast = useToast();
  const venue = VENUES[active];

  const onCopy = async () => {
    const ok = await copyText(venue.address);
    toast(ok ? 'Address copied' : 'Copy failed — please long-press the address');
  };

  return (
    <section id="venue" aria-labelledby="venue-title" className="relative px-4 py-20 md:py-28">
      <SectionHeading
        id="venue-title"
        eyebrow="Find your way"
        title="Location & Directions"
        subtitle="Tap a venue for its map, directions and address."
      />

      <motion.div {...revealOnce} variants={fadeUp} className="mx-auto mt-10 max-w-6xl">
        {VENUES.length > 1 && (
          <div role="tablist" aria-label="Venues" className="mb-6 flex flex-wrap justify-center gap-2.5">
            {VENUES.map((v, i) => (
              <button
                key={v.key}
                role="tab"
                id={`venue-tab-${v.key}`}
                aria-selected={i === active}
                aria-controls="venue-panel"
                onClick={() => setActive(i)}
                className={`min-h-11 cursor-pointer rounded-full border px-5 py-2.5 font-sans text-[0.8rem] font-medium transition ${
                  i === active
                    ? 'border-maroon bg-maroon text-gold-pale shadow-[0_10px_22px_-14px_rgba(74,16,32,0.9)]'
                    : 'border-gold/50 bg-white/70 text-maroon hover:border-gold-deep'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        <div
          id="venue-panel"
          role="tabpanel"
          aria-labelledby={`venue-tab-${venue.key}`}
          className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] md:gap-7"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={venue.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="card-ornate flex flex-col p-6 sm:p-8"
            >
              <CardCorners className="text-gold/60" size="h-8 w-8" />
              <span className="grid h-12 w-12 place-items-center rounded-full bg-maroon text-gold-light">
                <PinIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-maroon">{venue.name}</h3>
              <p className="mt-2 select-all font-sans text-[0.95rem] leading-relaxed text-maroon-ink/85">{venue.address}</p>
              {venue.landmark && (
                <p className="mt-3 flex items-start gap-2 font-serif text-lg italic text-maroon-ink/80">
                  <SparkleIcon className="mt-1 h-4 w-4 shrink-0 text-gold-deep" />
                  <span>
                    Landmark: <span className="not-italic font-medium text-maroon">{venue.landmark}</span>
                  </span>
                </p>
              )}
              <div className="mt-4 rounded-2xl bg-gold/10 px-4 py-3">
                <p className="eyebrow text-[0.62rem] text-gold-deep">Celebrations here</p>
                <p className="mt-1 font-serif text-lg leading-snug text-maroon">{venue.events.join(' · ')}</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <a href={venue.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">
                  <DirectionsIcon className="h-4 w-4" />
                  Get Directions
                </a>
                <button type="button" onClick={onCopy} className="btn btn-outline flex-1">
                  <CopyIcon className="h-4 w-4" />
                  Copy Address
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative min-h-[320px] overflow-hidden rounded-[1.4rem] bg-parchment shadow-[0_30px_60px_-36px_rgba(58,15,27,0.55)] ring-1 ring-gold/50 md:min-h-[440px]">
            <iframe
              key={venue.key}
              title={`Map of ${venue.name}`}
              src={mapEmbedSrc(venue.mapEmbedQuery || venue.address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[1.4rem] ring-[6px] ring-inset ring-ivory/70" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
