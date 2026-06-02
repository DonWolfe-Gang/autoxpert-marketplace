// Telegram webhook: receives updates from connected groups, persists raw
// messages, parses car-listing details, and inserts into car_listings.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

async function deriveTelegramWebhookSecret(telegramApiKey: string): Promise<string> {
  const data = new TextEncoder().encode(`telegram-webhook:${telegramApiKey}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function safeEqual(a: string | null, b: string): boolean {
  if (!a || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---------- Parser ----------
interface ParsedListing {
  title: string;
  price: number | null;
  currency: string;
  description: string;
  location: string | null;
  contact: string | null;
  vehicle_type: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  mileage: number | null;
}

const KNOWN_MAKES = [
  "toyota","honda","mazda","hyundai","kia","nissan","ford","chevrolet","chevy",
  "bmw","mercedes","mercedes-benz","audi","lexus","tesla","jeep","subaru","volvo",
  "harley-davidson","harley","kawasaki","yamaha","suzuki","ducati","ktm","triumph",
  "royal enfield","volkswagen","vw","porsche","mitsubishi","acura","infiniti",
];

const TYPE_KEYWORDS: Record<string, string> = {
  sedan: "sedan", saloon: "sedan",
  suv: "suv", crossover: "suv", "4x4": "suv",
  motorcycle: "motorcycle", bike: "motorcycle", motorbike: "motorcycle",
};

function parseListing(text: string): ParsedListing | null {
  if (!text || text.trim().length < 10) return null;
  const lower = text.toLowerCase();

  // Year (1990–current+1)
  const currentYear = new Date().getFullYear() + 1;
  const yearMatch = text.match(/\b(19[9]\d|20\d{2})\b/);
  const year = yearMatch && +yearMatch[1] <= currentYear ? +yearMatch[1] : null;

  // Price: $12,500 / 12500 usd / Price: 15000
  let price: number | null = null;
  let currency = "USD";
  const priceMatch =
    text.match(/(?:price[:\s]+|\$)\s*([\d,]+(?:\.\d+)?)\s*(usd|eur|gbp|ngn|kes|zar)?/i) ||
    text.match(/([\d,]+(?:\.\d+)?)\s*(usd|eur|gbp|ngn|kes|zar)\b/i);
  if (priceMatch) {
    const n = Number(priceMatch[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n >= 100) price = n;
    if (priceMatch[2]) currency = priceMatch[2].toUpperCase();
  }

  // Mileage
  const mileageMatch = text.match(/([\d,]+)\s*(?:km|mi|miles|kilometers?|kms)\b/i);
  const mileage = mileageMatch ? Number(mileageMatch[1].replace(/,/g, "")) : null;

  // Make
  let make: string | null = null;
  for (const m of KNOWN_MAKES) {
    if (new RegExp(`\\b${m.replace(/[-]/g, "[- ]?")}\\b`, "i").test(lower)) {
      make = m === "chevy" ? "Chevrolet" : m === "vw" ? "Volkswagen" : m === "harley" ? "Harley-Davidson" : m === "mercedes" ? "Mercedes-Benz" : m.replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    }
  }

  // Model: token immediately after make (best-effort)
  let model: string | null = null;
  if (make) {
    const re = new RegExp(`${make.split(/[- ]/)[0]}\\s+([A-Za-z0-9-]+(?:\\s+[A-Za-z0-9-]+)?)`, "i");
    const mm = text.match(re);
    if (mm) model = mm[1].trim();
  }

  // Vehicle type
  let vehicle_type: string | null = null;
  for (const [k, v] of Object.entries(TYPE_KEYWORDS)) {
    if (lower.includes(k)) { vehicle_type = v; break; }
  }

  // Location: "Location: ..." line
  const locMatch = text.match(/(?:location|city|based in)[:\s]+([^\n,]+)/i);
  const location = locMatch ? locMatch[1].trim().slice(0, 120) : null;

  // Contact: phone or @handle
  const phoneMatch = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
  const handleMatch = text.match(/@([A-Za-z0-9_]{4,})/);
  const contact = phoneMatch?.[1] ?? (handleMatch ? `@${handleMatch[1]}` : null);

  // Title: first non-empty line, or year + make + model
  const firstLine = text.split("\n").map((l) => l.trim()).find((l) => l.length > 0) ?? "";
  const composed = [year, make, model].filter(Boolean).join(" ");
  const title = (composed || firstLine).slice(0, 160) || "Untitled listing";

  // Require at least one strong signal
  if (!price && !make && !year) return null;

  return {
    title,
    price,
    currency,
    description: text.slice(0, 4000),
    location,
    contact,
    vehicle_type,
    make,
    model,
    year,
    mileage,
  };
}

// ---------- Image extraction ----------
async function getTelegramFileUrl(fileId: string, apiKey: string, lovableKey: string): Promise<string | null> {
  try {
    const res = await fetch(`${GATEWAY_URL}/getFile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_id: fileId }),
    });
    const json = await res.json();
    if (!res.ok || !json?.result?.file_path) return null;
    return `${GATEWAY_URL}/file/${json.result.file_path}`;
  } catch {
    return null;
  }
}

function extractPhotoFileIds(message: any): string[] {
  const ids: string[] = [];
  if (Array.isArray(message?.photo) && message.photo.length > 0) {
    // largest variant is last
    ids.push(message.photo[message.photo.length - 1].file_id);
  }
  return ids;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!TELEGRAM_API_KEY || !LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const expected = await deriveTelegramWebhookSecret(TELEGRAM_API_KEY);
  if (!safeEqual(req.headers.get("X-Telegram-Bot-Api-Secret-Token"), expected)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let update: any;
  try { update = await req.json(); }
  catch { return new Response(JSON.stringify({ ok: true, ignored: true }), { status: 200 }); }

  const message =
    update.message ?? update.edited_message ?? update.channel_post ?? update.edited_channel_post;
  if (!message?.chat?.id || typeof update.update_id !== "number") {
    return new Response(JSON.stringify({ ok: true, ignored: true }));
  }

  const text: string = message.caption ?? message.text ?? "";

  // 1) Persist raw update (idempotent)
  const { error: rawErr } = await supabase.from("telegram_messages").upsert(
    {
      update_id: update.update_id,
      chat_id: message.chat.id,
      chat_title: message.chat.title ?? null,
      user_id: message.from?.id ?? null,
      username: message.from?.username ?? null,
      text,
      raw_update: update,
    },
    { onConflict: "update_id" },
  );
  if (rawErr) console.error("telegram_messages upsert failed:", rawErr);

  // 2) Parse + insert listing if it looks like one
  const parsed = parseListing(text);
  if (parsed) {
    // Resolve image URLs (best-effort)
    const fileIds = extractPhotoFileIds(message);
    const imageUrls: string[] = [];
    for (const fid of fileIds) {
      const url = await getTelegramFileUrl(fid, TELEGRAM_API_KEY, LOVABLE_API_KEY);
      if (url) imageUrls.push(url);
    }

    const { error: listingErr } = await supabase.from("car_listings").upsert(
      {
        ...parsed,
        images: imageUrls,
        source: "telegram",
        source_chat_id: message.chat.id,
        source_message_id: message.message_id,
        raw_text: text,
      },
      { onConflict: "source,source_chat_id,source_message_id" },
    );
    if (listingErr) {
      console.error("car_listings upsert failed:", listingErr);
    } else {
      await supabase
        .from("telegram_messages")
        .update({ processed: true })
        .eq("update_id", update.update_id);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
