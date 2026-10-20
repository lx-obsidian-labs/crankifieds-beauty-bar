"use client";

import { useState } from "react";
import { rewards, type Reward } from "@/lib/services";
import { formatZAR } from "@/lib/format";
import { Check, ArrowRight, Sparkle } from "@/components/icons";

type Person = { name: string; phone: string };

type Result = { reference: string; rewardName: string };

export function ReferralExperience() {
  const [rewardId, setRewardId] = useState(rewards[0].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [referred, setReferred] = useState<Person[]>([
    { name: "", phone: "" },
    { name: "", phone: "" },
    { name: "", phone: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const updatePerson = (index: number, field: keyof Person, value: string) => {
    setReferred((current) =>
      current.map((person, personIndex) =>
        personIndex === index ? { ...person, [field]: value } : person,
      ),
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError("");

    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = "Please tell us your name.";
    if (phone.replace(/\D/g, "").length < 9)
      nextErrors.phone = "Enter a phone number we can reach you on.";
    if (email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim()))
      nextErrors.email = "That email address does not look right.";

    referred.forEach((person, index) => {
      if (person.name.trim().length < 2)
        nextErrors[`referred-${index}-name`] = "Enter their name.";
      if (person.phone.replace(/\D/g, "").length < 9)
        nextErrors[`referred-${index}-phone`] = "Enter their number.";
    });

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, rewardId, referred }),
      });
      const payload = (await response.json()) as {
        referral?: { reference: string; rewardName: string };
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !payload.referral) {
        setErrors(payload.fields ?? {});
        setServerError(payload.error ?? "That did not go through. Please try again.");
        return;
      }
      setResult({
        reference: payload.referral.reference,
        rewardName: payload.referral.rewardName,
      });
    } catch {
      setServerError("We could not reach the studio. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="shell py-16 md:py-24">
        <div className="reveal flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="label text-champagne">Choose your gift</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.4vw,3.8rem)]">
              One of these,
              <br />
              <span className="italic">on us.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[12.5px] leading-relaxed text-ink/50">
            The gift is the full service — no top-up needed. Pick the one you would
            actually book, then claim it below once your three referrals have been seen.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {rewards.map((reward, index) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              index={index}
              selected={rewardId === reward.id}
              onSelect={() => {
                setRewardId(reward.id);
                setResult(null);
              }}
            />
          ))}
        </div>
      </section>

      <section id="claim" className="scroll-mt-24 border-t border-line bg-[#f6f0e6]">
        <div className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <p className="label text-champagne">The claim</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,3.6vw,3.2rem)]">
              Three names.
              <br />
              One gift.
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-ink/55">
              Add the three clients you sent our way. We check their appointments against
              our book, then contact you to book your gift. No code to remember, no app to
              download.
            </p>
            <ul className="mt-6 space-y-2.5 text-[11.5px] leading-relaxed text-ink/50">
              {[
                "The three clients must be new to Crankified's.",
                "All three must have completed their appointment.",
                "Your gift is valid for six months, Monday to Thursday.",
                "One gift per client, and it is personal to you.",
              ].map((rule) => (
                <li key={rule} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-champagne" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal lg:col-span-7 lg:col-start-6" data-delay="1">
            {result ? (
              <div className="border border-line bg-cream p-7 md:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/50 bg-champagne/10">
                  <Check className="h-5 w-5 text-champagne" />
                </span>
                <p className="label mt-6 text-stone">Claim received</p>
                <h3 className="display mt-3 text-[2.2rem] leading-tight">
                  Your gift is <span className="italic">noted.</span>
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
                  We will verify that all three clients have been seen, then contact you on{" "}
                  {phone} to book your {result.rewardName}.
                </p>
                <div className="mt-6 flex items-center justify-between border border-line p-4">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-ink/40">
                    Claim reference
                  </span>
                  <span className="font-display text-xl tracking-wide">
                    {result.reference}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setName("");
                    setPhone("");
                    setEmail("");
                    setReferred([
                      { name: "", phone: "" },
                      { name: "", phone: "" },
                      { name: "", phone: "" },
                    ]);
                  }}
                  className="arrow-link mt-7"
                >
                  Submit another claim <ArrowRight />
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="border border-line bg-cream p-6 md:p-8">
                <fieldset>
                  <legend className="label text-stone">Your details</legend>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <label className="field sm:col-span-2">
                      <span>Full name</span>
                      <input
                        className="input"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Thandi Mokoena"
                      />
                      {errors.name && (
                        <em className="text-[11px] not-italic text-red-800">{errors.name}</em>
                      )}
                    </label>
                    <label className="field">
                      <span>Mobile number</span>
                      <input
                        className="input"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="071 234 5678"
                      />
                      {errors.phone && (
                        <em className="text-[11px] not-italic text-red-800">{errors.phone}</em>
                      )}
                    </label>
                    <label className="field">
                      <span>Email (optional)</span>
                      <input
                        className="input"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@email.co.za"
                      />
                      {errors.email && (
                        <em className="text-[11px] not-italic text-red-800">{errors.email}</em>
                      )}
                    </label>
                  </div>
                </fieldset>

                <fieldset className="mt-7 border-t border-line pt-6">
                  <legend className="label text-stone">Your gift</legend>
                  <div className="mt-4 space-y-2">
                    {rewards.map((reward) => (
                      <label
                        key={reward.id}
                        className={`flex cursor-pointer items-center gap-3 border p-3.5 transition-colors ${
                          rewardId === reward.id
                            ? "border-ink bg-ink text-ivory"
                            : "border-line hover:border-ink/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="reward"
                          value={reward.id}
                          checked={rewardId === reward.id}
                          onChange={() => setRewardId(reward.id)}
                          className="h-3.5 w-3.5 accent-[#c2a06a]"
                        />
                        <span className="flex-1">
                          <span className="block text-[13px]">{reward.name}</span>
                          <span
                            className={`mt-0.5 block text-[10px] uppercase tracking-[0.14em] ${
                              rewardId === reward.id ? "text-ivory/45" : "text-ink/40"
                            }`}
                          >
                            Value {formatZAR(reward.value)}
                          </span>
                        </span>
                        {rewardId === reward.id && <Sparkle className="h-3.5 w-3.5 text-champagne" />}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-7 border-t border-line pt-6">
                  <legend className="label text-stone">The three clients you referred</legend>
                  <div className="mt-4 space-y-5">
                    {referred.map((person, index) => (
                      <div key={index} className="grid gap-3 sm:grid-cols-[auto_1fr_1fr] sm:items-end">
                        <span className="font-display text-sm italic text-champagne sm:pb-3">
                          0{index + 1}
                        </span>
                        <label className="field">
                          <span className="sr-only">Client {index + 1} name</span>
                          <input
                            className="input"
                            placeholder="Client name"
                            value={person.name}
                            onChange={(event) =>
                              updatePerson(index, "name", event.target.value)
                            }
                          />
                          {errors[`referred-${index}-name`] && (
                            <em className="text-[11px] not-italic text-red-800">
                              {errors[`referred-${index}-name`]}
                            </em>
                          )}
                        </label>
                        <label className="field">
                          <span className="sr-only">Client {index + 1} phone</span>
                          <input
                            className="input"
                            type="tel"
                            inputMode="tel"
                            placeholder="Mobile number"
                            value={person.phone}
                            onChange={(event) =>
                              updatePerson(index, "phone", event.target.value)
                            }
                          />
                          {errors[`referred-${index}-phone`] && (
                            <em className="text-[11px] not-italic text-red-800">
                              {errors[`referred-${index}-phone`]}
                            </em>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {serverError && (
                  <div className="mt-6 border border-red-900/20 bg-red-900/5 p-4 text-[12.5px] leading-relaxed text-red-900">
                    {serverError}
                  </div>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-line pt-6">
                  <button type="submit" disabled={submitting} className="btn btn-ink">
                    {submitting ? (
                      <>
                        <span className="spinner !border-ivory/30 !border-t-ivory" /> Sending…
                      </>
                    ) : (
                      <>
                        Claim my gift <ArrowRight />
                      </>
                    )}
                  </button>
                  <p className="text-[10.5px] leading-relaxed text-ink/40">
                    We will only use these details to verify the referrals.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function RewardCard({
  reward,
  index,
  selected,
  onSelect,
}: {
  reward: Reward;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`reveal group relative flex flex-col overflow-hidden border transition-colors ${
        selected ? "border-ink" : "border-line"
      }`}
      data-delay={index > 2 ? undefined : index + 1}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        <img
          src={reward.image}
          alt={reward.name}
          loading="lazy"
          className="img-cover transition-transform duration-[1100ms] group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 bg-cream/95 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.16em]">
          0{index + 1}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.45rem] leading-tight">{reward.name}</h3>
        <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink/50">
          {reward.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[10px] uppercase tracking-[0.16em] text-ink/40">
            {formatZAR(reward.value)} value
          </span>
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={`text-[9.5px] uppercase tracking-[0.18em] transition-colors ${
              selected ? "text-champagne" : "text-ink/45 hover:text-ink"
            }`}
          >
            {selected ? "Selected" : "Choose this"}
          </button>
        </div>
      </div>
    </div>
  );
}
