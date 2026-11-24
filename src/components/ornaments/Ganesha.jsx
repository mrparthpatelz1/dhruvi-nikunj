import { motion, useReducedMotion } from 'framer-motion';

/**
 * Hand-drawn line-art Ganesha (120×120). Each stroke can "draw itself" in
 * sequence; the soft fills and jewel dots bloom in once the outline is done.
 */
const STROKES = [
  // mukut (crown)
  'M45 40C45 30 51 21 60 11C69 21 75 30 75 40',
  'M51.5 39.5C52.5 33 56 28 60 24C64 28 67.5 33 68.5 39.5',
  'M41 40Q60 44.5 79 40',
  'M42.5 45Q60 49.5 77.5 45',
  // ears
  'M43 49C33 41 19 43 15 54C11 66 19 78 32 79C38 79.5 42 76 44.5 72',
  'M77 49C87 41 101 43 105 54C109 66 101 78 88 79C82 79.5 78 76 75.5 72',
  'M39.5 54C33 50 25.5 52 23.5 58.5C21.5 65 26 71 33 71.5',
  'M80.5 54C87 50 94.5 52 96.5 58.5C98.5 65 94 71 87 71.5',
  // temples, cheeks & jowls meeting the tusks
  'M43 46C40.5 52 40.5 60 44.5 67C46.5 69.4 49.4 69.2 52 67',
  'M77 46C79.5 52 79.5 60 75.5 67C73.5 69.4 70.6 69.2 68 67',
  // eyes
  'M48.5 57C50.5 54.6 54 54.6 56 57C54 58.6 50.5 58.6 48.5 57Z',
  'M64 57C66 54.6 69.5 54.6 71.5 57C69.5 58.6 66 58.6 64 57Z',
  // trunk, curling to his left
  'M55 61C53 71 52.5 81 55.5 89C58.5 97 68 99.5 73.5 95C78 91.5 76.5 85 71.5 84.5C68.5 84.2 67 87 68.8 89',
  'M65 61C65 69 64.6 76 66.2 82C67 84.8 68.8 85.6 70.6 85',
  // tusks
  'M52 67C49.5 69 48.6 71.6 49.3 74.5',
  'M68 67C71.5 70 72.6 74 71 78',
];

const FOLDS = ['M55.8 67.6Q60.2 69 64.9 67.6', 'M55.2 73.6Q60 75 64.9 73.6', 'M55.8 79.6Q60.6 81 65.7 79.6'];

const FILLS = [
  'M45 40C45 30 51 21 60 11C69 21 75 30 75 40Q60 44.5 45 40Z',
  'M42.5 45Q60 49.5 77.5 45C79.5 52 79.5 60 75.5 67C73.5 69.4 70.6 69.2 68 67L65 61H55L52 67C49.4 69.2 46.5 69.4 44.5 67C40.5 60 40.5 52 42.5 45Z',
  'M43 49C33 41 19 43 15 54C11 66 19 78 32 79C38 79.5 42 76 44.5 72C41 64 40.5 55 43 49Z',
  'M77 49C87 41 101 43 105 54C109 66 101 78 88 79C82 79.5 78 76 75.5 72C79 64 79.5 55 77 49Z',
  'M55 61C53 71 52.5 81 55.5 89C58.5 97 68 99.5 73.5 95C78 91.5 76.5 85 71.5 84.5C69 84.5 67.3 84 66.2 82C64.6 76 65 69 65 61Z',
];

export function Ganesha({
  className,
  draw = true,
  delay = 0,
  duration = 1.8,
  strokeWidth = 2.1,
  color = 'currentColor',
  fillOpacity = 0.16,
  title,
  ...rest
}) {
  const reduce = useReducedMotion();
  const animate = draw && !reduce;
  const step = duration / STROKES.length;
  const bloom = delay + duration * 0.85;

  const from = (props) => (animate ? props : false);

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      <motion.g
        fill={color}
        initial={from({ opacity: 0 })}
        animate={{ opacity: fillOpacity }}
        transition={{ delay: bloom, duration: 1 }}
      >
        {FILLS.map((d) => (
          <path key={d} d={d} />
        ))}
      </motion.g>

      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {STROKES.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            initial={from({ pathLength: 0, opacity: 0 })}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: delay + i * step, duration: step * 3, ease: 'easeInOut' },
              opacity: { delay: delay + i * step, duration: 0.15 },
            }}
          />
        ))}
        <motion.g
          strokeWidth={strokeWidth * 0.6}
          initial={from({ opacity: 0 })}
          animate={{ opacity: 0.8 }}
          transition={{ delay: bloom, duration: 0.8 }}
        >
          {FOLDS.map((d) => (
            <path key={d} d={d} />
          ))}
        </motion.g>
      </g>

      <motion.g
        fill={color}
        initial={from({ opacity: 0 })}
        animate={{ opacity: 1 }}
        transition={{ delay: bloom + 0.15, duration: 0.7 }}
      >
        {/* tilak, crown jewel, finial, pupils, crown-band pearls */}
        <path d="M60 46.5C58.2 49.6 58.2 52.2 60 54C61.8 52.2 61.8 49.6 60 46.5Z" />
        <circle cx="60" cy="32.5" r="2.5" />
        <circle cx="60" cy="7.5" r="2.4" />
        <circle cx="52.3" cy="56.8" r="1.15" />
        <circle cx="67.7" cy="56.8" r="1.15" />
        {[48, 54, 66, 72].map((x) => (
          <circle key={x} cx={x} cy={x === 48 || x === 72 ? 42.6 : 43.7} r="1.05" />
        ))}
      </motion.g>
    </svg>
  );
}
