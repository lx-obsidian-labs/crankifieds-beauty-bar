"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  BookingRow,
  InquiryRow,
  OrderRow,
  ReferralRow,
} from "@/lib/db";
import { formatDateLong, formatZAR } from "@/lib/format";
import { ArrowUpRight, Check } from "@/components/icons";

type Props = {
  bookings: BookingRow[];
  orders: OrderRow[];
  referrals: ReferralRow[];
  inquiries: InquiryRow[];
  usingPostgres: boolean;
};

type Tab = "appointments" | "orders" | "referrals" | "messages";

const bookingStatusStyles: Record<string, string> = {
  pending: "bg-champagne/25 text-ink/70",
  confirmed: "bg-ink text-ivory",
  completed: "bg-ink/10 text-ink/60",
  cancelled: "bg-red-900/10 text-red-900",
};

const orderStatusStyles: Record<string, string> = {
  new: "bg-champagne/25 text-ink/70",
  sourcing: "bg-blue-900/10 text-blue-900",
  ready: "bg-ink text-ivory",
  collected: "bg-ink/10 text-ink/50",
  cancelled: "bg-red-900/10 text-red-900",
};

const referralStatusStyles: Record<string, string> = {
  pending: "bg-champagne/25 text-ink/70",
  rewarded: "bg-ink text-ivory",
  cancelled: "bg-red-900/10 text-red-900",
};

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export function AdminDashboard({
  bookings,
  orders,
  referrals,
  inquiries,
  usingPostgres,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("appointments");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const upcoming = bookings
    .filter((booking) => booking.status !== "completed" && booking.status !== "cancelled")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
  const newOrders = orders.filter((order) => order.status === "new").length;
  const pendingReferrals = referrals.filter((referral) => referral.status === "pending").length;

  const update = (type: "booking" | "order" | "referral", reference: string, status: string) => {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/status", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, reference, status }),
        });
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          setError(payload.error ?? "Could not update that record.");
          return;
        }
        router.refresh();
      } catch {
        setError("Could not reach the studio server.");
      }
    });
  };

  const signOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "appointments", label: "Appointments", count: upcoming.length },
    { id: "orders", label: "Orders", count: orders.length },
    { id: "referrals", label: "Referrals", count: referrals.length },
    { id: "messages", label: "Messages", count: inquiries.length },
  ];

  return (
    <div className="min-h-[80svh] bg-[#f6f0e6]">
      <div className="shell py-10 md:py-14">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="label text-champagne">Crankified&rsquo;s</p>
            <h1 className="display mt-2 text-[clamp(2.2rem,4.4vw,3.4rem)]">
              Studio <span className="italic">desk.</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ink/45 hover:text-ink sm:flex"
            >
              View site <ArrowUpRight className="h-3 w-3" />
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="border border-line px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:border-ink hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>

        {!usingPostgres && (
          <div className="mt-5 border border-champagne/40 bg-champagne/10 p-3.5 text-[11.5px] leading-relaxed text-ink/65">
            Running on the local development store. Add a <code>DATABASE_URL</code> before
            deploying so bookings survive.
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Awaiting confirmation", value: pendingBookings },
            { label: "New order requests", value: newOrders },
            { label: "Referral claims", value: pendingReferrals },
            { label: "Messages", value: inquiries.length },
          ].map((stat) => (
            <div key={stat.label} className="border border-line bg-cream p-5">
              <p className="font-display text-4xl">{String(stat.value).padStart(2, "0")}</p>
              <p className="mt-2 text-[9.5px] uppercase tracking-[0.18em] text-ink/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-1 border-b border-line">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={tab === item.id}
              className={`border-b-2 px-4 py-3 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                tab === item.id
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/40 hover:text-ink/70"
              }`}
            >
              {item.label}
              <span className="ml-2 text-champagne">{String(item.count).padStart(2, "0")}</span>
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 border border-red-900/20 bg-red-900/5 p-3 text-[12px] text-red-900">
            {error}
          </p>
        )}

        {pending && (
          <p className="mt-4 flex items-center gap-2 text-[11px] text-ink/45">
            <span className="spinner" /> Updating…
          </p>
        )}

        <div className="mt-6 space-y-3">
          {tab === "appointments" &&
            (upcoming.length === 0 ? (
              <Empty label="No upcoming appointments." />
            ) : (
              upcoming.map((booking) => (
                <article key={booking.reference} className="border border-line bg-cream p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-display text-[1.3rem] leading-tight">
                          {formatDateLong(booking.date)} &middot; {booking.time}
                        </p>
                        <span
                          className={`px-2 py-1 text-[8.5px] uppercase tracking-[0.16em] ${
                            bookingStatusStyles[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px]">
                        {booking.name} &middot;{" "}
                        <a href={`tel:${booking.phone}`} className="underline underline-offset-4">
                          {booking.phone}
                        </a>
                        {booking.email ? ` · ${booking.email}` : ""}
                      </p>
                      <p className="mt-1 text-[12px] text-ink/55">
                        {booking.serviceName}
                        {booking.addons.length
                          ? ` + ${booking.addons.map((addon) => addon.name).join(", ")}`
                          : ""}{" "}
                        &middot; {formatZAR(booking.price)}
                      </p>
                      {booking.notes && (
                        <p className="mt-2 max-w-2xl border-l-2 border-champagne/50 pl-3 text-[11.5px] italic text-ink/50">
                          {booking.notes}
                        </p>
                      )}
                      {booking.referralCode && (
                        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink/40">
                          Referral: {booking.referralCode}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg tracking-wide">{booking.reference}</p>
                      <p className="mt-1 text-[10px] text-ink/35">Booked {when(booking.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                    {booking.status !== "confirmed" && booking.status !== "completed" && (
                      <Action
                        label="Confirm"
                        primary
                        onClick={() => update("booking", booking.reference, "confirmed")}
                      />
                    )}
                    {booking.status === "confirmed" && (
                      <Action
                        label="Mark completed"
                        onClick={() => update("booking", booking.reference, "completed")}
                      />
                    )}
                    {booking.status !== "cancelled" && (
                      <Action
                        label="Cancel"
                        danger
                        onClick={() => update("booking", booking.reference, "cancelled")}
                      />
                    )}
                    <a
                      href={`/appointment/${booking.reference}`}
                      className="ml-auto self-center text-[9.5px] uppercase tracking-[0.16em] text-ink/40 hover:text-ink"
                    >
                      Client view
                    </a>
                  </div>
                </article>
              ))
            ))}

          {tab === "orders" &&
            (orders.length === 0 ? (
              <Empty label="No order requests yet." />
            ) : (
              orders.map((order) => (
                <article key={order.reference} className="border border-line bg-cream p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-display text-[1.3rem] leading-tight">
                          {order.productName}
                        </p>
                        <span
                          className={`px-2 py-1 text-[8.5px] uppercase tracking-[0.16em] ${
                            orderStatusStyles[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-ink/55">
                        {order.optionLabel ? `${order.optionLabel}: ${order.optionValue}` : "One size"} &middot;{" "}
                        {formatZAR(order.price)}
                      </p>
                      <p className="mt-1.5 text-[13px]">
                        {order.name} &middot;{" "}
                        <a href={`tel:${order.phone}`} className="underline underline-offset-4">
                          {order.phone}
                        </a>
                        {order.email ? ` · ${order.email}` : ""}
                      </p>
                      {order.notes && (
                        <p className="mt-2 max-w-2xl border-l-2 border-champagne/50 pl-3 text-[11.5px] italic text-ink/50">
                          {order.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg tracking-wide">{order.reference}</p>
                      <p className="mt-1 text-[10px] text-ink/35">{when(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                    {order.status === "new" && (
                      <Action
                        label="Start sourcing"
                        primary
                        onClick={() => update("order", order.reference, "sourcing")}
                      />
                    )}
                    {order.status === "sourcing" && (
                      <Action
                        label="Mark ready"
                        primary
                        onClick={() => update("order", order.reference, "ready")}
                      />
                    )}
                    {(order.status === "ready" || order.status === "sourcing") && (
                      <Action
                        label="Collected"
                        onClick={() => update("order", order.reference, "collected")}
                      />
                    )}
                    {order.status !== "cancelled" && order.status !== "collected" && (
                      <Action
                        label="Cancel"
                        danger
                        onClick={() => update("order", order.reference, "cancelled")}
                      />
                    )}
                  </div>
                </article>
              ))
            ))}

          {tab === "referrals" &&
            (referrals.length === 0 ? (
              <Empty label="No referral claims yet." />
            ) : (
              referrals.map((referral) => (
                <article key={referral.reference} className="border border-line bg-cream p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-display text-[1.3rem] leading-tight">
                          {referral.name}
                        </p>
                        <span
                          className={`px-2 py-1 text-[8.5px] uppercase tracking-[0.16em] ${
                            referralStatusStyles[referral.status]
                          }`}
                        >
                          {referral.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px]">
                        <a href={`tel:${referral.phone}`} className="underline underline-offset-4">
                          {referral.phone}
                        </a>
                        {referral.email ? ` · ${referral.email}` : ""}
                      </p>
                      <p className="mt-1 text-[12px] text-ink/55">
                        Reward: {referral.rewardName}
                      </p>
                      <p className="mt-2 text-[11.5px] text-ink/50">
                        Referred:{" "}
                        {referral.referred
                          .map((person) => `${person.name} (${person.phone})`)
                          .join(", ") || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg tracking-wide">
                        {referral.reference}
                      </p>
                      <p className="mt-1 text-[10px] text-ink/35">{when(referral.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                    {referral.status !== "rewarded" && (
                      <Action
                        label="Mark rewarded"
                        primary
                        onClick={() => update("referral", referral.reference, "rewarded")}
                      />
                    )}
                    {referral.status !== "cancelled" && (
                      <Action
                        label="Cancel"
                        danger
                        onClick={() => update("referral", referral.reference, "cancelled")}
                      />
                    )}
                  </div>
                </article>
              ))
            ))}

          {tab === "messages" &&
            (inquiries.length === 0 ? (
              <Empty label="No messages yet." />
            ) : (
              inquiries.map((inquiry) => (
                <article key={inquiry.reference} className="border border-line bg-cream p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-[1.3rem] leading-tight">{inquiry.name}</p>
                      <p className="mt-1 text-[13px]">
                        <a href={`tel:${inquiry.phone}`} className="underline underline-offset-4">
                          {inquiry.phone}
                        </a>
                        {inquiry.email ? ` · ${inquiry.email}` : ""}
                      </p>
                      <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-ink/60">
                        {inquiry.message}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg tracking-wide">{inquiry.reference}</p>
                      <p className="mt-1 text-[10px] text-ink/35">{when(inquiry.createdAt)}</p>
                    </div>
                  </div>
                </article>
              ))
            ))}
        </div>

        <p className="mt-10 flex items-center gap-2 border-t border-line pt-5 text-[10px] uppercase tracking-[0.16em] text-ink/35">
          <Check className="h-3 w-3 text-champagne" />
          {usingPostgres ? "Connected to the studio database" : "Local development store"}
        </p>
      </div>
    </div>
  );
}

function Action({
  label,
  onClick,
  primary,
  danger,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] transition-colors ${
        primary
          ? "border-ink bg-ink text-ivory hover:bg-transparent hover:text-ink"
          : danger
            ? "border-red-900/20 text-red-900/70 hover:border-red-900/50"
            : "border-line text-ink/55 hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-line p-10 text-center">
      <p className="text-[13px] text-ink/40">{label}</p>
    </div>
  );
}
