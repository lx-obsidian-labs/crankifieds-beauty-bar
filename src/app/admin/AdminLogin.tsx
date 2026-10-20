"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkle } from "@/components/icons";

export function AdminLogin() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error ?? "That passcode is not right.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the studio. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75svh] items-center justify-center bg-[#f6f0e6] px-4 py-16">
      <form onSubmit={submit} className="w-full max-w-sm border border-line bg-cream p-8">
        <Sparkle className="h-5 w-5 text-champagne" />
        <p className="label mt-5 text-stone">Crankified&rsquo;s</p>
        <h1 className="display mt-2 text-[2.4rem] leading-none">
          Studio <span className="italic">desk.</span>
        </h1>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink/55">
          Appointments, orders and referral claims for the owner.
        </p>

        <label className="field mt-7">
          <span>Passcode</span>
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            placeholder="••••••••"
            autoFocus
          />
        </label>

        {error && <p className="mt-3 text-[11.5px] text-red-800">{error}</p>}

        <button type="submit" disabled={loading || !passcode} className="btn btn-ink mt-6 w-full">
          {loading ? "Checking…" : "Open the desk"}
          {!loading && <ArrowRight />}
        </button>
        <p className="mt-4 text-[10px] leading-relaxed text-ink/35">
          Set <code>ADMIN_PASSCODE</code> in the deployment environment. The session lasts
          eight hours.
        </p>
      </form>
    </div>
  );
}
