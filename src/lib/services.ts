import { images } from "./images";

export type ServiceCategoryId = "hair" | "lashes" | "nails";

export type Service = {
  id: string;
  category: ServiceCategoryId;
  name: string;
  description: string;
  /** Minutes */
  duration: number;
  /** South African rand */
  price: number;
  from?: boolean;
  signature?: boolean;
};

export type ServiceCategory = {
  id: ServiceCategoryId;
  name: string;
  index: string;
  blurb: string;
  description: string;
  image: string;
  services: Service[];
};

export type AddOn = {
  id: string;
  name: string;
  price: number;
  duration: number;
  categories: ServiceCategoryId[];
};

export const addOns: AddOn[] = [
  {
    id: "bond-repair",
    name: "Bond repair treatment",
    price: 180,
    duration: 15,
    categories: ["hair"],
  },
  {
    id: "wand-finish",
    name: "Extra styling & wand finish",
    price: 150,
    duration: 20,
    categories: ["hair"],
  },
  {
    id: "extra-fullness",
    name: "Extra fullness",
    price: 120,
    duration: 20,
    categories: ["lashes"],
  },
  {
    id: "lash-tint",
    name: "Lash tint",
    price: 90,
    duration: 15,
    categories: ["lashes"],
  },
  {
    id: "brow-wax",
    name: "Brow wax & shape",
    price: 90,
    duration: 15,
    categories: ["lashes", "nails"],
  },
  {
    id: "nail-art",
    name: "Nail art (up to four nails)",
    price: 120,
    duration: 20,
    categories: ["nails"],
  },
  {
    id: "chrome-finish",
    name: "Chrome or cat-eye finish",
    price: 100,
    duration: 15,
    categories: ["nails"],
  },
  {
    id: "soak-off",
    name: "Soak-off removal",
    price: 80,
    duration: 20,
    categories: ["nails"],
  },
];

export const categories: ServiceCategory[] = [
  {
    id: "hair",
    name: "Hair",
    index: "01",
    blurb: "Braids, presses and installs with a finish that holds.",
    description:
      "Hair is the longest appointment in the chair and the one you live with every day. We start with the health of your scalp and ends, then build the shape around your face and your routine.",
    image: images.hair,
    services: [
      {
        id: "silk-press",
        category: "hair",
        name: "Silk Press & Finish",
        description:
          "Cleanse, bond treatment, blow-dry and a glass-finish press with movement. Built to survive Ermelo humidity.",
        duration: 90,
        price: 650,
        signature: true,
      },
      {
        id: "knotless-braids",
        category: "hair",
        name: "Knotless Braids",
        description:
          "Feather-light partings, no tension on the hairline and a clean, full finish. Length and density to your brief.",
        duration: 240,
        price: 1200,
        from: true,
      },
      {
        id: "frontal-install",
        category: "hair",
        name: "Frontal Install & Style",
        description:
          "Customisation, a melt that disappears and a styled finish that still looks like hair on day ten.",
        duration: 150,
        price: 950,
      },
      {
        id: "wig-revamp",
        category: "hair",
        name: "Wig Revamp",
        description:
          "Deep cleanse, condition, pluck, tint and restyle. Bring the unit back to something you want to wear.",
        duration: 120,
        price: 750,
      },
      {
        id: "colour-gloss",
        category: "hair",
        name: "Colour & Gloss",
        description:
          "Dimensional colour with bond protection and a mirror gloss. Consultation included; price depends on length and density.",
        duration: 180,
        price: 1450,
        from: true,
      },
      {
        id: "scalp-detox",
        category: "hair",
        name: "Scalp Detox & Steam",
        description:
          "Clarifying cleanse, steam and a long scalp massage. The reset before braids, colour or a install.",
        duration: 60,
        price: 480,
      },
      {
        id: "quick-weave",
        category: "hair",
        name: "Quick Weave & Style",
        description:
          "A polished, protective look for when the calendar is full and the mirror still has to behave.",
        duration: 120,
        price: 600,
      },
      {
        id: "kids-styling",
        category: "hair",
        name: "Kids Styling",
        description:
          "Gentle, patient styling for under-twelves. Wash, treatment and a finish that survives the playground.",
        duration: 45,
        price: 320,
      },
    ],
  },
  {
    id: "lashes",
    name: "Lashes",
    index: "02",
    blurb: "Classic to mega volume, mapped to your eye shape.",
    description:
      "Lash work is a study in restraint. We map the set to your eye shape and natural lash health, then build something that opens the face instead of weighing it down.",
    image: images.lashes,
    services: [
      {
        id: "classic-set",
        category: "lashes",
        name: "Classic Full Set",
        description:
          "One extension per natural lash for a clean, awake line. The everyday set.",
        duration: 120,
        price: 450,
      },
      {
        id: "hybrid-set",
        category: "lashes",
        name: "Hybrid Set",
        description:
          "Classic fans with a soft volume mix — texture without the weight.",
        duration: 135,
        price: 600,
      },
      {
        id: "volume-set",
        category: "lashes",
        name: "Volume Set",
        description:
          "Handmade fans for density and a soft, full finish. Our most requested set.",
        duration: 150,
        price: 750,
        signature: true,
      },
      {
        id: "mega-volume",
        category: "lashes",
        name: "Mega Volume",
        description:
          "Maximum density, still mapped to the eye. For the full-glam brief.",
        duration: 180,
        price: 900,
      },
      {
        id: "infills",
        category: "lashes",
        name: "Infills",
        description:
          "A refresh for sets between two and three weeks old. Please arrive with clean lashes.",
        duration: 60,
        price: 250,
      },
      {
        id: "lash-lift",
        category: "lashes",
        name: "Lash Lift & Tint",
        description:
          "Your own lashes, lifted and darkened. No extensions, no daily curling.",
        duration: 60,
        price: 380,
      },
      {
        id: "brow-lamination",
        category: "lashes",
        name: "Brow Lamination & Shape",
        description:
          "Brushed-up, even brows with a shape mapped to your features.",
        duration: 45,
        price: 350,
      },
      {
        id: "lash-removal",
        category: "lashes",
        name: "Lash Removal",
        description:
          "A careful, non-damaging removal with a conditioning finish.",
        duration: 30,
        price: 120,
      },
    ],
  },
  {
    id: "nails",
    name: "Nails",
    index: "03",
    blurb: "Structured gel, acrylic and detail work that lasts.",
    description:
      "A good set is engineering, not decoration. We prep properly, build structure where the nail needs it, and finish with detail that still looks intentional at week three.",
    image: images.nails,
    services: [
      {
        id: "gel-manicure",
        category: "nails",
        name: "Gel Manicure",
        description:
          "Cuticle work, shaping and a long-wear gel colour on your natural nails.",
        duration: 60,
        price: 280,
      },
      {
        id: "acrylic-short",
        category: "nails",
        name: "Acrylic Full Set — Short",
        description:
          "A clean, structured set with a natural length and a glossy finish.",
        duration: 90,
        price: 400,
      },
      {
        id: "acrylic-long",
        category: "nails",
        name: "Acrylic Full Set — Long",
        description:
          "Coffin, almond or square. Extended length built with a strong apex so it lasts.",
        duration: 120,
        price: 480,
        signature: true,
      },
      {
        id: "builder-overlay",
        category: "nails",
        name: "Builder Gel Overlay",
        description:
          "Strength and shape over your own nails — the gentler route to length.",
        duration: 75,
        price: 350,
      },
      {
        id: "structured-french",
        category: "nails",
        name: "Structured Gel French",
        description:
          "The French, rebuilt with structure and a crisp, hand-painted smile line.",
        duration: 90,
        price: 420,
      },
      {
        id: "gel-pedicure",
        category: "nails",
        name: "Gel Pedicure",
        description:
          "Full pedicure, shaping and a gel colour that outlasts the holiday.",
        duration: 75,
        price: 330,
      },
      {
        id: "toe-acrylics",
        category: "nails",
        name: "Toe Acrylics",
        description:
          "Length and shape on the toes, finished to match your set.",
        duration: 60,
        price: 300,
      },
      {
        id: "nail-art",
        category: "nails",
        name: "Nail Art & Chrome",
        description:
          "Hand-painted detail, chrome, cat-eye or a mix. Priced for a full set of art.",
        duration: 30,
        price: 150,
      },
    ],
  },
];

export type Reward = {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  value: number;
  image: string;
};

export const rewards: Reward[] = [
  {
    id: "reward-silk-press",
    serviceId: "silk-press",
    name: "Signature Silk Press",
    description: "The full cleanse, treatment and glass-finish press.",
    value: 650,
    image: images.hair,
  },
  {
    id: "reward-volume",
    serviceId: "volume-set",
    name: "Volume Lash Set",
    description: "Handmade fans, mapped to your eye shape.",
    value: 750,
    image: images.lashes,
  },
  {
    id: "reward-acrylic",
    serviceId: "acrylic-long",
    name: "Full Acrylic Set with Art",
    description: "Extended length, shaped and finished with hand-painted detail.",
    value: 630,
    image: images.nails,
  },
];

export const allServices: Service[] = categories.flatMap((c) => c.services);

export const getService = (id: string) => allServices.find((s) => s.id === id);

export const getCategory = (id: ServiceCategoryId) =>
  categories.find((c) => c.id === id)!;

export const addOnsFor = (category: ServiceCategoryId) =>
  addOns.filter((a) => a.categories.includes(category));

export const resolveSelection = (serviceId: string, addOnIds: string[] = []) => {
  const service = getService(serviceId);
  if (!service) return null;
  const validAddOns = addOnIds
    .map((id) => addOns.find((a) => a.id === id))
    .filter((a): a is AddOn => Boolean(a) && a!.categories.includes(service.category));
  const duration =
    service.duration + validAddOns.reduce((total, addOn) => total + addOn.duration, 0);
  const price = service.price + validAddOns.reduce((total, addOn) => total + addOn.price, 0);
  return { service, addOns: validAddOns, duration, price };
};
