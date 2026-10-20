"use client";

import { useState } from "react";
import { Check, ArrowRight } from "@/components/icons";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError("");
    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) nextErrors.name = "Please tell us your name.";
    if (form.phone.replace(/\D/g, "").length < 9)
      nextErrors.phone = "Enter a phone number we can reach you on.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim()))
      nextErrors.email = "That email address does not look right.";
    if (form.message.trim().length < 5) nextErrors.message = "Tell us a little more.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as {
        inquiry?: { reference: string };
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !payload.inquiry) {
        setErrors(payload.fields ?? {});
        setServerError(payload.error ?? "That did not go through. Please try again.");
        return;
      }
      setReference(payload.inquiry.reference);
    } catch {
      setServerError("We could not reach the studio. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <div className="border border-line bg-cream p-7 md:p-9">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/50 bg-champagne/10">
          <Check className="h-5 w-5 text-champagne" />
        </span>
        <p className="label mt-5 text-stone">Message received</p>
        <h3 className="display mt-3 text-[2rem] leading-tight">
          Thank you.
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
          We have your note and will come back to you on the number you left. Your
          reference is <span className="text-ink">{reference}</span>.
        </p>
        <button
          type="button"
          onClick={() => {
            setReference("");
            setForm({ name: "", phone: "", email: "", message: "" });
          }}
          className="arrow-link mt-6"
        >
          Send another message <ArrowRight />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="border border-line bg-cream p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field sm:col-span-2">
          <span>Full name</span>
          <input
            className="input"
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Thandi Mokoena"
          />
          {errors.name && <em className="text-[11px] not-italic text-red-800">{errors.name}</em>}
        </label>
        <label className="field">
          <span>Mobile number</span>
          <input
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="071 234 5678"
          />
          {errors.phone && <em className="text-[11px] not-italic text-red-800">{errors.phone}</em>}
        </label>
        <label className="field">
          <span>Email (optional)</span>
          <input
            className="input"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@email.co.za"
          />
          {errors.email && <em className="text-[11px] not-italic text-red-800">{errors.email}</em>}
        </label>
        <label className="field sm:col-span-2">
          <span>Your message</span>
          <textarea
            className="input"
            rows={4}
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({ ...current, message: event.target.value }))
            }
            placeholder="A question about a service, a product you are looking for, or a date you have in mind."
          />
          {errors.message && (
            <em className="text-[11px] not-italic text-red-800">{errors.message}</em>
          )}
        </label>
      </div>

      {serverError && (
        <div className="mt-5 border border-red-900/20 bg-red-900/5 p-3.5 text-[12px] text-red-900">
          {serverError}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={submitting} className="btn btn-ink">
          {submitting ? (
            <>
              <span className="spinner !border-ivory/30 !border-t-ivory" /> Sending…
            </>
          ) : (
            <>
              Send message <ArrowRight />
            </>
          )}
        </button>
        <p className="text-[10.5px] text-ink/40">Usually answered within a business day.</p>
      </div>
    </form>
  );
}
