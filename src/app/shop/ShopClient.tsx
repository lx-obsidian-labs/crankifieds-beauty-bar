"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  productCategories,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { formatZAR } from "@/lib/format";
import { site, whatsappHref } from "@/lib/site";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Close,
  Instagram,
  Sparkle,
  WhatsApp,
} from "@/components/icons";

type Props = {
  products: Product[];
  initialCategory: ProductCategory | "all";
  initialProduct?: string;
};

type Form = { name: string; phone: string; email: string; notes: string };

type OrderResult = {
  reference: string;
  productName: string;
  price: number;
  optionValue: string | null;
};

export function ShopClient({ products, initialCategory, initialProduct }: Props) {
  const [category, setCategory] = useState<ProductCategory | "all">(initialCategory);
  const [condition, setCondition] = useState<"all" | "Brand new" | "Pre-owned">("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Product | null>(
    () => products.find((product) => product.id === initialProduct) ?? null,
  );
  const [option, setOption] = useState("");
  const [form, setForm] = useState<Form>({ name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (condition !== "all" && product.condition !== condition) return false;
      if (needle && !`${product.name} ${product.blurb}`.toLowerCase().includes(needle))
        return false;
      return true;
    });
  }, [products, category, condition, query]);

  const open = (product: Product) => {
    setActive(product);
    setOption(product.option?.values[0]?.label ?? "");
    setResult(null);
    setServerError("");
    setErrors({});
    setForm({ name: "", phone: "", email: "", notes: "" });
  };

  const close = () => {
    setActive(null);
    setResult(null);
  };

  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const price = active
    ? active.price +
      (active.option?.values.find((value) => value.label === option)?.priceDelta ?? 0)
    : 0;

  const whatsapp = whatsappHref(
    active ? `Hi Crankified's — I'd like to order the ${active.name}.` : undefined,
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!active) return;
    setServerError("");

    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) nextErrors.name = "Please tell us your name.";
    if (form.phone.replace(/\D/g, "").length < 9)
      nextErrors.phone = "Enter a phone number we can reach you on.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim()))
      nextErrors.email = "That email address does not look right.";
    if (active.option && !option) nextErrors.option = `Choose a ${active.option.label.toLowerCase()}.`;

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: active.id,
          optionValue: option,
          ...form,
        }),
      });
      const payload = (await response.json()) as {
        order?: OrderResult;
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !payload.order) {
        setErrors(payload.fields ?? {});
        setServerError(payload.error ?? "That did not go through. Please try again.");
        return;
      }
      setResult(payload.order);
    } catch {
      setServerError("We could not reach the studio. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="border-y border-line bg-[#f6f0e6]">
        <div className="shell flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {productCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
                className="chip"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              {(["all", "Brand new", "Pre-owned"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={condition === value}
                  onClick={() => setCondition(value)}
                  className="border-b border-transparent px-1 pb-1 text-[10px] uppercase tracking-[0.16em] text-ink/40 transition-colors hover:text-ink aria-pressed:border-champagne aria-pressed:text-ink"
                >
                  {value === "all" ? "All conditions" : value}
                </button>
              ))}
            </div>
            <label className="relative">
              <span className="sr-only">Search the vault</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the vault"
                className="w-full border border-line bg-cream px-4 py-2.5 text-[12px] placeholder:text-ink/35 focus:border-champagne focus:outline-none sm:w-52"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="shell py-12 md:py-16">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink/40">
            {filtered.length} piece{filtered.length === 1 ? "" : "s"}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink/40">
            {site.deliveryNote}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 border border-line bg-cream p-10 text-center">
            <p className="font-display text-2xl">Nothing in that corner yet.</p>
            <p className="mt-2 text-[13px] text-ink/55">
              Try another category, or send us a message — the vault moves quickly.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                setCondition("all");
                setQuery("");
              }}
              className="btn btn-ink mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, index) => (
              <article key={product.id} className="reveal group" data-delay={index % 3 === 2 ? "2" : index % 3 === 1 ? "1" : undefined}>
                <button
                  type="button"
                  onClick={() => open(product)}
                  className="block w-full text-left"
                  aria-label={`Order ${product.name}`}
                >
                  <div className="relative aspect-[5/6] overflow-hidden bg-[#efe8dc]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="img-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-1 text-[8.5px] uppercase tracking-[0.16em] ${
                          product.condition === "Brand new"
                            ? "bg-ink text-ivory"
                            : "bg-cream/95 text-ink"
                        }`}
                      >
                        {product.condition}
                        {product.grade ? ` · ${product.grade}` : ""}
                      </span>
                      {product.badge && (
                        <span className="bg-champagne px-2.5 py-1 text-[8.5px] uppercase tracking-[0.16em] text-ink">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-[1.4rem] leading-tight">{product.name}</h3>
                      <span className="shrink-0 font-display text-[1.1rem]">
                        {formatZAR(product.price)}
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-sm text-[12px] leading-relaxed text-ink/50">
                      {product.blurb}
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-ink/35">
                      {product.option ? `${product.option.label}s available` : "One size"}
                      <span className="text-champagne">/</span>
                      <span className="transition-colors group-hover:text-ink">Reserve</span>
                    </p>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close order panel"
            onClick={close}
            className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] animate-backdrop"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
            className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-cream animate-drawer"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-cream/95 px-5 py-4 backdrop-blur">
              <p className="label text-stone">The vault</p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center border border-line transition-colors hover:border-ink"
                aria-label="Close"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            {result ? (
              <div className="flex flex-1 flex-col justify-center px-6 py-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/50 bg-champagne/10">
                  <Check className="h-5 w-5 text-champagne" />
                </span>
                <p className="label mt-6 text-stone">Order request received</p>
                <h3 id="order-title" className="display mt-3 text-[2.4rem] leading-tight">
                  It&rsquo;s <span className="italic">in the book.</span>
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
                  We&rsquo;ll confirm stock and delivery on the number you gave us, then
                  arrange payment. Nothing has been charged.
                </p>

                <div className="mt-7 border border-line">
                  <div className="flex items-center justify-between border-b border-line p-4">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-ink/40">
                      Reference
                    </span>
                    <span className="font-display text-xl tracking-wide">
                      {result.reference}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-line p-4">
                    <span className="max-w-[60%] text-[13px]">{result.productName}</span>
                    <span className="text-[12px] text-ink/50">{result.optionValue}</span>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-ink/40">
                      Total
                    </span>
                    <span className="font-display text-xl">{formatZAR(result.price)}</span>
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink/40">
                  <Sparkle className="h-3 w-3 text-champagne" /> {site.deliveryNote}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button type="button" onClick={close} className="btn btn-ink">
                    Keep browsing <ArrowRight />
                  </button>
                  {whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      <WhatsApp /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-1 flex-col" noValidate>
                <div className="relative aspect-[16/11] overflow-hidden bg-[#efe8dc]">
                  <img src={active.image} alt={active.name} className="img-cover" />
                  <span className="absolute left-4 top-4 bg-ink px-2.5 py-1 text-[8.5px] uppercase tracking-[0.16em] text-ivory">
                    {active.condition}
                    {active.grade ? ` · ${active.grade}` : ""}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9.5px] uppercase tracking-[0.2em] text-ink/40">
                        {productCategories.find((item) => item.id === active.category)?.label}
                      </p>
                      <h3 id="order-title" className="mt-1.5 font-display text-[1.8rem] leading-tight">
                        {active.name}
                      </h3>
                    </div>
                    <p className="shrink-0 font-display text-2xl">{formatZAR(price)}</p>
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink/55">
                    {active.blurb}
                  </p>

                  <ul className="mt-4 space-y-1.5 border-y border-line py-4">
                    {active.specs.map((spec) => (
                      <li
                        key={spec}
                        className="flex items-start gap-2 text-[11.5px] text-ink/55"
                      >
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-champagne" />
                        {spec}
                      </li>
                    ))}
                  </ul>

                  {active.option && (
                    <div className="mt-5">
                      <p className="field-label">{active.option.label}</p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {active.option.values.map((value) => (
                          <button
                            key={value.label}
                            type="button"
                            aria-pressed={option === value.label}
                            onClick={() => setOption(value.label)}
                            className="chip !py-2 !text-[10px]"
                          >
                            {value.label}
                            {value.priceDelta ? ` (+${formatZAR(value.priceDelta)})` : ""}
                          </button>
                        ))}
                      </div>
                      {errors.option && (
                        <p className="mt-2 text-[11px] text-red-800">{errors.option}</p>
                      )}
                    </div>
                  )}

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <label className="field sm:col-span-2">
                      <span>Full name</span>
                      <input
                        className="input"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, name: event.target.value }))
                        }
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
                        value={form.phone}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, phone: event.target.value }))
                        }
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
                        value={form.email}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder="you@email.co.za"
                      />
                      {errors.email && (
                        <em className="text-[11px] not-italic text-red-800">{errors.email}</em>
                      )}
                    </label>
                    <label className="field sm:col-span-2">
                      <span>Anything else? (optional)</span>
                      <textarea
                        className="input"
                        rows={2}
                        value={form.notes}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, notes: event.target.value }))
                        }
                        placeholder="Another colour, a second item, or a delivery question."
                      />
                    </label>
                  </div>

                  {serverError && (
                    <div className="mt-5 border border-red-900/20 bg-red-900/5 p-3.5 text-[12px] text-red-900">
                      {serverError}
                    </div>
                  )}

                  <div className="mt-6">
                    <button type="submit" disabled={submitting} className="btn btn-ink w-full">
                      {submitting ? (
                        <>
                          <span className="spinner !border-ivory/30 !border-t-ivory" /> Sending…
                        </>
                      ) : (
                        <>
                          Request this piece <ArrowRight />
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-center text-[10.5px] leading-relaxed text-ink/40">
                      No payment online. We confirm stock, total and delivery first.
                    </p>
                  </div>

                  {whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink/45 hover:text-ink"
                    >
                      <WhatsApp className="h-3.5 w-3.5" /> Or ask on WhatsApp
                    </a>
                  )}
                  {!whatsapp && site.instagram && (
                    <a
                      href={site.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink/45 hover:text-ink"
                    >
                      <Instagram className="h-3.5 w-3.5" /> DM us on Instagram
                    </a>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
