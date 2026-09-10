/* ------------------------------------------------------------------ */
/*  Stroke icons on a 24px grid.                                       */
/*  Inline SVG so they inherit currentColor and need no asset.         */
/* ------------------------------------------------------------------ */

type Props = { className?: string; size?: number };

function svg(children: React.ReactNode, { className, size = 20 }: Props) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {children}
    </svg>
  );
}

export const IconDeed = (p: Props) =>
  svg(
    <>
      <path d="M6 3h9l4 4v14H6V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h7M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>,
    p
  );

export const IconBuy = (p: Props) =>
  svg(
    <>
      <path d="M3 11 12 4l9 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10v10h13V10" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>,
    p
  );

export const IconSell = (p: Props) =>
  svg(
    <>
      <path d="M4 20V8l8-4 8 4v12" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 20v-6h-4v6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>,
    p
  );

export const IconVerify = (p: Props) =>
  svg(
    <>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m15.5 15.5 4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m8 10.5 2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    p
  );

export const IconDoc = (p: Props) =>
  svg(
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>,
    p
  );

export const IconAdvisory = (p: Props) =>
  svg(
    <>
      <path d="M12 3v18M5 8l7-5 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>,
    p
  );

export const IconScreen = (p: Props) =>
  svg(
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>,
    p
  );

export const IconPerson = (p: Props) =>
  svg(
    <>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 20c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16.5 11.5h4M18.5 9.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>,
    p
  );

export const IconCheck = (p: Props) =>
  svg(
    <>
      <circle cx="12" cy="12" r="9.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m8 12.3 2.85 2.85L16 9.15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    p
  );

export const IconAlert = (p: Props) =>
  svg(
    <>
      <circle cx="12" cy="12" r="9.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5v5.4M12 16.5h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </>,
    p
  );

export const IconArrow = (p: Props) =>
  svg(
    <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
    p
  );

export const IconSearch = (p: Props) =>
  svg(
    <>
      <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16.5 16.5 4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>,
    p
  );

export const IconMap = (p: Props) =>
  svg(
    <>
      <path d="m2 6 7-3 6 3 7-3v15l-7 3-6-3-7 3V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 3v15M15 6v15" stroke="currentColor" strokeWidth="1.6" />
    </>,
    p
  );

export const IconFilter = (p: Props) =>
  svg(
    <path d="M3 6h18M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />,
    p
  );

export const IconPhone = (p: Props) =>
  svg(
    <path
      d="M4.5 5h3.8l1.5 4.5-2.4 1.8a12 12 0 0 0 5.1 5.1l1.8-2.4L18.8 15.5V19a1.5 1.5 0 0 1-1.7 1.5A15.8 15.8 0 0 1 3 6.7 1.5 1.5 0 0 1 4.5 5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />,
    p
  );

export const IconPin = (p: Props) =>
  svg(
    <>
      <path d="M12 21.5s7.5-6.2 7.5-13.5a7.5 7.5 0 0 0-15 0C4.5 15.3 12 21.5 12 21.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.8" stroke="currentColor" strokeWidth="1.5" />
    </>,
    p
  );

export const IconPlay = (p: Props) =>
  svg(<path d="M7 4.5v15l12.5-7.5L7 4.5Z" fill="currentColor" />, p);

export const IconImage = (p: Props) =>
  svg(
    <>
      <rect x="3" y="6" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m6 16 3.5-4 2.5 2.6L15 11l3 5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </>,
    p
  );

export const IconClose = (p: Props) =>
  svg(<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />, p);

export const IconMenu = (p: Props) =>
  svg(<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />, p);

export const IconChevron = (p: Props) =>
  svg(
    <path d="M6 9.5 12 15.5l6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
    p
  );

export const IconWhatsApp = (p: Props) =>
  svg(
    <path
      d="M12 3a9 9 0 0 0-7.6 13.7L3 21l4.4-1.3A9 9 0 1 0 12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />,
    p
  );

/* --- Specialist services ------------------------------------------- */

/** Drafting compass — architects. */
export const IconCompass = (p: Props) =>
  svg(
    <>
      <circle cx="12" cy="4.5" r="1.7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 6.1 6 20M13 6.1 18 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.2 14h5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>,
    p
  );

/** Scales of justice — advocates. */
export const IconScale = (p: Props) =>
  svg(
    <>
      <path d="M12 4.5V20M7.5 20h9M4.5 8h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.5 8 2 14h5L4.5 8ZM19.5 8 17 14h5l-2.5-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>,
    p
  );

/** Calculator — tax consultants. */
export const IconCalc = (p: Props) =>
  svg(
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 7h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>,
    p
  );

/** Hard hat — engineers. */
export const IconHelmet = (p: Props) =>
  svg(
    <>
      <path d="M3.5 17.5h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 17.5v-3a6 6 0 0 1 12 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 9.6V5.5h4v4.1" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>,
    p
  );

/** Brick wall — civil contractors. */
export const IconBricks = (p: Props) =>
  svg(
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9.7h18M3 14.3h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 5v4.7M15 5v4.7M12 9.7v4.6M6 14.3V19M18 14.3V19" stroke="currentColor" strokeWidth="1.5" />
    </>,
    p
  );
