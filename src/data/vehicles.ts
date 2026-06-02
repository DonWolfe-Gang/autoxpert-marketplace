export type VehicleType = "sedan" | "suv" | "motorcycle";
export type Condition = "excellent" | "good" | "fair";

export interface VehicleSpecs {
  engine: string;
  transmission: string;
  fuel: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  vin: string;
}

export interface Seller {
  name: string;
  rating: number;
  reviews: number;
  responseTime: string;
  memberSince: string;
}

export interface Vehicle {
  id: string;
  title: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  condition: Condition;
  image: string;
  gallery?: string[];
  verified: boolean;
  featured: boolean;
  description?: string;
  specs?: VehicleSpecs;
  seller?: Seller;
}

// ---------- Catalog ----------
const sedanModels: Record<string, string[]> = {
  Toyota: ["Camry SE", "Camry XLE", "Corolla LE", "Avalon Touring"],
  Honda: ["Civic Si", "Civic Touring", "Accord Sport", "Accord EX-L"],
  Mazda: ["Mazda3 Premium", "Mazda6 Grand Touring"],
  Hyundai: ["Elantra N-Line", "Sonata SEL"],
  Kia: ["K5 GT-Line", "Forte GT"],
  Nissan: ["Altima SR", "Maxima Platinum"],
  Ford: ["Mustang GT", "Mustang EcoBoost"],
  Chevrolet: ["Malibu LT", "Camaro SS"],
  BMW: ["330i", "M340i", "530i"],
  "Mercedes-Benz": ["C300", "E350", "CLA250"],
  Audi: ["A4 Premium", "A6 Quattro", "S3"],
  Lexus: ["IS 350", "ES 350"],
  Tesla: ["Model 3 Long Range", "Model S"],
};

const suvModels: Record<string, string[]> = {
  Toyota: ["RAV4 XLE", "Highlander Limited", "4Runner TRD"],
  Honda: ["CR-V EX", "Pilot Touring", "Passport Elite"],
  Mazda: ["CX-5 Turbo", "CX-9 Signature"],
  Hyundai: ["Tucson SEL", "Santa Fe Calligraphy"],
  Kia: ["Sportage X-Line", "Telluride SX"],
  Nissan: ["Rogue Platinum", "Pathfinder SL"],
  Ford: ["Escape Titanium", "Explorer XLT", "Bronco Wildtrak"],
  Chevrolet: ["Equinox RS", "Tahoe Z71"],
  Jeep: ["Wrangler Unlimited", "Grand Cherokee Limited", "Cherokee Trailhawk"],
  Subaru: ["Outback Touring", "Forester Wilderness"],
  BMW: ["X3 xDrive30i", "X5 xDrive40i"],
  "Mercedes-Benz": ["GLC 300", "GLE 350"],
  Audi: ["Q5 Premium", "Q7 Prestige"],
  Tesla: ["Model Y Long Range", "Model X"],
  Volvo: ["XC60 Recharge", "XC90 Inscription"],
};

const motoModels: Record<string, string[]> = {
  "Harley-Davidson": ["Sportster S", "Iron 883", "Fat Boy", "Street Glide"],
  Kawasaki: ["Ninja 650", "Ninja ZX-6R", "Z900", "Versys 1000"],
  Yamaha: ["MT-07", "YZF-R3", "Tenere 700", "MT-09"],
  Honda: ["CBR650R", "CB500X", "Rebel 1100", "Africa Twin"],
  Suzuki: ["GSX-R750", "SV650", "V-Strom 650"],
  Ducati: ["Monster 937", "Panigale V2", "Scrambler Icon", "Multistrada V4"],
  BMW: ["R 1250 GS", "S 1000 RR", "F 900 R"],
  KTM: ["Duke 390", "890 Adventure", "1290 Super Duke"],
  Triumph: ["Street Triple", "Bonneville T120", "Tiger 900"],
  "Royal Enfield": ["Continental GT 650", "Himalayan", "Meteor 350"],
};

const cities = [
  "Los Angeles, CA", "San Francisco, CA", "San Diego, CA", "Phoenix, AZ", "Las Vegas, NV",
  "Denver, CO", "Houston, TX", "Dallas, TX", "Austin, TX", "Miami, FL", "Orlando, FL",
  "Atlanta, GA", "Charlotte, NC", "Nashville, TN", "Chicago, IL", "Detroit, MI",
  "Minneapolis, MN", "Seattle, WA", "Portland, OR", "New York, NY", "Boston, MA",
  "Philadelphia, PA", "Washington, DC", "Salt Lake City, UT",
];

// ---------- Image resolution ----------
// LoremFlickr returns Flickr photos matching the given keywords, locked by a
// numeric seed so the same vehicle always renders the same image. This gives
// us make/model-accurate pictures (e.g. an Audi Q7 actually looks like a Q7)
// without bundling hundreds of static URLs per model.
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const typeKeyword: Record<VehicleType, string> = {
  sedan: "sedan,car",
  suv: "suv",
  motorcycle: "motorcycle",
};

const vehicleImage = (
  make: string,
  model: string,
  type: VehicleType,
  seed: number,
) => {
  // Strip trim suffixes (e.g. "Pilot Touring" -> "pilot") so Flickr matches the model itself.
  const baseModel = slug(model.split(/\s+/)[0]);
  const keywords = `${slug(make)},${baseModel},${typeKeyword[type]}`;
  return `https://loremflickr.com/800/600/${keywords}?lock=${seed}`;
};

const sellerNames = [
  "AutoXpert Certified Dealer", "Westside Auto Group", "Premier Motors",
  "Elite Pre-Owned", "Capital City Cars", "Skyline Auto", "Heritage Motorcars",
  "Pacific Auto Hub", "Sunrise Auto Sales", "Metro Drive",
];

const exteriorColors = ["Midnight Black", "Pearl White", "Steel Gray", "Deep Blue", "Crimson Red", "Silver Metallic", "Forest Green"];
const interiorColors = ["Charcoal", "Beige", "Black Leather", "Brown Nappa", "Ivory"];

// ---------- Deterministic PRNG ----------
const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = <T,>(arr: T[], r: number) => arr[Math.floor(r * arr.length) % arr.length];

const baseDescription = (v: { title: string; condition: Condition; mileage: number }) =>
  `This ${v.title} is in ${v.condition} condition with ${v.mileage.toLocaleString()} miles. Fully inspected by AutoXpert certified technicians, clean title, no accidents reported. Financing and trade-ins welcome.`;

const buildVin = (i: number) => `1HGCM82${(633000 + i).toString().padStart(6, "0")}A`;

const generate = (): Vehicle[] => {
  const rand = mulberry32(42);
  const list: Vehicle[] = [];
  let id = 1;

  const push = (
    type: VehicleType,
    makeModelMap: Record<string, string[]>,
    priceRange: [number, number],
    mileageRange: [number, number]
  ) => {
    for (const make of Object.keys(makeModelMap)) {
      for (const model of makeModelMap[make]) {
        const year = 2015 + Math.floor(rand() * 10); // 2015 – 2024
        const price = Math.round((priceRange[0] + rand() * (priceRange[1] - priceRange[0])) / 100) * 100;
        const mileage = Math.round((mileageRange[0] + rand() * (mileageRange[1] - mileageRange[0])) / 500) * 500;
        const conditionRoll = rand();
        const condition: Condition = conditionRoll > 0.7 ? "excellent" : conditionRoll > 0.3 ? "good" : "fair";
        const verified = rand() > 0.35;
        const featured = rand() > 0.78;
        const title = `${year} ${make} ${model}`;
        const image = vehicleImage(make, model, type, id * 10 + 1);
        const sellerName = pick(sellerNames, rand());
        const specs: VehicleSpecs = {
          engine: type === "motorcycle"
            ? pick(["650cc Parallel-Twin", "900cc Inline-4", "1200cc V-Twin", "390cc Single"], rand())
            : pick(["2.0L Turbo I4", "2.5L I4", "3.5L V6", "3.0L Turbo I6", "Electric Dual Motor"], rand()),
          transmission: type === "motorcycle" ? "6-Speed Manual" : pick(["Automatic", "CVT", "8-Speed Auto", "Manual"], rand()),
          fuel: pick(["Gasoline", "Gasoline", "Gasoline", "Hybrid", "Electric"], rand()),
          drivetrain: type === "motorcycle" ? "Chain" : pick(["FWD", "AWD", "RWD", "4WD"], rand()),
          exteriorColor: pick(exteriorColors, rand()),
          interiorColor: pick(interiorColors, rand()),
          vin: buildVin(id),
        };
        const seller: Seller = {
          name: sellerName,
          rating: Math.round((4 + rand()) * 10) / 10,
          reviews: 20 + Math.floor(rand() * 400),
          responseTime: pick(["Within 30 minutes", "Within 1 hour", "Within 2 hours", "Same day"], rand()),
          memberSince: `${2018 + Math.floor(rand() * 7)}`,
        };
        const v: Vehicle = {
          id: String(id++),
          title,
          type,
          make,
          model,
          year,
          price,
          mileage,
          location: pick(cities, rand()),
          condition,
          image,
          gallery: [
            image,
            vehicleImage(make, model, type, id * 10 + 2),
            vehicleImage(make, model, type, id * 10 + 3),
            vehicleImage(make, model, type, id * 10 + 4),
          ],
          verified,
          featured,
          specs,
          seller,
        };
        v.description = baseDescription(v);
        list.push(v);
      }
    }
  };

  push("sedan", sedanModels, [12000, 65000], [5000, 95000]);
  push("suv", suvModels, [16000, 78000], [4000, 90000]);
  push("motorcycle", motoModels, [4500, 22000], [500, 35000]);


  return list;
};

export const vehicles: Vehicle[] = generate();

export const makes = [...new Set(vehicles.map((v) => v.make))].sort();
export const vehicleTypes: VehicleType[] = ["sedan", "suv", "motorcycle"];
export const conditions: Condition[] = ["excellent", "good", "fair"];
