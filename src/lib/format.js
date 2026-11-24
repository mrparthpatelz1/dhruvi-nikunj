import { WEDDING_DATA } from '../data/weddingData';

const TZ = WEDDING_DATA.timeZone;

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const timeFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

/** { weekday, day, month, year } in the wedding's time zone (assembled from parts so ICU quirks can't change punctuation). */
export function dateParts(iso) {
  const parts = {};
  for (const p of dateFmt.formatToParts(new Date(iso))) parts[p.type] = p.value;
  return { weekday: parts.weekday, day: parts.day, month: parts.month, year: parts.year };
}

/** "Thursday, 28 January 2027" */
export function formatDate(iso) {
  const p = dateParts(iso);
  return `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
}

const numericFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' });

/** "29 · 01 · 2027" */
export function formatNumericDate(iso, sep = ' · ') {
  const parts = {};
  for (const p of numericFmt.formatToParts(new Date(iso))) parts[p.type] = p.value;
  return [parts.day, parts.month, parts.year].join(sep);
}

/** "2:45 PM" */
export function formatTime(iso) {
  return timeFmt.format(new Date(iso)).replace(/ /g, ' ');
}

/** Stable key for grouping events by calendar day in the wedding's time zone. */
export function dayKey(iso) {
  const p = dateParts(iso);
  return `${p.year}-${p.month}-${p.day}`;
}

const digits = (phone) => String(phone).replace(/\D/g, '');

/** Full international digits, e.g. "919898207616". */
export function intlDigits(phone) {
  const d = digits(phone);
  return d.length === 10 ? `${WEDDING_DATA.countryCode}${d}` : d;
}

/** "+91 98982 07616" */
export function formatPhone(phone) {
  const d = digits(phone);
  if (d.length === 10) return `+${WEDDING_DATA.countryCode} ${d.slice(0, 5)} ${d.slice(5)}`;
  return `+${d}`;
}

export const telHref = (phone) => `tel:+${intlDigits(phone)}`;

export const whatsappHref = (phone, text = '') =>
  `https://wa.me/${intlDigits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mapEmbedSrc = (query) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
