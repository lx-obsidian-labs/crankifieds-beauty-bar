"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addOnsFor,
  categories,
  getCategory,
  getService,
  resolveSelection,
  type ServiceCategoryId,
} from "@/lib/services";
import { addDays, formatDateLong, formatDuration, formatZAR } from "@/lib/format";
import { site, whatsappHref } from "@/lib/site";
import type { BookingRow } from "@/lib/db";
import type { DayAvailability } from "@/lib/schedule";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkle,
  WhatsApp,
} from "@/components/icons";

type Props = {
  today: string;
  horizonEnd: string;
  initialService?: string;
};

type Availability = DayAvailability & { loading?: boolean; error?: string };

type Details = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  referralCode: string;
  consent: boolean;
};

const steps = ["Service", "Extras", "Date & time", "Your details"];

const monthKey = (iso: string) => iso.slice(0, 7);

function monthMatrix(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, monthNumber - 1, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const total = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= total; day += 1) {
    cells.push(
      `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const monthLabel = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en-ZA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));
};

const shiftMonth = (month: string, delta: number) => {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

export function BookingWizard({ today, horizonEnd, initialService }: Props) {
  const startingService = initialService ? getService(initialService) : undefined;
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<ServiceCategoryId>(
    startingService?.category ?? "hair",
  );
  const [serviceId, setServiceId] = useState(startingService?.id ?? "");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [date, setDate] = useState(today);
  const [viewMonth, setViewMonth] = useState(monthKey(today));
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [reload, setReload] = useState(0);
  const [details, setDetails] = useState<Details>({
    name: "",
    phone: "",
    email: "",
    notes: "",
    referralCode: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingRow | null>(null);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const selection = useMemo(
    () => resolveSelection(serviceId, addonIds),
    [serviceId, addonIds],
  );
  const categoryServices = getCategory(category).services;
  const extras = addOnsFor(category);
  const phone = whatsappHref(
    booking ? `Hi Crankified's — about appointment ${booking.reference}.` : undefined,
  );

  useEffect(() => {
    if (!serviceId || step < 2) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ date, service: serviceId });
    if (addonIds.length) params.set("addons", addonIds.join(","));

    const load = async () => {
      setAvailability((current) => ({
        ...(current ?? { date, open: true, slots: [] }),
        loading: true,
        error: undefined,
      }));

      try {
        const response = await fetch(`/api/availability?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as Availability & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Could not load times.");
        setAvailability({ ...payload, loading: false });
        setTime((current) => (payload.slots.includes(current) ? current : ""));
      } catch (caught) {
        if ((caught as Error).name === "AbortError") return;
        setAvailability({
          date,
          open: false,
          slots: [],
          loading: false,
          error: (caught as Error).message,
        });
      }
    };

    void load();

    return () => controller.abort();
  }, [date, serviceId, addonIds, step, reload]);

  const goto = useCallback((next: number) => {
    setStep(next);
    setServerError("");
    window.setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    }, 30);
  }, []);

  const canContinue = () => {
    if (step === 0) return Boolean(serviceId);
    if (step === 2) return Boolean(time);
    return true;
  };

  const findNextAvailable = async () => {
    if (!selection) return;
    setSearching(true);
    setNotice("");
    try {
      for (let offset = 1; offset <= 21; offset += 1) {
        const candidate = addDays(date, offset);
        if (candidate > horizonEnd) break;
        const params = new URLSearchParams({ date: candidate, service: serviceId });
        if (addonIds.length) params.set("addons", addonIds.join(","));
        const response = await fetch(`/api/availability?${params.toString()}`);
        const payload = (await response.json()) as Availability;
        if (response.ok && payload.slots?.length) {
          setDate(candidate);
          setViewMonth(monthKey(candidate));
          setTime(payload.slots[0]);
          setNotice(`Next opening: ${formatDateLong(candidate)} at ${payload.slots[0]}.`);
          return;
        }
      }
      setNotice("No openings in the next three weeks. Send us a message and we will make a plan.");
    } catch {
      setNotice("We could not search the calendar just now. Please pick another date.");
    } finally {
      setSearching(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selection || !time) return;
    setServerError("");

    const nextErrors: Record<string, string> = {};
    if (details.name.trim().length < 2) nextErrors.name = "Please tell us your name.";
    if (details.phone.replace(/\D/g, "").length < 9)
      nextErrors.phone = "Enter a phone number we can reach you on.";
    if (details.email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(details.email.trim()))
      nextErrors.email = "That email address does not look right.";
    if (!details.consent) nextErrors.consent = "Please accept the appointment terms.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          addonIds,
          date,
          time,
          ...details,
        }),
      });
      const payload = (await response.json()) as {
        booking?: BookingRow;
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !payload.booking) {
        setErrors(payload.fields ?? {});
        setServerError(payload.error ?? "That did not go through. Please try again.");
        if (response.status === 409) setReload((value) => value + 1);
        return;
      }
      setBooking(payload.booking);
      setStep(4);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setServerError("We could not reach the studio. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setBooking(null);
    setStep(0);
    setServiceId("");
    setAddonIds([]);
    setTime("");
    setDetails({ name: "", phone: "", email: "", notes: "", referralCode: "", consent: false });
    setErrors({});
    setNotice("");
  };

  /* ── Confirmation ──────────────────────────────────────────────────────── */
  if (booking) {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <div className="animate-fade-up border border-line bg-cream">
          <div className="border-b border-line p-7 md:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/50 bg-champagne/10">
              <Check className="h-5 w-5 text-champagne" />
            </span>
            <p className="label mt-6 text-stone">Request received</p>
            <h2 className="display mt-3 text-[clamp(2.2rem,4.6vw,3.6rem)]">
              Thank you, <span className="italic">{booking.name.split(" ")[0]}.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-ink/60">
              Your appointment request is in. Crankified will confirm it personally —
              usually the same day. Nothing has been charged.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-line pt-6">
              <div>
                <p className="label text-stone">Reference</p>
                <p className="mt-1 font-display text-2xl tracking-wide">{booking.reference}</p>
              </div>
              <div>
                <p className="label text-stone">When</p>
                <p className="mt-1 text-[13.5px]">
                  {formatDateLong(booking.date)} &middot; {booking.time}
                </p>
              </div>
              <div>
                <p className="label text-stone">Total</p>
                <p className="mt-1 text-[13.5px]">{formatZAR(booking.price)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-2">
            <div className="border-b border-line p-7 sm:border-b-0 sm:border-r md:p-8">
              <p className="label text-stone">The service</p>
              <p className="mt-2 font-display text-xl">{booking.serviceName}</p>
              {booking.addons.length > 0 && (
                <p className="mt-1.5 text-[12.5px] text-ink/55">
                  + {booking.addons.map((addon) => addon.name).join(", ")}
                </p>
              )}
              <p className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-ink/45">
                <Clock className="h-3.5 w-3.5" /> {formatDuration(booking.duration)}
              </p>
            </div>
            <div className="p-7 md:p-8">
              <p className="label text-stone">What happens next</p>
              <ol className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-ink/60">
                <li className="flex gap-2.5">
                  <span className="text-champagne">01</span> We check the chair and confirm
                  your slot.
                </li>
                <li className="flex gap-2.5">
                  <span className="text-champagne">02</span> You receive the studio address
                  and any deposit details.
                </li>
                <li className="flex gap-2.5">
                  <span className="text-champagne">03</span> Arrive five minutes early with
                  clean, product-free hair or lashes where relevant.
                </li>
              </ol>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-line p-7 md:p-8">
            <Link
              href={`/appointment/${booking.reference}`}
              className="btn btn-ink"
            >
              View appointment <ArrowRight />
            </Link>
            <a
              href={`/api/appointment/${booking.reference}/calendar`}
              className="btn btn-outline"
            >
              <Calendar /> Add to calendar
            </a>
            {phone && (
              <a
                href={phone}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <WhatsApp /> WhatsApp us
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11.5px] text-ink/45">
            Keep your reference safe. Reschedule at least 24 hours ahead.
          </p>
          <button type="button" onClick={reset} className="arrow-link">
            Book another appointment <ArrowRight />
          </button>
        </div>
      </div>
    );
  }

  /* ── Wizard ────────────────────────────────────────────────────────────── */
  return (
    <div ref={topRef} className="scroll-mt-28 grid gap-10 pb-24 lg:grid-cols-12 lg:gap-8 lg:pb-0">
      <div className="lg:col-span-7 xl:col-span-7">
        {/* Mobile-first stepper: numbers + short labels, scroll-safe. */}
        <ol className="grid grid-cols-4 gap-1.5 border-b border-line pb-5 sm:gap-2" aria-label="Booking progress">
          {steps.map((label, index) => {
            const active = index === step;
            const complete = index < step;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => index < step && goto(index)}
                  disabled={index > step}
                  aria-current={active ? "step" : undefined}
                  className="w-full text-left disabled:cursor-default"
                >
                  <span
                    className={`block h-px w-full transition-colors ${
                      active ? "bg-champagne" : complete ? "bg-ink/40" : "bg-line"
                    }`}
                  />
                  <span
                    className={`mt-2.5 block text-[9px] uppercase tracking-[0.2em] ${
                      active ? "text-champagne" : complete ? "text-ink/60" : "text-ink/30"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={`mt-1 block text-[10.5px] uppercase tracking-[0.12em] ${
                      active ? "text-ink" : "text-ink/35"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div key={step} className="animate-fade-up pt-8">
          {step === 0 && (
            <section aria-labelledby="step-service">
              <p className="label text-stone">First things first</p>
              <h2 ref={headingRef} tabIndex={-1} id="step-service" className="display mt-3 text-[clamp(2rem,3.6vw,2.8rem)]">
                What are we doing?
              </h2>
              <p className="mt-2 max-w-md text-[13px] text-ink/55">
                Choose a service. Extras and timing come next.
              </p>

              <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Service category">
                {categories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={category === item.id}
                    className="chip"
                    onClick={() => {
                      setCategory(item.id);
                      setServiceId("");
                      setAddonIds([]);
                      setTime("");
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-line">
                {categoryServices.map((service) => {
                  const active = serviceId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setServiceId(service.id);
                        setAddonIds([]);
                        setTime("");
                        setNotice("");
                      }}
                      className={`group flex w-full items-start gap-3.5 border-b border-line py-5 pr-1 text-left transition-colors sm:gap-4 ${
                        active ? "bg-ink/[0.035]" : "hover:bg-ink/[0.02] active:bg-ink/[0.04]"
                      }`}
                    >
                      <span
                        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          active ? "border-ink bg-ink text-ivory" : "border-ink/25"
                        }`}
                        aria-hidden="true"
                      >
                        {active && <Check className="h-2.5 w-2.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-display text-[1.3rem] leading-tight">
                            {service.name}
                          </span>
                          {service.signature && (
                            <span className="inline-flex items-center gap-1 bg-champagne/20 px-2 py-0.5 text-[8px] uppercase tracking-[0.16em] text-ink/60">
                              <Sparkle className="h-2.5 w-2.5" /> Signature
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block max-w-md text-[12.5px] leading-relaxed text-ink/50">
                          {service.description}
                        </span>
                        <span className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ink/40">
                          <Clock className="h-3 w-3" /> {formatDuration(service.duration)}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-display text-lg">
                          {service.from ? "from " : ""}
                          {formatZAR(service.price)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 1 && selection && (
            <section aria-labelledby="step-extras">
              <p className="label text-stone">Make it yours</p>
              <h2 ref={headingRef} tabIndex={-1} id="step-extras" className="display mt-3 text-[clamp(2rem,3.6vw,2.8rem)]">
                A little extra.
              </h2>
              <p className="mt-2 max-w-md text-[13px] text-ink/55">
                Optional additions for your {selection.service.name.toLowerCase()}. Skip
                anything you do not need.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {extras.map((addOn) => {
                  const active = addonIds.includes(addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setAddonIds((current) =>
                          current.includes(addOn.id)
                            ? current.filter((id) => id !== addOn.id)
                            : [...current, addOn.id],
                        );
                        setTime("");
                      }}
                      className={`flex items-start justify-between gap-3 border p-4 text-left transition-colors ${
                        active
                          ? "border-ink bg-ink text-ivory"
                          : "border-line bg-cream hover:border-ink/40"
                      }`}
                    >
                      <span>
                        <span className="block text-[13px] leading-snug">{addOn.name}</span>
                        <span
                          className={`mt-1 block text-[10px] uppercase tracking-[0.14em] ${
                            active ? "text-ivory/50" : "text-ink/40"
                          }`}
                        >
                          + {formatDuration(addOn.duration)}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 font-display text-[15px]">
                        {formatZAR(addOn.price)}
                        <span
                          className={`flex h-4 w-4 items-center justify-center border ${
                            active ? "border-champagne bg-champagne text-ink" : "border-ink/20"
                          }`}
                        >
                          {active && <Check className="h-2.5 w-2.5" />}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-5 text-[11.5px] text-ink/45">
                Extras add time to your appointment. Your total is shown on the right and
                confirmed before you book.
              </p>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="step-schedule">
              <p className="label text-stone">Choose a time</p>
              <h2 ref={headingRef} tabIndex={-1} id="step-schedule" className="display mt-3 text-[clamp(2rem,3.6vw,2.8rem)]">
                When suits you?
              </h2>
              <p className="mt-2 max-w-md text-[13px] text-ink/55">
                The studio runs {formatDuration(selection?.duration ?? 0)} for this
                appointment. Closed Sundays.
              </p>

              <div className="mt-6 border border-line bg-cream">
                <div className="flex items-center justify-between border-b border-line px-3 py-2.5 sm:px-4 sm:py-3">
                  <button
                    type="button"
                    onClick={() => setViewMonth(shiftMonth(viewMonth, -1))}
                    disabled={viewMonth <= monthKey(today)}
                    aria-label="Previous month"
                    className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-ink/5 active:bg-ink/10 disabled:opacity-25"
                  >
                    <ChevronLeft />
                  </button>
                  <p className="px-1 text-center text-[11px] uppercase tracking-[0.2em]">{monthLabel(viewMonth)}</p>
                  <button
                    type="button"
                    onClick={() => setViewMonth(shiftMonth(viewMonth, 1))}
                    disabled={viewMonth >= monthKey(horizonEnd)}
                    aria-label="Next month"
                    className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-ink/5 active:bg-ink/10 disabled:opacity-25"
                  >
                    <ChevronRight />
                  </button>
                </div>

                <div className="px-3 pb-3 pt-4 sm:px-4">
                  <div className="grid grid-cols-7 text-center">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                      <span
                        key={`${day}-${index}`}
                        className="pb-3 text-[9px] uppercase tracking-[0.15em] text-ink/35"
                      >
                        {day}
                      </span>
                    ))}
                    {monthMatrix(viewMonth).map((cell, index) => {
                      if (!cell) return <span key={`blank-${index}`} />;
                      const dayNumber = Number(cell.slice(8, 10));
                      const isPast = cell < today;
                      const isBeyond = cell > horizonEnd;
                      const isSunday = new Date(`${cell}T00:00:00Z`).getUTCDay() === 0;
                      const disabled = isPast || isBeyond || isSunday;
                      const selected = cell === date;
                      const isToday = cell === today;
                      return (
                        <button
                          key={cell}
                          type="button"
                          disabled={disabled}
                          aria-pressed={selected}
                          aria-label={formatDateLong(cell)}
                          onClick={() => {
                            setDate(cell);
                            setTime("");
                            setNotice("");
                          }}
                          className={`relative mx-auto flex h-11 w-full min-w-0 max-w-[2.9rem] items-center justify-center text-[12.5px] transition-colors sm:h-11 sm:w-11 sm:max-w-none ${
                            selected
                              ? "bg-ink text-ivory"
                              : disabled
                                ? "cursor-not-allowed text-ink/20"
                                : "text-ink/75 hover:bg-ink/5"
                          }`}
                        >
                          {dayNumber}
                          {isToday && !selected && (
                            <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-champagne" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="border-t border-line px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-ink/35">
                  Bookings open {site.booking.horizonDays} days ahead &middot; Walk-ins
                  Thursdays only
                </p>
              </div>

              <div className="mt-7" aria-live="polite">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl">{formatDateLong(date)}</h3>
                  {availability && !availability.loading && availability.open && (
                    <span className="text-[10px] uppercase tracking-[0.16em] text-ink/40">
                      {availability.slots.length} time
                      {availability.slots.length === 1 ? "" : "s"} open
                    </span>
                  )}
                </div>

                {availability?.loading && (
                  <div className="mt-5 flex items-center gap-3 text-[12px] text-ink/50">
                    <span className="spinner" /> Checking the calendar…
                  </div>
                )}

                {availability?.error && (
                  <div className="mt-4 border border-red-900/20 bg-red-900/5 p-4 text-[12.5px] text-red-900">
                    {availability.error}
                    <button
                      type="button"
                      onClick={() => setReload((value) => value + 1)}
                      className="ml-2 underline underline-offset-4"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!availability?.loading && !availability?.error && availability && (
                  <>
                    {availability.slots.length > 0 ? (
                      <div className="mt-5 space-y-5">
                        {[
                          { label: "Morning", slots: availability.slots.filter((slot) => slot < "12:00") },
                          { label: "Afternoon", slots: availability.slots.filter((slot) => slot >= "12:00") },
                        ]
                          .filter((group) => group.slots.length > 0)
                          .map((group) => (
                            <div key={group.label}>
                              <p className="text-[9px] uppercase tracking-[0.2em] text-ink/35">
                                {group.label}
                              </p>
                              <div className="mt-2.5 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                                {group.slots.map((slot) => (
                                  <button
                                    key={slot}
                                    type="button"
                                    aria-pressed={time === slot}
                                    onClick={() => setTime(slot)}
                                    className={`flex min-h-[3rem] items-center justify-center border px-3 py-3 text-[12.5px] transition-colors sm:min-w-[4.6rem] sm:py-2.5 sm:text-[12px] ${
                                      time === slot
                                        ? "border-ink bg-ink text-ivory"
                                        : "border-line bg-cream hover:border-ink/50 active:border-ink/70"
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="mt-4 border border-line bg-cream p-5">
                        <p className="text-[13px] text-ink/65">
                          {availability.reason ?? "No times left on this day."}
                        </p>
                        <button
                          type="button"
                          onClick={findNextAvailable}
                          disabled={searching}
                          className="arrow-link mt-4"
                        >
                          {searching ? "Searching…" : "Find the next available day"}{" "}
                          <ArrowRight />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {notice && (
                  <p className="mt-4 border-l-2 border-champagne bg-champagne/10 px-4 py-3 text-[12px] text-ink/70">
                    {notice}
                  </p>
                )}
              </div>
            </section>
          )}

          {step === 3 && selection && (
            <form onSubmit={submit} noValidate aria-labelledby="step-details">
              <p className="label text-stone">Last step</p>
              <h2 ref={headingRef} tabIndex={-1} id="step-details" className="display mt-3 text-[clamp(2rem,3.6vw,2.8rem)]">
                Your details.
              </h2>
              <p className="mt-2 max-w-md text-[13px] text-ink/55">
                We only use these to confirm your appointment and reach you if the
                schedule changes.
              </p>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <label className="field sm:col-span-2">
                  <span>Full name</span>
                  <input
                    className="input"
                    name="name"
                    autoComplete="name"
                    value={details.name}
                    onChange={(event) =>
                      setDetails((current) => ({ ...current, name: event.target.value }))
                    }
                    aria-invalid={Boolean(errors.name)}
                    placeholder="Thandi Mokoena"
                  />
                  {errors.name && <em className="text-[11px] not-italic text-red-800">{errors.name}</em>}
                </label>

                <label className="field">
                  <span>Mobile number</span>
                  <input
                    className="input"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={details.phone}
                    onChange={(event) =>
                      setDetails((current) => ({ ...current, phone: event.target.value }))
                    }
                    aria-invalid={Boolean(errors.phone)}
                    placeholder="071 234 5678"
                  />
                  {errors.phone && <em className="text-[11px] not-italic text-red-800">{errors.phone}</em>}
                </label>

                <label className="field">
                  <span>Email (optional)</span>
                  <input
                    className="input"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={details.email}
                    onChange={(event) =>
                      setDetails((current) => ({ ...current, email: event.target.value }))
                    }
                    aria-invalid={Boolean(errors.email)}
                    placeholder="you@email.co.za"
                  />
                  {errors.email && <em className="text-[11px] not-italic text-red-800">{errors.email}</em>}
                </label>

                <label className="field sm:col-span-2">
                  <span>Anything we should know? (optional)</span>
                  <textarea
                    className="input"
                    name="notes"
                    rows={3}
                    value={details.notes}
                    onChange={(event) =>
                      setDetails((current) => ({ ...current, notes: event.target.value }))
                    }
                    placeholder="Length, colour reference, allergies, or the look you have in mind."
                  />
                </label>

                <label className="field sm:col-span-2">
                  <span>Referral code (optional)</span>
                  <input
                    className="input uppercase tracking-[0.12em]"
                    name="referralCode"
                    value={details.referralCode}
                    onChange={(event) =>
                      setDetails((current) => ({
                        ...current,
                        referralCode: event.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="CRK-XXXXXX"
                  />
                </label>
              </div>

              <label className="mt-7 flex cursor-pointer items-start gap-3 text-[12px] leading-relaxed text-ink/60">
                <input
                  type="checkbox"
                  checked={details.consent}
                  onChange={(event) =>
                    setDetails((current) => ({ ...current, consent: event.target.checked }))
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#0b0a09]"
                  aria-invalid={Boolean(errors.consent)}
                />
                <span>
                  I understand this is an appointment request that the studio confirms
                  personally, and I agree to the 24-hour reschedule policy. No payment is
                  taken online.
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 text-[11px] text-red-800">{errors.consent}</p>
              )}

              {serverError && (
                <div className="mt-6 border border-red-900/20 bg-red-900/5 p-4 text-[12.5px] leading-relaxed text-red-900">
                  {serverError}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                <button type="button" onClick={() => goto(2)} className="btn btn-outline">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <button type="submit" disabled={submitting} className="btn btn-ink flex-1 sm:flex-none">
                  {submitting ? (
                    <>
                      <span className="spinner !border-ivory/30 !border-t-ivory" /> Sending…
                    </>
                  ) : (
                    <>
                      Request appointment <ArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step < 3 && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
              <button
                type="button"
                onClick={() => goto(Math.max(0, step - 1))}
                disabled={step === 0}
                className="btn btn-outline !px-4 disabled:opacity-0"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <div className="flex items-center gap-3">
                {step === 1 && (
                  <button type="button" onClick={() => goto(2)} className="text-[10px] uppercase tracking-[0.18em] text-ink/45 hover:text-ink">
                    Skip
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => goto(step + 1)}
                  disabled={!canContinue()}
                  className="btn btn-ink"
                >
                  Continue <ArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary — sticky bottom bar on mobile, sidebar on desktop */}
      <aside className="lg:col-span-4 lg:col-start-9">
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/97 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-[12.5px] text-ink/70">
                {selection ? selection.service.name : "Choose a service"}
                {time ? ` · ${time}` : ""}
              </p>
              {selection ? (
                <p className="mt-0.5 font-display text-xl leading-tight">
                  {formatZAR(selection.price)}
                </p>
              ) : null}
            </div>
            <div className="shrink-0">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => goto(step + 1)}
                  disabled={!canContinue()}
                  className="btn btn-ink !w-auto !min-h-[3rem] !px-6"
                >
                  Continue <ArrowRight />
                </button>
              ) : (
                <p className="font-display text-xl">{selection ? formatZAR(selection.price) : ""}</p>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:sticky lg:top-28">
        <div className="border border-line bg-cream">
          <div className="border-b border-line p-6">
            <p className="label text-stone">Your appointment</p>
            {selection ? (
              <>
                <p className="mt-3 font-display text-[1.45rem] leading-tight">
                  {selection.service.name}
                </p>
                {selection.addOns.length > 0 && (
                  <ul className="mt-2 space-y-1 text-[12px] text-ink/55">
                    {selection.addOns.map((addOn) => (
                      <li key={addOn.id} className="flex justify-between gap-3">
                        <span>+ {addOn.name}</span>
                        <span>{formatZAR(addOn.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="mt-3 text-[13px] text-ink/40">Choose a service to begin.</p>
            )}
          </div>

          <div className="p-6">
            <dl className="space-y-3 text-[12.5px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink/45">Date</dt>
                <dd className="text-right">{step >= 2 || time ? formatDateLong(date) : "Not chosen"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink/45">Time</dt>
                <dd>{time || "Not chosen"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink/45">Duration</dt>
                <dd>{selection ? formatDuration(selection.duration) : "—"}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink/45">Total</span>
              <span className="font-display text-2xl">
                {selection ? formatZAR(selection.price) : "—"}
              </span>
            </div>

            <ul className="mt-5 space-y-2 border-t border-line pt-4 text-[11.5px] text-ink/50">
              {[
                "No payment taken online",
                "Confirmed personally by the studio",
                "Free reschedule up to 24 hours ahead",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-champagne" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-4 px-1 pb-24 text-[11px] leading-relaxed text-ink/40 lg:pb-0">
          By appointment only. Walk-ins are welcome on Thursdays while the chair is free.
          Longer services may need a small deposit to hold the slot.
        </p>
        </div>
      </aside>
    </div>
  );
}
