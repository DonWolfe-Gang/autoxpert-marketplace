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
  "Harley-Davidson": ["Sportster S", "Iron 883", "Fat Boy"],
  Kawasaki: ["Ninja 650", "Ninja ZX-6R", "Z900"],
  Yamaha: ["MT-07", "YZF-R3", "Tenere 700"],
  Honda: ["CBR650R", "CB500X", "Rebel 1100"],
  Suzuki: ["GSX-R750", "SV650"],
  Ducati: ["Monster 937", "Panigale V2", "Scrambler Icon"],
  BMW: ["R 1250 GS", "S 1000 RR"],
  KTM: ["Duke 390", "890 Adventure"],
  Triumph: ["Street Triple", "Bonneville T120"],
  "Royal Enfield": ["Continental GT 650", "Himalayan"],
};

const cities = [
  "Los Angeles, CA", "San Francisco, CA", "San Diego, CA", "Phoenix, AZ", "Las Vegas, NV",
  "Denver, CO", "Houston, TX", "Dallas, TX", "Austin, TX", "Miami, FL", "Orlando, FL",
  "Atlanta, GA", "Charlotte, NC", "Nashville, TN", "Chicago, IL", "Detroit, MI",
  "Minneapolis, MN", "Seattle, WA", "Portland, OR", "New York, NY", "Boston, MA",
  "Philadelphia, PA", "Washington, DC", "Salt Lake City, UT",
];

const sedanImgs = [
  "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop",
];
const suvImgs = [
  "https://images.unsplash.com/photo-1568844293986-8d0400f085d1?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1597007030739-6d2e7172ee7a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&h=600&fit=crop",
];
const motoImgs = [
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517846693598-3c4b1f129a3d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611241443322-b5c9c9d8d8b0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=800&h=600&fit=crop",
];

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
    imgs: string[],
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
        const image = pick(imgs, rand());
        const title = `${year} ${make} ${model}`;
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
          gallery: [image, pick(imgs, rand()), pick(imgs, rand()), pick(imgs, rand())],
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

  push("sedan", sedanModels, sedanImgs, [12000, 65000], [5000, 95000]);
  push("suv", suvModels, suvImgs, [16000, 78000], [4000, 90000]);
  push("motorcycle", motoModels, motoImgs, [4500, 22000], [500, 35000]);

  return list;
};

export const vehicles: Vehicle[] = generate();

export const makes = [...new Set(vehicles.map((v) => v.make))].sort();
export const vehicleTypes: VehicleType[] = ["sedan", "suv", "motorcycle"];
export const conditions: Condition[] = ["excellent", "good", "fair"];
