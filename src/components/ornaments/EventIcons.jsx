/** Custom ceremony icons (64×64, currentColor). */
function Icon({ className, children }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const Mandap = ({ className }) => (
  <Icon className={className}>
    <path d="M32 4.5v3.5" />
    <path d="M28.6 13.5c0-2.4 1.5-4.2 3.4-4.2s3.4 1.8 3.4 4.2z" fill="currentColor" stroke="none" />
    <path d="M12 27c2.4-8 10-13 20-13.5 10 .5 17.6 5.5 20 13.5" />
    <path d="M8 27h48" />
    <path d="M9 27c1.6 3 3.4 3 5 0 1.6 3 3.4 3 5 0 1.6 3 3.4 3 5 0 1.6 3 3.4 3 5 0 1.6 3 3.4 3 5 0 1.6 3 3.4 3 5 0 1.6 3 3.4 3 5 0 1.6 3 3.4 3 5 0 1.6 3 3.4 3 5 0" strokeWidth="1.4" />
    <path d="M15 31v20M49 31v20M25 31.5v19.5M39 31.5v19.5" />
    <path d="M15 35q5 5.5 10 0q7 6 14 0q5 5.5 10 0" strokeWidth="1.6" />
    <circle cx="20" cy="38.6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="32" cy="39.6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="44" cy="38.6" r="1.3" fill="currentColor" stroke="none" />
    <path d="M8 51h48M11.5 56h41" />
  </Icon>
);

const Garba = ({ className }) => (
  <Icon className={className}>
    <path d="M32 4.5c-3.4 3.8-4 7-1.8 10.2h3.6C36 11.5 35.4 8.3 32 4.5z" fill="currentColor" stroke="none" />
    <path d="M25.5 16.5h13" />
    <path d="M26.4 16.5c0 2.8 2.4 4.4 5.6 4.4s5.6-1.6 5.6-4.4" />
    <path d="M26 24.5h12l-1.4 4h-9.2z" />
    <path d="M27.4 28.5C17.6 31.4 13.6 38.4 15.2 45.6 16.8 53 23.8 57 32 57s15.2-4 16.8-11.4c1.6-7.2-2.4-14.2-12.2-17.1" />
    <path d="M16.2 39.6h31.6" strokeWidth="1.2" opacity="0.6" />
    {[
      [24, 35.6],
      [32, 34.4],
      [40, 35.6],
      [21, 45],
      [28, 44.2],
      [36, 44.2],
      [43, 45],
      [25.4, 51.4],
      [32, 52.4],
      [38.6, 51.4],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.45" fill="currentColor" stroke="none" />
    ))}
    <path d="M6 30l8 6M58 30l-8 6" strokeWidth="2.6" />
    <path d="M5 28.6l2.2-1.6M59 28.6L56.8 27" strokeWidth="1.6" />
  </Icon>
);

const Mameru = ({ className }) => (
  <Icon className={className}>
    <rect x="12" y="29" width="40" height="25" rx="2" />
    <rect x="9" y="21.5" width="46" height="8" rx="1.6" />
    <path d="M32 21.5V54" />
    <path d="M32 21.5c-3.6-8-12.6-10.2-13.8-5.4-.9 3.8 6.6 5.4 13.8 5.4z" />
    <path d="M32 21.5c3.6-8 12.6-10.2 13.8-5.4.9 3.8-6.6 5.4-13.8 5.4z" />
    <path d="M20 37.5l3 3-3 3-3-3zM44 37.5l3 3-3 3-3-3z" />
    <path d="M12 47h40" strokeWidth="1.2" opacity="0.6" />
    <circle cx="20" cy="50.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="44" cy="50.5" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

const Pheras = ({ className }) => (
  <Icon className={className}>
    <path d="M32 6c-6.6 7.2-9.6 12.6-7.4 18.6 1.1 3 3.8 5 7.4 5s6.3-2 7.4-5c2.2-6-.8-11.4-7.4-18.6z" />
    <path d="M32 16.5c-2.8 3.4-3.8 6-2.8 8.6.6 1.5 1.5 2.2 2.8 2.2s2.2-.7 2.8-2.2c1-2.6 0-5.2-2.8-8.6z" fill="currentColor" stroke="none" />
    <path d="M21.6 19c-3.2 4-3.8 7.2-2.2 10.4M42.4 19c3.2 4 3.8 7.2 2.2 10.4" />
    <circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="48" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="40" cy="5" r="1" fill="currentColor" stroke="none" />
    <path d="M14 34h36l-3 6H17z" />
    <path d="M11 40h42v6H11z" />
    <path d="M8 46h48v8H8z" />
    <path d="M19 50h5M29.5 50h5M40 50h5" />
  </Icon>
);

const ICONS = { mandap: Mandap, garba: Garba, mameru: Mameru, pheras: Pheras };

export function EventIcon({ name, className }) {
  const Cmp = ICONS[name] ?? Mandap;
  return <Cmp className={className} />;
}
