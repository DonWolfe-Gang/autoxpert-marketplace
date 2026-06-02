// Deterministic make + model + trim → image resolver.
//
// For every listing we build an ORDERED list of image-source candidates.
// <SmartImage> walks the list, advancing to the next source whenever an
// image fails to load. This guarantees:
//   1. The most accurate make/model photo we have is tried first.
//   2. If a specific model lookup fails (network, dead link, no Flickr
//      match) we fall back to the make + type, then to a typed stock
//      image, then to a guaranteed-render text placeholder.

import type { VehicleType } from "./vehicles";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Strip trim/edition suffixes so "Q7 Prestige" → "q7", "Pilot Touring" → "pilot",
// "Civic Si" → "civic-si" (keep short trim tokens that ARE the model).
const TRIM_TOKENS = new Set([
  "prestige", "premium", "platinum", "limited", "touring", "signature",
  "calligraphy", "wildtrak", "trailhawk", "inscription", "recharge",
  "z71", "xle", "ex-l", "ex", "se", "sel", "sx", "lt", "sr", "gt-line",
  "n-line", "x-line", "xdrive30i", "xdrive40i", "quattro", "long-range",
  "trd", "rs", "elite", "passport", "unlimited", "wilderness",
]);

const normalizeModel = (model: string) => {
  const tokens = model.split(/\s+/).map(slug);
  const kept = tokens.filter((t, i) => i === 0 || !TRIM_TOKENS.has(t));
  return kept.join("-");
};

// Manual overrides: stable Unsplash photo IDs for popular models that
// Flickr keyword search doesn't reliably nail.  Each entry maps the
// `make|normalizedModel` key to one or more Unsplash photo IDs.
//
// Add to this map any time we identify a listing that consistently
// returns the wrong picture.  Multiple IDs become extra fallbacks
// after the model-specific Flickr attempt.
const UNSPLASH = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const MODEL_OVERRIDES: Record<string, string[]> = {
  "honda|pilot": [UNSPLASH("photo-1606016159991-dfe4f2746ad5")],
  "audi|q7": [UNSPLASH("photo-1606664515524-ed2f786a0bd6")],
  "audi|q5": [UNSPLASH("photo-1614162692292-7ac56d7f7f1e")],
  "tesla|model-3": [UNSPLASH("photo-1560958089-b8a1929cea89")],
  "tesla|model-y": [UNSPLASH("photo-1617788138017-80ad40651399")],
  "tesla|model-s": [UNSPLASH("photo-1554744512-d6c603f27c54")],
  "ford|mustang": [UNSPLASH("photo-1494976388531-d1058494cdd8")],
  "ford|bronco": [UNSPLASH("photo-1626668893632-6f3a4466d109")],
  "jeep|wrangler": [UNSPLASH("photo-1533473359331-0135ef1b58bf")],
  "jeep|grand-cherokee": [UNSPLASH("photo-1606577924006-27d39b132ae2")],
  "toyota|camry": [UNSPLASH("photo-1621007947382-bb3c3994e3fb")],
  "toyota|4runner": [UNSPLASH("photo-1605559424843-9e4c228bf1c2")],
  "toyota|rav4": [UNSPLASH("photo-1581540222194-0def2dda95b8")],
  "bmw|x5": [UNSPLASH("photo-1556189250-72ba954cfc2b")],
  "mercedes-benz|c300": [UNSPLASH("photo-1617469767053-d3b523a0b982")],
  "harley-davidson|street-glide": [UNSPLASH("photo-1568772585407-9361f9bf3a87")],
  "harley-davidson|iron-883": [UNSPLASH("photo-1558981403-c5f9899a28bc")],
  "kawasaki|ninja": [UNSPLASH("photo-1568708936044-7c5e9b5d8e84")],
  "yamaha|mt-09": [UNSPLASH("photo-1611241893603-3c359704e0ee")],
  "ducati|panigale": [UNSPLASH("photo-1591293836027-e05b48473b67")],
};

// Generic, typed stock images for the second-to-last fallback layer.
const TYPE_STOCK: Record<VehicleType, string[]> = {
  sedan: [
    UNSPLASH("photo-1503376780353-7e6692767b70"),
    UNSPLASH("photo-1552519507-da3b142c6e3d"),
    UNSPLASH("photo-1542362567-b07e54358753"),
  ],
  suv: [
    UNSPLASH("photo-1519641471654-76ce0107ad1b"),
    UNSPLASH("photo-1494976388531-d1058494cdd8"),
    UNSPLASH("photo-1606664515524-ed2f786a0bd6"),
  ],
  motorcycle: [
    UNSPLASH("photo-1568772585407-9361f9bf3a87"),
    UNSPLASH("photo-1558981806-ec527fa84c39"),
    UNSPLASH("photo-1568708936044-7c5e9b5d8e84"),
  ],
};

const TYPE_KEYWORD: Record<VehicleType, string> = {
  sedan: "sedan,car",
  suv: "suv,car",
  motorcycle: "motorcycle",
};

const flickr = (keywords: string, seed: number) =>
  `https://loremflickr.com/800/600/${keywords}?lock=${seed}`;

// Guaranteed-render text placeholder. Even if every network image fails,
// the user still sees the make + model rendered clearly.
const textPlaceholder = (make: string, model: string) => {
  const text = encodeURIComponent(`${make}\n${model}`);
  return `https://placehold.co/800x600/0f172a/f8fafc/png?text=${text}&font=inter`;
};

/**
 * Build the ordered candidate chain for a single image slot.
 * Validation = SmartImage's onError handler walks this list until one
 * source resolves successfully.
 */
export const imageCandidates = (
  make: string,
  model: string,
  type: VehicleType,
  seed: number,
): string[] => {
  const makeSlug = slug(make);
  const modelSlug = normalizeModel(model);
  const key = `${makeSlug}|${modelSlug}`;
  const overrides = MODEL_OVERRIDES[key] ?? [];
  const typeStock = TYPE_STOCK[type];
  const stockPick = typeStock[seed % typeStock.length];

  const chain = [
    ...overrides,
    flickr(`${makeSlug},${modelSlug},${TYPE_KEYWORD[type]}`, seed),
    flickr(`${makeSlug},${TYPE_KEYWORD[type]}`, seed + 1),
    flickr(TYPE_KEYWORD[type], seed + 2),
    stockPick,
    textPlaceholder(make, model),
  ];

  // De-duplicate while preserving order.
  return [...new Set(chain)];
};
