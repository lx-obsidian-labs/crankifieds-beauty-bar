export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DayHours = {
  day: Weekday;
  label: string;
  short: string;
  /** Opening time in minutes from midnight. Null means closed. */
  open: number | null;
  close: number | null;
  note?: string;
};

export const MINUTES = (h: number, m = 0) => h * 60 + m;

/**
 * ── EDIT ME ──────────────────────────────────────────────────────────────
 * Phone, WhatsApp and social handles are intentionally blank until the
 * owner supplies them. Empty values simply hide those links across the site;
 * everything else (booking, orders, referrals, contact) works without them.
 */
export const site = {
  name: "Crankified's Beauty Bar",
  shortName: "Crankified's",
  legalName: "Crankified's Beauty Bar",
  tagline: "Hair · Lashes · Nails",
  description:
    "A private beauty bar in Ermelo for hair, lashes and nails. By appointment, one client at a time. Thursday walk-ins. Brand-new and pre-owned iPhones, sneakers and accessories with 1–3 day delivery.",
  city: "Ermelo",
  province: "Mpumalanga",
  country: "South Africa",
  region: "ZA-MP",
  addressLine: "Exact studio address shared on confirmation",
  postalCode: "",
  phone: "",
  whatsapp: "",
  email: "",
  instagram: "",
  tiktok: "",
  established: "2019",
  mapsQuery: "Ermelo, Mpumalanga, South Africa",
  hours: [
    { day: "monday", label: "Monday", short: "Mon", open: MINUTES(9), close: MINUTES(18) },
    { day: "tuesday", label: "Tuesday", short: "Tue", open: MINUTES(9), close: MINUTES(18) },
    { day: "wednesday", label: "Wednesday", short: "Wed", open: MINUTES(9), close: MINUTES(18) },
    {
      day: "thursday",
      label: "Thursday",
      short: "Thu",
      open: MINUTES(9),
      close: MINUTES(18),
      note: "Walk-ins welcome",
    },
    { day: "friday", label: "Friday", short: "Fri", open: MINUTES(9), close: MINUTES(18) },
    { day: "saturday", label: "Saturday", short: "Sat", open: MINUTES(9), close: MINUTES(15) },
    { day: "sunday", label: "Sunday", short: "Sun", open: null, close: null, note: "Closed" },
  ] satisfies DayHours[],
  booking: {
    /** How far ahead clients may book. */
    horizonDays: 60,
    /** Minimum notice, in minutes, for a same-day appointment. */
    minimumNoticeMinutes: 120,
    /** Breathing room reserved after every appointment. */
    bufferMinutes: 15,
    /** Appointment start times are offered on this grid. */
    slotStepMinutes: 30,
    timezone: "Africa/Johannesburg",
  },
  policies: [
    {
      title: "Appointments",
      body: "The studio runs by appointment, one client at a time. Walk-ins are welcome on Thursdays only, subject to the chair being free.",
    },
    {
      title: "Deposits & rescheduling",
      body: "Nothing is charged online. Longer services such as braids, colour and installs may need a small deposit to hold the chair — we confirm this when your booking is accepted. Reschedule at least 24 hours ahead so the slot can be offered to someone else.",
    },
    {
      title: "Late arrivals",
      body: "Please arrive on time. Arrivals more than 15 minutes late may need to shorten the service or move to the next available slot so the following client is not kept waiting.",
    },
    {
      title: "Referral gift",
      body: "When three clients you referred have been seen, choose one of three signature services on us. The gift is personal, is valid for six months and is booked Monday to Thursday.",
    },
    {
      title: "Phones & sneakers",
      body: "Every pre-owned device is iCloud-free, battery-checked and sold with an honest condition grade. Orders typically take 1–3 days. Collection in Ermelo or courier nationwide.",
    },
  ],
  deliveryNote: "Orders typically take 1–3 days.",
} as const;

export const hoursForDay = (day: Weekday) => site.hours.find((h) => h.day === day)!;

export const formatMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const siteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const telHref = () => (site.phone ? `tel:${site.phone.replace(/\s/g, "")}` : null);
export const whatsappHref = (message = "Hi Crankified's — I'd like to make a booking.") =>
  site.whatsapp
    ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    : null;
