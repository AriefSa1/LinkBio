// Daftar ikon untuk link + util deteksi otomatis dari URL.
// Pure data (tanpa JSX) agar bisa dipakai di server action maupun client.

export const ICON_OPTIONS: { id: string; label: string }[] = [
  { id: "auto", label: "Otomatis" },
  { id: "none", label: "Tanpa ikon" },
  { id: "link", label: "Website" },
  { id: "social", label: "Media Sosial" },
  { id: "mail", label: "Email" },
  { id: "phone", label: "Telepon" },
  { id: "shop", label: "Marketplace" },
  { id: "location", label: "Lokasi" },
  { id: "youtube", label: "YouTube" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "X / Twitter" },
  { id: "telegram", label: "Telegram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "github", label: "GitHub" },
  { id: "spotify", label: "Spotify" },
];

const ICON_IDS = new Set(ICON_OPTIONS.map((o) => o.id));

/**
 * Ubah pilihan dari form menjadi nilai yang disimpan di DB:
 * - "auto" -> null (artinya: deteksi otomatis dari URL)
 * - "none" -> "none" (tanpa ikon)
 * - id valid lainnya -> id tsb
 */
export function iconChoiceToDb(value: string): string | null {
  if (!value || value === "auto") return null;
  if (value === "none") return "none";
  return ICON_IDS.has(value) ? value : null;
}

/** Tebak ikon dari URL berdasarkan domain/protokol. */
export function detectIcon(url: string): string {
  const u = (url || "").toLowerCase().trim();
  if (u.startsWith("mailto:")) return "mail";
  if (u.startsWith("tel:")) return "phone";
  const host = u.replace(/^https?:\/\//, "");
  if (/youtube\.com|youtu\.be/.test(host)) return "youtube";
  if (/wa\.me|whatsapp\.com/.test(host)) return "whatsapp";
  if (/instagram\.com/.test(host)) return "instagram";
  if (/tiktok\.com/.test(host)) return "tiktok";
  if (/facebook\.com|fb\.com|fb\.me/.test(host)) return "facebook";
  if (/twitter\.com|x\.com/.test(host)) return "twitter";
  if (/t\.me|telegram\.(me|org)/.test(host)) return "telegram";
  if (/linkedin\.com/.test(host)) return "linkedin";
  if (/github\.com/.test(host)) return "github";
  if (/spotify\.com/.test(host)) return "spotify";
  if (/shopee|tokopedia|lazada|bukalapak|blibli|amazon|etsy|ebay/.test(host))
    return "shop";
  if (/maps\.google|maps\.app|goo\.gl\/maps/.test(host)) return "location";
  return "link";
}

/** Tentukan ikon final untuk ditampilkan. */
export function resolveIcon(dbIcon: string | null, url: string): string | null {
  if (dbIcon === null) return detectIcon(url); // otomatis
  if (dbIcon === "none") return null; // sengaja tanpa ikon
  return dbIcon;
}
