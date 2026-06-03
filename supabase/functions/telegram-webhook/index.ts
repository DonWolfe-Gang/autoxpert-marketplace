// Telegram webhook: receives updates from connected groups, persists raw
// messages, parses car-listing details, downloads photos through the
// Telegram connector gateway, uploads them to Supabase Storage, and
// inserts the listing with public image URLs.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const IMAGE_BUCKET = "listing-images";

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

  const currentYear = new Date().getFullYear() + 1;
  const yearMatch = text.match(/\b(19[9]\d|20\d{2})\b/);
  const year = yearMatch && +yearMatch[1] <= currentYear ? +yearMatch[1] : null;

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

  const mileageMatch = text.match(/([\d,]+)\s*(?:km|mi|miles|kilometers?|kms)\b/i);
  const mileage = mileageMatch ? Number(mileageMatch[1].replace(/,/g, "")) : null;

  let make: string | null = null;
  for (const m of KNOWN_MAKES) {
    if (new RegExp(`\\b${m.replace(/[-]/g, "[- ]?")}\\b`, "i").test(lower)) {
      make = m === "chevy" ? "Chevrolet" : m === "vw" ? "Volkswagen" : m === "harley" ? "Harley-Davidson" : m === "mercedes" ? "Mercedes-Benz" : m.replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    }
  }

  let model: string | null = null;
  if (make) {
    const re = new RegExp(`${make.split(/[- ]/)[0]}\\s+([A-Za-z0-9-]+(?:\\s+[A-Za-z0-9-]+)?)`, "i");
    const mm = text.match(re);
    if (mm) model = mm[1].trim();
  }

  let vehicle_type: string | null = null;
  for (const [k, v] of Object.entries(TYPE_KEYWORDS)) {
    if (lower.includes(k)) { vehicle_type = v; break; }
  }

  const locMatch = text.match(/(?:location|city|based in)[:\s]+([^\n,]+)/i);
  const location = locMatch ? locMatch[1].trim().slice(0, 120) : null;

  const phoneMatch = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
  const handleMatch = text.match(/@([A-Za-z0-9_]{4,})/);
  const contact = phoneMatch?.[1] ?? (handleMatch ? `@${handleMatch[1]}` : null);

  const firstLine = text.split("\n").map((l) => l.trim()).find((l) => l.length > 0) ?? "";
  const composed = [year, make, model].filter(Boolean).join(" ");
  const title = (composed || firstLine).slice(0, 160) || "Untitled listing";

  if (!price && !make && !year) return null;

  return { title, price, currency, description: text.slice(0, 4000), location, contact, vehicle_type, make, model, year, mileage };
}

// ---------- Image pipeline ----------
interface TelegramPhoto { file_id: string; file_unique_id: string; width?: number; height?: number; }

/**
 * Extract every distinct photo in a message. Telegram sends each photo as an
 * array of size variants — keep the largest variant of each unique image.
 * Also handles media groups (album messages arrive one-by-one but share
 * media_group_id; we still process each individually here).
 */
function extractPhotos(message: any): TelegramPhoto[] {
  const out: TelegramPhoto[] = [];
  if (Array.isArray(message?.photo) && message.photo.length > 0) {
    // pick the largest variant (last in array per Telegram spec)
    out.push(message.photo[message.photo.length - 1]);
  }
  // Some clients send a single image as a document with image/* mime type
  if (message?.document?.mime_type?.startsWith("image/") && message.document.file_id) {
    out.push({ file_id: message.document.file_id, file_unique_id: message.document.file_unique_id });
  }
  return out;
}

async function telegramGetFilePath(fileId: string, telegramKey: string, lovableKey: string): Promise<string | null> {
  try {
    const res = await fetch(`${GATEWAY_URL}/getFile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": telegramKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_id: fileId }),
    });
    const json = await res.json();
    if (!res.ok || !json?.result?.file_path) {
      console.error("getFile failed:", res.status, json);
      return null;
    }
    return json.result.file_path as string;
  } catch (e) {
    console.error("getFile threw:", e);
    return null;
  }
}

async function telegramDownloadFile(filePath: string, telegramKey: string, lovableKey: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  try {
    const res = await fetch(`${GATEWAY_URL}/file/${filePath}`, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": telegramKey,
      },
    });
    if (!res.ok) {
      console.error("file download failed:", res.status);
      return null;
    }
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const bytes = new Uint8Array(await res.arrayBuffer());
    return { bytes, contentType };
  } catch (e) {
    console.error("file download threw:", e);
    return null;
  }
}

function extFromContentType(ct: string): string {
  if (ct.includes("png")) return "png";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("gif")) return "gif";
  return "jpg";
}

/**
 * Download a Telegram photo, upload to storage, return the public URL.
 * Uses file_unique_id for a deterministic, idempotent storage path so the
 * same photo across retries / edits never produces duplicates.
 */
async function ingestPhoto(
  supabase: any,
  photo: TelegramPhoto,
  chatId: number,
  telegramKey: string,
  lovableKey: string,
): Promise<string | null> {
  const filePath = await telegramGetFilePath(photo.file_id, telegramKey, lovableKey);
  if (!filePath) return null;

  const dl = await telegramDownloadFile(filePath, telegramKey, lovableKey);
  if (!dl) return null;

  const ext = extFromContentType(dl.contentType);
  const objectPath = `telegram/${chatId}/${photo.file_unique_id}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(objectPath, dl.bytes, {
      contentType: dl.contentType,
      upsert: true,
      cacheControl: "31536000",
    });
  if (upErr && !String(upErr.message ?? "").toLowerCase().includes("exists")) {
    console.error("storage upload failed:", upErr);
    return null;
  }

  const { data: pub } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(objectPath);
  return pub?.publicUrl ?? null;
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
    // 2a) Pull existing images + per-photo IDs to dedupe across retries / album parts
    const { data: existing } = await supabase
      .from("car_listings")
      .select("images, file_unique_ids")
      .eq("source", "telegram")
      .eq("source_chat_id", message.chat.id)
      .eq("source_message_id", message.message_id)
      .maybeSingle();

    const priorImages: string[] = Array.isArray(existing?.images) ? existing!.images : [];
    const priorIds: string[] = Array.isArray(existing?.file_unique_ids) ? existing!.file_unique_ids : [];
    const seen = new Set(priorIds);

    // 2b) Ingest only photos we haven't already linked to this listing
    const photos = extractPhotos(message).filter((p) => !seen.has(p.file_unique_id));
    const newImages: string[] = [];
    const newIds: string[] = [];
    for (const p of photos) {
      const url = await ingestPhoto(supabase, p, message.chat.id, TELEGRAM_API_KEY, LOVABLE_API_KEY);
      if (url) {
        newImages.push(url);
        newIds.push(p.file_unique_id);
      }
    }

    const mergedImages = [...priorImages, ...newImages];
    const mergedIds = [...priorIds, ...newIds];

    const { error: listingErr } = await supabase.from("car_listings").upsert(
      {
        ...parsed,
        images: mergedImages,
        file_unique_ids: mergedIds,
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
