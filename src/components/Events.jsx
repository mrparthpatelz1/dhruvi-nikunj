import { motion } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';
import { dayKey, formatDate, formatTime } from '../lib/format';
import { EASE_OUT } from '../lib/motion';
import { EventIcon } from './ornaments/EventIcons';
import { CalendarIcon, ClockIcon, DirectionsIcon, DressIcon, PinIcon } from './ornaments/Icons';
import { Paisley } from './ornaments/Ornaments';
import { Peacock } from './ornaments/Peacock';
import SectionHeading from './SectionHeading';

const { events, venues } = WEDDING_DATA;
const ORDINALS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];

/** Group events by calendar day (in the wedding's time zone), keeping order. */
function byDay(list) {
  const days = [];
  for (const ev of [...list].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))) {
    const key = dayKey(ev.dateTime);
    const day = days.at(-1);
    if (day?.key === key) day.events.push(ev);
    else days.push({ key, label: formatDate(ev.dateTime), events: [ev] });
  }
  return days;
}

function Detail({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep">
        <Icon className="h-4 w-4" />
      </span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}

function EventCard({ ev, index, first }) {
  const venue = venues[ev.venue];
  const right = index % 2 === 1;
  // "Kankuba Farmhouse Partyplot, Viramgam" → show the name once, then "Viramgam"
  const addressRest = venue.address.startsWith(venue.name)
    ? venue.address.slice(venue.name.length).replace(/^[\s,]+/, '')
    : venue.address;
  return (
    <motion.li
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.85, ease: EASE_OUT }}
      className={`relative grid grid-cols-[2.75rem_1fr] gap-3 sm:grid-cols-[3.5rem_1fr] sm:gap-4 lg:grid-cols-[1fr_5rem_1fr] lg:gap-8 ${first ? '' : 'lg:-mt-40'}`}
    >
      {/* medallion on the timeline */}
      <div className="col-start-1 row-start-1 flex justify-center lg:col-start-2">
        <div className="relative mt-3 grid h-11 w-11 place-items-center rounded-full bg-[conic-gradient(from_200deg,#f6e3a1,#b8901f,#f6e3a1,#b8901f,#f6e3a1)] p-[3px] shadow-[0_0_0_6px_rgba(107,29,47,1),0_0_24px_4px_rgba(212,175,55,0.35)] sm:h-14 sm:w-14 lg:h-16 lg:w-16">
          <div className="grid h-full w-full place-items-center rounded-full bg-maroon-deep text-gold-light">
            <EventIcon name={ev.icon} className="h-6 w-6 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
          </div>
        </div>
      </div>

      <article
        className={`card-ornate col-start-2 row-start-1 overflow-hidden p-[1.15rem] pb-6 text-maroon-ink sm:p-7 ${right ? 'lg:col-start-3' : 'lg:col-start-1'}`}
      >
        <Paisley className="pointer-events-none absolute -right-1 -top-1 h-14 w-14 rotate-90 text-gold/35" />
        <p className="eyebrow text-gold-deep">{formatTime(ev.dateTime)}</p>
        <h3 className="mt-1.5 pr-8 font-display text-2xl font-bold leading-tight text-maroon md:text-[1.7rem]">{ev.title}</h3>
        {ev.description && <p className="mt-2 font-serif text-lg italic leading-snug text-maroon-ink/80">{ev.description}</p>}
        <ul className="mt-4 space-y-2.5 font-sans text-[0.92rem] leading-snug text-maroon-ink/90">
          <Detail icon={CalendarIcon}>{formatDate(ev.dateTime)}</Detail>
          <Detail icon={ClockIcon}>{formatTime(ev.dateTime)} onwards</Detail>
          {ev.dressCode && (
            <Detail icon={DressIcon}>
              <span className="text-maroon-ink/60">Dress code · </span>
              {ev.dressCode}
            </Detail>
          )}
          <Detail icon={PinIcon}>
            <span className="font-medium text-maroon">{venue.name}</span>
            {addressRest && <span className="block text-maroon-ink/70">{addressRest}</span>}
          </Detail>
        </ul>
        <a
          href={venue.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-5 w-full sm:w-auto"
          aria-label={`Get directions to ${venue.name} for ${ev.title}`}
        >
          <DirectionsIcon className="h-4 w-4" />
          Get Directions
        </a>
      </article>
    </motion.li>
  );
}

export default function Events() {
  const days = byDay(events);
  let running = 0;

  return (
    <section id="events" aria-labelledby="events-title" className="relative isolate overflow-hidden bg-maroon text-ivory">
      <div aria-hidden="true" className="bg-jaali absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.2),transparent_60%),radial-gradient(ellipse_at_50%_100%,rgba(30,4,12,0.5),transparent_60%)]" />
      <div aria-hidden="true" className="h-2 bg-[linear-gradient(90deg,#8f6b17,#f3dc94,#d4af37,#f3dc94,#8f6b17)]" />

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-16 md:pb-32 md:pt-20">
        {/* royal peacocks framing the heading */}
        <div className="flex flex-wrap items-end justify-center gap-x-2 md:flex-nowrap md:gap-x-6">
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="order-1 w-[44vw] max-w-[230px] md:w-60 md:max-w-none lg:w-72"
          >
            <Peacock />
          </motion.div>
          <SectionHeading
            id="events-title"
            tone="dark"
            eyebrow="Join us for"
            title="Wedding Events"
            subtitle="Two days of rituals, music and blessings in Viramgam."
            className="order-3 mt-4 w-full md:order-2 md:mt-0 md:w-auto md:shrink md:pb-6"
          />
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="order-2 w-[44vw] max-w-[230px] md:order-3 md:w-60 md:max-w-none lg:w-72"
          >
            <Peacock mirrored />
          </motion.div>
        </div>

        <div className="relative mt-14 md:mt-20">
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-[1.375rem] top-6 w-px sm:left-[1.75rem] bg-[linear-gradient(180deg,transparent,rgba(212,175,55,0.7)_8%,rgba(212,175,55,0.7)_92%,transparent)] lg:left-1/2"
          />
          <ol className="relative space-y-10 lg:space-y-14">
            {days.map((day, d) => (
              <li key={day.key}>
                <div className="relative mb-7 flex lg:justify-center">
                  <span className="relative z-10 rounded-full border border-gold/60 bg-maroon-deep px-4 py-2 text-center font-sans text-[0.68rem] font-medium uppercase tracking-[0.22em] text-gold-light shadow-[0_0_0_6px_var(--color-maroon)] sm:text-xs">
                    Day {ORDINALS[d] ?? d + 1} · {day.label}
                  </span>
                </div>
                <ol className="space-y-8 lg:space-y-12">
                  {day.events.map((ev, j) => (
                    <EventCard key={ev.id} ev={ev} index={running++} first={j === 0} />
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
