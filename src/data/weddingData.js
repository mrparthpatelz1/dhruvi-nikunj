import couplePhoto from '../assets/couple.jpg';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING_DATA — the single place to edit every word, date, venue and contact
 *  shown on the invitation. Change a value here and the whole site updates.
 *
 *  • Dates use ISO format with India's offset (+05:30), so the countdown is
 *    correct for guests anywhere in the world. Times are shown in IST.
 *  • To swap the couple photo, replace  src/assets/couple.jpg  (portrait 3:4
 *    works best) — or import a different file at the top of this file.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const WEDDING_DATA = {
  blessing: '|| Shri Ganeshaya Namah ||',
  blessingNative: '॥ श्री गणेशाय नमः ॥', // decorative Devanagari line — set to '' to hide

  bride: {
    name: 'Dhruvi',
    relation: 'Daughter of',
    parents: 'Vanitaben & Nileshbhai',
  },
  groom: {
    name: 'Nikunj',
    relation: 'Son of',
    parents: 'Taramatiben & Dharmendrabhai',
  },

  invitationLine:
    'With the divine blessings of Lord Ganesha and the love of our families, we joyfully invite you to celebrate the wedding of',

  wedding: {
    dateTime: '2027-01-29T19:00:00+05:30', // hero date + countdown target
    city: 'Viramgam',
    region: 'Gujarat',
  },
  timeZone: 'Asia/Kolkata',

  couplePhoto: {
    src: couplePhoto,
    alt: 'Dhruvi and Nikunj together in traditional festive attire',
  },

  /**
   * Venues are listed once and referenced by key from each event.
   * mapLink        → opened by every "Get Directions" button (your exact pin).
   * mapEmbedQuery  → what the embedded map searches for. For a pin-perfect
   *                  embed, replace it with coordinates, e.g. '23.1179,72.0457'.
   */
  venues: {
    omBunglows: {
      name: 'Om Bunglows',
      address: '23, Om Bunglows, Opp. Navyug School, Viramgam',
      landmark: 'Opposite Navyug School',
      mapLink: 'https://maps.app.goo.gl/Xs8C9MTtnhNmJYgD8',
      mapEmbedQuery: 'Om Bunglows, Navyug School, Viramgam, Gujarat',
    },
    kankuba: {
      name: 'Kankuba Farmhouse Partyplot',
      address: 'Kankuba Farmhouse Partyplot, Viramgam',
      landmark: '',
      mapLink: 'https://maps.app.goo.gl/zXRhW2MGc5y3vMAb6',
      mapEmbedQuery: 'Kankuba Farmhouse Partyplot, Viramgam, Gujarat',
    },
  },

  /** icon: 'mandap' | 'garba' | 'mameru' | 'pheras'. dressCode/description are optional. */
  events: [
    {
      id: 'mandap-muhurat',
      title: 'Mandap Muhurat',
      dateTime: '2027-01-28T14:45:00+05:30',
      venue: 'omBunglows',
      icon: 'mandap',
      description: 'An auspicious Ganesh puja blesses the mandap as the wedding festivities begin.',
      dressCode: 'Traditional Indian',
    },
    {
      id: 'garba',
      title: 'Garba',
      dateTime: '2027-01-28T21:00:00+05:30',
      venue: 'kankuba',
      icon: 'garba',
      description: 'A joyous night of dhol, dandiya and swirling garba under the stars.',
      dressCode: 'Chaniya Choli & Kediyu',
    },
    {
      id: 'mameru',
      title: 'Mameru',
      dateTime: '2027-01-29T10:00:00+05:30',
      venue: 'kankuba',
      icon: 'mameru',
      description: "The bride's maternal family arrives with gifts, sweets and heartfelt blessings.",
      dressCode: 'Traditional Indian',
    },
    {
      id: 'pheras',
      title: 'Wedding Ceremony (Pheras)',
      dateTime: '2027-01-29T17:15:00+05:30',
      venue: 'kankuba',
      icon: 'pheras',
      description: 'Dhruvi & Nikunj take the seven sacred vows around the holy fire.',
      dressCode: 'Royal Traditional',
    },
  ],

  /** Shown with one-tap Call and WhatsApp buttons. Add a name to label a number. */
  countryCode: '91',
  contacts: [
    { name: '', phone: '9898207616' },
    { name: '', phone: '9898765376' },
    { name: '', phone: '9909563850' },
  ],

  compliments: {
    heading: 'With Best Compliments From',
    families: [
      { names: 'Vanitaben & Nileshbhai', note: "Bride's Parents" },
      { names: 'Taramatiben & Dharmendrabhai', note: "Groom's Parents" },
    ],
    closingLine: 'Your gracious presence and blessings will make our celebration complete.',
  },

  rsvp: {
    whatsappNumber: '9898207616', // RSVPs open WhatsApp with a ready-to-send message to this number
    respondBy: '', // optional, e.g. '2027-01-15' — shown as "Kindly respond by …"
    endpoint: '', // optional form backend URL (Formspree, Google Apps Script…) — receives a JSON POST
    maxGuests: 10,
  },

  music: {
    src: '', // optional: an instrumental mp3 you have rights to (e.g. put it in /public and write 'music.mp3'). Blank = built-in generated tanpura & santoor ambience.
    autoplayOnOpen: false, // true = music starts when the guest taps the seal
  },
};
