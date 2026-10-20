import { site, hoursForDay, type Weekday } from "./site";
import { addDays, todayInStudio, weekdayOf } from "./format";

const WEEKDAY_KEYS: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const weekdayKey = (isoDate: string): Weekday => WEEKDAY_KEYS[weekdayOf(isoDate)];

export const minutesFromTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes || 0);
};

export const timeFromMinutes = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Current wall-clock time at the studio, in minutes since midnight. */
export const nowInStudioMinutes = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.booking.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
};

export type BusyBlock = { time: string; duration: number };

export type DayAvailability = {
  date: string;
  open: boolean;
  slots: string[];
  reason?: string;
  firstAvailable?: string;
};

export const isClosedOn = (isoDate: string) => {
  const hours = hoursForDay(weekdayKey(isoDate));
  return hours.open === null || hours.close === null;
};

const overlaps = (
  start: number,
  end: number,
  busy: BusyBlock[],
  buffer: number,
) =>
  busy.some((block) => {
    const blockStart = minutesFromTime(block.time);
    const blockEnd = blockStart + block.duration + buffer;
    return start < blockEnd && end > blockStart;
  });

/**
 * Generates bookable start times for a single day. Server and client share this
 * function so the grid a client sees is exactly what the API will accept.
 */
export function availabilityForDate(
  date: string,
  duration: number,
  busy: BusyBlock[],
  options: { nowMinutes?: number } = {},
): DayAvailability {
  const hours = hoursForDay(weekdayKey(date));
  if (hours.open === null || hours.close === null) {
    return { date, open: false, slots: [], reason: "The studio is closed on Sundays." };
  }

  const today = todayInStudio();
  if (date < today) {
    return { date, open: false, slots: [], reason: "That date has already passed." };
  }

  if (date > addDays(today, site.booking.horizonDays)) {
    return {
      date,
      open: false,
      slots: [],
      reason: "Bookings open 60 days ahead.",
    };
  }

  const { bufferMinutes, slotStepMinutes, minimumNoticeMinutes } = site.booking;
  const slots: string[] = [];
  const earliest =
    date === today
      ? Math.max(hours.open, (options.nowMinutes ?? nowInStudioMinutes()) + minimumNoticeMinutes)
      : hours.open;

  for (
    let start = hours.open;
    start + duration <= hours.close;
    start += slotStepMinutes
  ) {
    const time = timeFromMinutes(start);
    if (start < earliest) continue;
    if (overlaps(start, start + duration, busy, bufferMinutes)) continue;
    slots.push(time);
  }

  return {
    date,
    open: true,
    slots,
    firstAvailable: slots[0],
    reason: slots.length === 0 ? "Fully booked — try another day." : undefined,
  };
}

export function calendarDays(from: string, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = addDays(from, index);
    return {
      date,
      closed: isClosedOn(date),
      weekday: weekdayKey(date),
    };
  });
}
