/** Small line icons (24×24, currentColor). */
function Svg({ className = 'h-5 w-5', children, strokeWidth = 1.7, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const CheckIcon = (p) => (
  <Svg strokeWidth={2.4} {...p}>
    <path d="M5 12.5l4.2 4.2L19 7" />
  </Svg>
);
export const CalendarIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
  </Svg>
);
export const ClockIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const PinIcon = (p) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </Svg>
);
export const DressIcon = (p) => (
  <Svg {...p}>
    <path d="M9.2 3l1 3.4M14.8 3l-1 3.4" />
    <path d="M10.2 6.4h3.6L15 10l4 10H5l4-10z" />
    <path d="M7.6 14.2c1.5.8 3 .8 4.4 0 1.4.8 2.9.8 4.4 0" />
  </Svg>
);
export const DirectionsIcon = (p) => (
  <Svg {...p}>
    <path d="M12 2.8l9.2 9.2-9.2 9.2L2.8 12z" />
    <path d="M9.4 14.2v-2.4a1.6 1.6 0 011.6-1.6h4.2M13.2 8.2l2 2-2 2" />
  </Svg>
);
export const CopyIcon = (p) => (
  <Svg {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
    <path d="M15.5 8.5V6.2a1.7 1.7 0 00-1.7-1.7H6.2a1.7 1.7 0 00-1.7 1.7v7.6a1.7 1.7 0 001.7 1.7h2.3" />
  </Svg>
);
export const PhoneIcon = (p) => (
  <Svg {...p}>
    <path d="M5.6 3.8h2.9l1.5 4-2 1.3a11 11 0 005 5l1.3-2 4 1.5v2.9a2 2 0 01-2.2 2A16.4 16.4 0 013.6 6a2 2 0 012-2.2z" />
  </Svg>
);
export const WhatsAppIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20l1.2-4.2A8.3 8.3 0 1112 20.3a8.3 8.3 0 01-3.9-1z" />
    <path d="M9.2 8.4c.2-.4.5-.5.8-.5h.4c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6a6.4 6.4 0 002.8 2.7l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.2.1.4.3.4.5v.5c0 .3-.2.7-.6.9-.6.3-1.6.4-3.2-.4a8.4 8.4 0 01-3.6-3.6c-.8-1.5-.6-2.6-.4-3.3z" />
  </Svg>
);
export const MusicIcon = (p) => (
  <Svg {...p}>
    <path d="M9 18V6l10-2v12" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="16.5" cy="16" r="2.5" />
  </Svg>
);
export const MusicOffIcon = (p) => (
  <Svg {...p}>
    <path d="M9 12.5V6l10-2v9" />
    <circle cx="6.5" cy="18" r="2.5" />
    <path d="M3.5 3.5l17 17" />
  </Svg>
);
export const SparkleIcon = (p) => (
  <Svg {...p}>
    <path d="M11 3l1.7 5.1L18 10l-5.3 1.9L11 17l-1.7-5.1L4 10l5.3-1.9z" />
    <path d="M18.5 15.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z" />
  </Svg>
);
export const PauseIcon = (p) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M9 6.5v11M15 6.5v11" />
  </Svg>
);
export const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
export const HeartIcon = (p) => (
  <Svg {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />
  </Svg>
);
export const MinusIcon = (p) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M6 12h12" />
  </Svg>
);
export const PlusIcon = (p) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M12 6v12M6 12h12" />
  </Svg>
);
export const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M15.5 5.6a3 3 0 010 5.8M17.5 14.3c1.6.6 2.7 2.2 3 4.7" />
  </Svg>
);
export const ArrowUpRightIcon = (p) => (
  <Svg {...p}>
    <path d="M7 17L17 7M8.5 7H17v8.5" />
  </Svg>
);
export const EditIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16z" />
  </Svg>
);
export const HandIcon = (p) => (
  <Svg {...p}>
    <path d="M9 12V5.2a1.6 1.6 0 013.2 0V11" />
    <path d="M12.2 10.4V8.6a1.6 1.6 0 013.2 0V11" />
    <path d="M15.4 10a1.6 1.6 0 013.2 0v4.6c0 3.6-2.6 6.4-6.2 6.4h-.9c-2.3 0-3.7-.9-5-2.7l-2.6-3.8a1.7 1.7 0 012.6-2.1L9 15" />
  </Svg>
);
