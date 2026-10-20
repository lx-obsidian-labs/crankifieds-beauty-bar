type IconProps = { className?: string };

export const ArrowRight = ({ className = "h-3.5 w-3.5" }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const ArrowUpRight = ({ className = "h-3.5 w-3.5" }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 12L12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const ArrowLeft = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M15 8H2M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const Plus = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export const Check = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8.5l4 4L14 3.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const Menu = ({ className = "h-5 w-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 7h18M3 17h18" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const Close = ({ className = "h-5 w-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const ChevronLeft = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const ChevronRight = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const Calendar = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2.5" y="4" width="15" height="13" stroke="currentColor" strokeWidth="1.1" />
    <path d="M2.5 8h15M6.5 2v4M13.5 2v4" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export const Clock = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export const Pin = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 18s6-5.2 6-9.5A6 6 0 004 8.5C4 12.8 10 18 10 18z"
      stroke="currentColor"
      strokeWidth="1.1"
    />
    <circle cx="10" cy="8.4" r="2.2" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export const WhatsApp = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.4.2-.7.1-1.4-.6-2.6-1.8-3.3-3.2-.1-.3-.1-.5.1-.7l.8-.9c.2-.2.1-.4 0-.6-.1-.3-.7-1.8-.9-2.4-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.6.1-.9.4-.9 1-1.1 2.3-.7 3.7.6 2 2.1 3.9 3.2 4.7 1.7 1.3 3.6 1.8 5.2 1.3.7-.2 1.3-.6 1.6-1.2.2-.5.2-.9.1-1.1-.1-.1-.2-.2-.4-.3z" />
    <path d="M12 2.2C6.6 2.2 2.2 6.6 2.2 12c0 1.7.4 3.3 1.2 4.7L2 22l5.4-1.4c1.3.7 2.9 1.1 4.6 1.1 5.4 0 9.8-4.4 9.8-9.8S17.4 2.2 12 2.2zm0 17.7c-1.5 0-3-.4-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A7.9 7.9 0 014 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 7.9-8 7.9z" />
  </svg>
);

export const Instagram = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="17.2" cy="6.9" r="1" fill="currentColor" />
  </svg>
);

export const TikTok = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.6 2h-3v13.1a2.8 2.8 0 11-2.8-2.8c.3 0 .5 0 .8.1V9.3a5.9 5.9 0 103.5 5.4V8.6c1.1.9 2.4 1.4 3.9 1.5V7.2c-1.5 0-2.9-.9-3.6-2.2-.5-.9-.8-1.9-.8-3z" />
  </svg>
);

export const Phone = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M4 3h3l1.4 3.6-2 1.4a11 11 0 005.6 5.6l1.4-2L17 13v3a2 2 0 01-2.2 2A14 14 0 012 5.2 2 2 0 014 3z"
      stroke="currentColor"
      strokeWidth="1.1"
    />
  </svg>
);

export const Sparkle = ({ className = "h-4 w-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);
