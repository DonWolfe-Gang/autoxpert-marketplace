export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Buying Guide" | "Maintenance" | "Reviews" | "Tips";
  readTime: string;
  date: string;
  author: string;
  image: string;
  content: string[];
}

export const articles: Article[] = [
  {
    id: "1",
    slug: "first-time-used-car-buyer-checklist",
    title: "The First-Time Used Car Buyer's Checklist",
    excerpt:
      "Ten essential checks before you hand over the money — from VIN history to a proper test drive routine.",
    category: "Buying Guide",
    readTime: "6 min",
    date: "May 28, 2026",
    author: "Maya Rivera",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=700&fit=crop",
    content: [
      "Buying your first used car can feel overwhelming. Use this checklist to slow down and inspect every dimension that matters.",
      "Start with the paperwork: title, registration, and a full VIN history report. Anything missing here is a red flag worth walking away from.",
      "Then inspect the body, tires, and underbody for rust or repaint. Bring a magnet for steel panels — it won't stick to filler.",
      "Finally, take a 20-minute test drive on mixed roads. Listen for vibrations at highway speed and how the brakes feel under firm pressure.",
    ],
  },
  {
    id: "2",
    slug: "sedan-vs-suv-which-fits-you",
    title: "Sedan vs SUV: Which One Actually Fits Your Life?",
    excerpt:
      "Cost of ownership, real-world fuel economy, and the lifestyle questions most buyers skip.",
    category: "Buying Guide",
    readTime: "8 min",
    date: "May 22, 2026",
    author: "Daniel Cho",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=700&fit=crop",
    content: [
      "The sedan-vs-SUV debate has shifted. Modern crossovers close the fuel-economy gap, but sedans still win on handling and price.",
      "Think honestly about your week: how often do you actually need cargo space or all-wheel drive? Insurance and tires cost more on SUVs.",
      "If your commute is mostly highway and your family is small, a midsize sedan often delivers the best total cost of ownership.",
    ],
  },
  {
    id: "3",
    slug: "motorcycle-maintenance-monthly",
    title: "Monthly Motorcycle Maintenance in 30 Minutes",
    excerpt:
      "A simple T-CLOCS-inspired routine to keep your bike safe, smooth, and resale-ready.",
    category: "Maintenance",
    readTime: "5 min",
    date: "May 14, 2026",
    author: "Priya Shah",
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&h=700&fit=crop",
    content: [
      "Thirty minutes a month keeps small problems from becoming roadside emergencies. Run through tires, controls, lights, oil, chassis, and stands.",
      "Check tire pressure cold, look for uneven wear, and squeeze the brake lever for firmness. Lubricate the chain after every wash.",
      "Document each check in a notebook — buyers pay more for bikes with a visible maintenance history.",
    ],
  },
  {
    id: "4",
    slug: "negotiating-private-seller",
    title: "How to Negotiate With a Private Seller (Without Insulting Them)",
    excerpt:
      "Use evidence-based offers and the silent pause to land a fair price every time.",
    category: "Tips",
    readTime: "4 min",
    date: "May 6, 2026",
    author: "Marcus Webb",
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=700&fit=crop",
    content: [
      "Anchor your offer in data: comparable listings, repair quotes, and the vehicle history report.",
      "Lead with what you appreciate about the car before naming a number. People sell faster to buyers they like.",
      "Then state your offer once and stop talking. Silence is the most underused negotiation tool.",
    ],
  },
  {
    id: "5",
    slug: "ev-vs-hybrid-2026",
    title: "EV vs Hybrid in 2026: Where the Numbers Land",
    excerpt:
      "Charging infrastructure, battery health, and resale value compared head to head.",
    category: "Reviews",
    readTime: "9 min",
    date: "Apr 29, 2026",
    author: "Lena Park",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=700&fit=crop",
    content: [
      "EVs have crossed a tipping point in most metro areas, but hybrids still win for rural commuters and apartment dwellers without home charging.",
      "Battery degradation on 2020+ EVs is averaging under 2% per year — much better than early skeptics predicted.",
      "Resale on used EVs is finally stabilizing as buyers learn to read battery state-of-health reports.",
    ],
  },
  {
    id: "6",
    slug: "winter-prep-suv",
    title: "Winter Prep for Your SUV: 7 Things Most Owners Forget",
    excerpt:
      "Beyond snow tires — battery load tests, washer fluid ratings, and weight distribution.",
    category: "Maintenance",
    readTime: "5 min",
    date: "Apr 18, 2026",
    author: "Daniel Cho",
    image:
      "https://images.unsplash.com/photo-1551830820-330a71b99659?w=1200&h=700&fit=crop",
    content: [
      "Cold weather exposes weak batteries fast. Get a free load test before the first freeze.",
      "Switch to winter-rated washer fluid down to -30°F — the cheap blue stuff will freeze the moment you spray it.",
      "Carry 40-60 lbs over the rear axle if you drive RWD. Sandbags or a toolbox work fine.",
    ],
  },
];

export const articleCategories = [
  "All",
  "Buying Guide",
  "Maintenance",
  "Reviews",
  "Tips",
] as const;
