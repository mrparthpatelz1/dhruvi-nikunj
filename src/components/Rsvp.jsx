import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useAmbient } from '../context/AmbientContext';
import { WEDDING_DATA } from '../data/weddingData';
import { formatDate, whatsappHref } from '../lib/format';
import { EASE_OUT, fadeUp, revealOnce } from '../lib/motion';
import { CheckIcon, EditIcon, HeartIcon, MinusIcon, PlusIcon, WhatsAppIcon } from './ornaments/Icons';
import { CardCorners } from './ornaments/Ornaments';
import SectionHeading from './SectionHeading';

const { events, rsvp, bride, groom } = WEDDING_DATA;
const STORAGE_KEY = `rsvp:${bride.name}-${groom.name}:v1`.toLowerCase();
const titleOf = (id) => events.find((e) => e.id === id)?.title;

const blankForm = () => ({ name: '', attending: true, guests: 1, events: events.map((e) => e.id), message: '' });

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}
function save(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* private mode — the confirmation still works for this visit */
  }
}

function whatsappMessage(r) {
  const lines = [
    `🙏 RSVP — ${bride.name} & ${groom.name}'s Wedding`,
    `Name: ${r.name}`,
    `Response: ${r.attending ? 'Joyfully accepts ✨' : 'Regretfully declines'}`,
  ];
  if (r.attending) {
    lines.push(`Guests: ${r.guests}`);
    lines.push(`Attending: ${r.events.map(titleOf).filter(Boolean).join(', ')}`);
  }
  if (r.message) lines.push(`Blessing: “${r.message}”`);
  return lines.join('\n');
}

const label = 'mb-2 block font-sans text-[0.7rem] font-medium uppercase tracking-[0.22em] text-maroon/80';

function Choice({ type, name, checked, onChange, children }) {
  return (
    <label className="group relative block cursor-pointer">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`flex min-h-12 items-center gap-2.5 rounded-2xl border px-4 py-3 font-sans text-[0.9rem] transition peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${
          checked
            ? 'border-maroon bg-maroon text-gold-pale shadow-[0_10px_22px_-14px_rgba(74,16,32,0.9)]'
            : 'border-gold/45 bg-white/80 text-maroon-ink hover:border-gold-deep'
        }`}
      >
        <span
          aria-hidden="true"
          className={`grid h-5 w-5 shrink-0 place-items-center border ${type === 'radio' ? 'rounded-full' : 'rounded-md'} ${
            checked ? 'border-gold bg-gold text-maroon-ink' : 'border-gold-deep/50'
          }`}
        >
          {checked && <CheckIcon className="h-3 w-3" />}
        </span>
        {children}
      </span>
    </label>
  );
}

export default function Rsvp() {
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(loadSaved);
  const [sending, setSending] = useState(false);
  const cardRef = useRef(null);
  const submitRef = useRef(null);
  const nameRef = useRef(null);
  const { burst } = useAmbient();

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleEvent = (id) =>
    update({ events: form.events.includes(id) ? form.events.filter((x) => x !== id) : [...form.events, id] });

  const keepInView = () =>
    requestAnimationFrame(() => {
      const top = cardRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

  async function onSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please share your name';
    if (form.attending && form.events.length === 0) errs.events = 'Please choose at least one celebration';
    setErrors(errs);
    if (errs.name) return nameRef.current?.focus();
    if (errs.events) return;

    const data = {
      ...form,
      name: form.name.trim(),
      message: form.message.trim(),
      events: form.attending ? events.map((ev) => ev.id).filter((id) => form.events.includes(id)) : [],
      submittedAt: new Date().toISOString(),
    };

    if (rsvp.endpoint) {
      setSending(true);
      try {
        await fetch(rsvp.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, events: data.events.map(titleOf) }),
        });
      } catch {
        /* WhatsApp below is always available as a fallback */
      }
      setSending(false);
    }

    save(data);
    const r = submitRef.current?.getBoundingClientRect();
    if (r) burst(r.left + r.width / 2, r.top + r.height / 2, { petals: 24, sparks: 36, power: 0.9 });
    setSubmitted(data);
    keepInView();
  }

  const edit = () => {
    setForm({ ...blankForm(), ...submitted, events: submitted.attending ? submitted.events : events.map((e) => e.id) });
    setSubmitted(null);
    keepInView();
  };

  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="relative overflow-hidden px-4 py-20 md:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(249,198,208,0.32),transparent_65%)]" />
      <SectionHeading
        id="rsvp-title"
        eyebrow="Kindly respond"
        title="RSVP & Blessings"
        subtitle="Your presence is the greatest gift — let us know if you'll be celebrating with us."
      />

      <motion.div ref={cardRef} {...revealOnce} variants={fadeUp} className="mx-auto mt-10 max-w-2xl scroll-mt-6">
        <AnimatePresence mode="wait" initial={false}>
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="card-ornate px-6 py-10 text-center sm:px-12"
              role="status"
            >
              <CardCorners />
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[conic-gradient(from_200deg,#f6e3a1,#b8901f,#f6e3a1,#b8901f,#f6e3a1)] p-[3px]"
              >
                <span className="grid h-full w-full place-items-center rounded-full bg-maroon text-gold-light">
                  {submitted.attending ? (
                    <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true">
                      <motion.path
                        d="M5 12.5l4.2 4.2L19 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      />
                    </svg>
                  ) : (
                    <HeartIcon className="h-8 w-8" />
                  )}
                </span>
              </motion.div>

              <p className="mt-5 font-script text-5xl leading-tight text-maroon">
                Thank you, {submitted.name.split(' ')[0]}!
              </p>
              <p className="mx-auto mt-2 max-w-md font-serif text-xl italic leading-snug text-maroon-ink/80">
                {submitted.attending
                  ? 'We can’t wait to celebrate with you — your presence will make our day complete.'
                  : 'You’ll be dearly missed. Thank you for your love and blessings.'}
              </p>

              <dl className="mx-auto mt-6 grid max-w-md gap-2 rounded-2xl bg-gold/10 px-5 py-4 text-left font-sans text-sm text-maroon-ink/85">
                {submitted.attending && (
                  <>
                    <div className="flex justify-between gap-4">
                      <dt className="text-maroon-ink/60">Guests</dt>
                      <dd className="font-medium">{submitted.guests}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-maroon-ink/60">Attending</dt>
                      <dd className="text-right font-medium">{submitted.events.map(titleOf).join(', ')}</dd>
                    </div>
                  </>
                )}
                {submitted.message && (
                  <div>
                    <dt className="text-maroon-ink/60">Your blessing</dt>
                    <dd className="mt-1 font-serif text-lg italic">“{submitted.message}”</dd>
                  </div>
                )}
                {!submitted.attending && !submitted.message && <dd className="text-center">Response: regretfully declines</dd>}
              </dl>

              <a
                href={whatsappHref(rsvp.whatsappNumber, whatsappMessage(submitted))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-7"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Send RSVP on WhatsApp
              </a>
              <p className="mt-2 font-sans text-xs text-maroon-ink/60">
                {rsvp.endpoint
                  ? 'Your reply has been sent — you can also share it on WhatsApp.'
                  : 'Opens WhatsApp with your reply ready to send to the family.'}
              </p>
              <button
                type="button"
                onClick={edit}
                className="mt-5 inline-flex min-h-11 cursor-pointer items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-maroon/70 underline decoration-gold/60 underline-offset-4 hover:text-maroon"
              >
                <EditIcon className="h-4 w-4" />
                Edit response
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              noValidate
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="card-ornate px-5 py-8 sm:px-10 sm:py-10"
            >
              <CardCorners />
              <div className="relative grid gap-7">
                <div>
                  <label htmlFor="rsvp-name" className={label}>
                    Guest name
                  </label>
                  <input
                    ref={nameRef}
                    id="rsvp-name"
                    className="field"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="rsvp-name-error" className="mt-1.5 font-sans text-xs text-maroon">
                      {errors.name}
                    </p>
                  )}
                </div>

                <fieldset>
                  <legend className={label}>Will you join us?</legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Choice type="radio" name="attending" checked={form.attending} onChange={() => update({ attending: true })}>
                      Joyfully accept
                    </Choice>
                    <Choice type="radio" name="attending" checked={!form.attending} onChange={() => update({ attending: false })}>
                      Regretfully decline
                    </Choice>
                  </div>
                </fieldset>

                <AnimatePresence initial={false}>
                  {form.attending && (
                    <motion.div
                      key="attending"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      className="-m-1 overflow-hidden p-1"
                    >
                      <div className="grid gap-7">
                        <div role="group" aria-labelledby="guests-label">
                          <span id="guests-label" className={label}>
                            Number of guests <span className="normal-case tracking-normal text-maroon-ink/50">(including you)</span>
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => update({ guests: Math.max(1, form.guests - 1) })}
                              disabled={form.guests <= 1}
                              aria-label="Fewer guests"
                              className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold/60 bg-white text-maroon transition hover:border-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <MinusIcon className="h-5 w-5" />
                            </button>
                            <output aria-live="polite" className="min-w-12 text-center font-cinzel text-3xl font-semibold text-maroon">
                              {form.guests}
                            </output>
                            <button
                              type="button"
                              onClick={() => update({ guests: Math.min(rsvp.maxGuests, form.guests + 1) })}
                              disabled={form.guests >= rsvp.maxGuests}
                              aria-label="More guests"
                              className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold/60 bg-white text-maroon transition hover:border-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <PlusIcon className="h-5 w-5" />
                            </button>
                            <span className="ml-1 font-serif text-lg italic text-maroon-ink/70">
                              {form.guests === 1 ? 'guest' : 'guests'}
                            </span>
                          </div>
                        </div>

                        <fieldset aria-describedby={errors.events ? 'rsvp-events-error' : undefined}>
                          <legend className={label}>Attending events</legend>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {events.map((ev) => (
                              <Choice key={ev.id} type="checkbox" checked={form.events.includes(ev.id)} onChange={() => toggleEvent(ev.id)}>
                                <span className="leading-tight">{ev.title}</span>
                              </Choice>
                            ))}
                          </div>
                          {errors.events && (
                            <p id="rsvp-events-error" className="mt-1.5 font-sans text-xs text-maroon">
                              {errors.events}
                            </p>
                          )}
                        </fieldset>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label htmlFor="rsvp-message" className={label}>
                    A blessing for the couple <span className="normal-case tracking-normal text-maroon-ink/50">(optional)</span>
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={4}
                    maxLength={600}
                    className="field min-h-28 resize-y leading-relaxed"
                    placeholder={`Share your love and wishes for ${bride.name} & ${groom.name}…`}
                    value={form.message}
                    onChange={(e) => update({ message: e.target.value })}
                  />
                </div>

                <div>
                  <button ref={submitRef} type="submit" disabled={sending} className="btn btn-primary w-full text-[0.8rem] disabled:opacity-70">
                    <HeartIcon className="h-4 w-4" />
                    {sending ? 'Sending…' : 'Send RSVP'}
                  </button>
                  {rsvp.respondBy && (
                    <p className="mt-3 text-center font-serif text-lg italic text-maroon-ink/70">
                      Kindly respond by {formatDate(`${rsvp.respondBy}T12:00:00+05:30`)}
                    </p>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
