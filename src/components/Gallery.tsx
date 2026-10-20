import { images } from "@/lib/images";

type Props = {
  items: { src: string; alt: string; label: string; caption: string }[];
};

/**
 * Editorial image strip: alternating aspect ratios, hairline framing and a
 * caption that slides in on hover. Layout only — the data lives at the call site.
 */
export function Gallery({ items }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {items.map((item, index) => (
        <figure
          key={item.src}
          className={`reveal group relative overflow-hidden bg-ink/10 ${
            index % 2 === 1 ? "aspect-[3/4] lg:aspect-[3/4.4]" : "aspect-[3/4] lg:aspect-[3/4]"
          }`}
          data-delay={index > 3 ? undefined : index + 1}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className="img-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,10,9,0)40%,rgba(11,10,9,0.82)_100%)] transition-opacity duration-700 group-hover:opacity-95"
            aria-hidden="true"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <p className="text-[9px] uppercase tracking-[0.26em] text-champagne-light">
              {item.label}
            </p>
            <p className="mt-1.5 font-display text-lg leading-tight text-ivory md:text-xl">
              {item.caption}
            </p>
          </figcaption>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border border-ivory/10 transition-colors duration-700 group-hover:border-champagne/45"
          />
        </figure>
      ))}
    </div>
  );
}

export const galleryItems = [
  {
    src: images.hair,
    alt: "Silk press and styled finish in the studio",
    label: "Hair",
    caption: "Presses that hold their shape.",
  },
  {
    src: images.lashes,
    alt: "Volume lash set with hand-made fans",
    label: "Lashes",
    caption: "Mapped to your eye shape.",
  },
  {
    src: images.nails,
    alt: "Structured gel French manicure",
    label: "Nails",
    caption: "Crisp lines, strong structure.",
  },
  {
    src: images.lifestyle,
    alt: "The studio prepared for a private appointment",
    label: "The Studio",
    caption: "One client at a time.",
  },
];
