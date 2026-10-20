/**
 * Photography is served from Unsplash as an interim art direction.
 * Swap the `src` values for Crankified's own shoot when it is ready —
 * nothing else in the codebase needs to change.
 */
const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const images = {
  hero: unsplash("1560066984-138dadb4c035", 2000),
  heroDetail: unsplash("1605980776566-0486c3ac7617", 1200),
  studio: unsplash("1516975080664-ed2fc6a32937", 1400),
  hair: unsplash("1522337360788-8b13dee7a37e", 1200),
  lashes: unsplash("1583001931096-959e9a1a6223", 1200),
  nails: unsplash("1604654894610-df63bc536371", 1200),
  nailsDetail: unsplash("1632345031435-8727f6897d53", 1200),
  lifestyle: unsplash("1596704017254-9b121068fb31", 1400),
  iphone: unsplash("1592750475338-74b7b21085ab", 1200),
  iphoneAlt: unsplash("1511707171634-5f897ff02aa9", 1200),
  iphoneDetail: unsplash("1580910051074-3eb694886505", 1200),
  sneakers: unsplash("1549298916-b41d501d3772", 1200),
  sneakerRed: unsplash("1542291026-7eec264c27ff", 1200),
  sneakerStudio: unsplash("1552346154-21d32810aba3", 1200),
  sneakerStreet: unsplash("1460353581641-37baddab0fa2", 1200),
  audio: unsplash("1600294037681-c80b4cb5b434", 1200),
  watch: unsplash("1523275335684-37898b6baf30", 1200),
} as const;
