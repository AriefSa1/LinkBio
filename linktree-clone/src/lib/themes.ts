// Tema visual untuk halaman publik. Bisa ditambah sesuai selera.
// Tidak memakai "server-only" karena dipakai juga di komponen client (preview).

export type Theme = {
  id: string;
  label: string;
  page: string; // class untuk background halaman
  card: string; // class untuk kartu utama
  text: string; // warna teks utama
  subtext: string; // warna teks sekunder
  button: string; // class untuk tombol link
  badge: string; // class untuk lingkaran ikon di tombol
  preview: string; // warna kecil untuk pemilih tema
};

export const THEMES: Record<string, Theme> = {
  midnight: {
    id: "midnight",
    label: "Midnight",
    page: "bg-[radial-gradient(120%_120%_at_50%_0%,#1e293b_0%,#0f172a_45%,#020617_100%)]",
    card: "bg-white/5 border border-white/10 backdrop-blur-xl",
    text: "text-slate-50",
    subtext: "text-slate-400",
    button:
      "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:border-white/20 backdrop-blur",
    badge: "bg-white/15 text-white",
    preview: "bg-slate-900",
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    page: "bg-[radial-gradient(120%_120%_at_50%_0%,#eff6ff_0%,#dbeafe_55%,#bfdbfe_100%)]",
    card: "bg-white border border-blue-100 shadow-blue-200/40",
    text: "text-slate-900",
    subtext: "text-slate-500",
    button:
      "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25",
    badge: "bg-white/25 text-white",
    preview: "bg-blue-600",
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    page: "bg-[radial-gradient(120%_120%_at_50%_0%,#fb7185_0%,#f97316_45%,#7c2d12_100%)]",
    card: "bg-black/15 border border-white/20 backdrop-blur-xl",
    text: "text-orange-50",
    subtext: "text-orange-100/70",
    button:
      "bg-white/15 border border-white/25 text-white hover:bg-white/25 backdrop-blur",
    badge: "bg-white/25 text-white",
    preview: "bg-orange-500",
  },
  forest: {
    id: "forest",
    label: "Forest",
    page: "bg-[radial-gradient(120%_120%_at_50%_0%,#34d399_0%,#059669_45%,#064e3b_100%)]",
    card: "bg-black/15 border border-white/20 backdrop-blur-xl",
    text: "text-emerald-50",
    subtext: "text-emerald-100/70",
    button:
      "bg-white/15 border border-white/25 text-white hover:bg-white/25 backdrop-blur",
    badge: "bg-white/25 text-white",
    preview: "bg-emerald-500",
  },
  mono: {
    id: "mono",
    label: "Mono",
    page: "bg-neutral-100",
    card: "bg-white border border-neutral-200",
    text: "text-neutral-900",
    subtext: "text-neutral-500",
    button:
      "bg-white border border-neutral-200 text-neutral-900 hover:border-neutral-900 shadow-sm",
    badge: "bg-neutral-100 text-neutral-900",
    preview: "bg-neutral-900",
  },
  grape: {
    id: "grape",
    label: "Grape",
    page: "bg-[radial-gradient(120%_120%_at_50%_0%,#a78bfa_0%,#7c3aed_45%,#2e1065_100%)]",
    card: "bg-white/10 border border-white/15 backdrop-blur-xl",
    text: "text-violet-50",
    subtext: "text-violet-200/70",
    button:
      "bg-white/15 border border-white/25 text-white hover:bg-white/25 backdrop-blur",
    badge: "bg-white/25 text-white",
    preview: "bg-violet-600",
  },
};

export const DEFAULT_THEME = "midnight";

export function getTheme(id?: string | null): Theme {
  return THEMES[id ?? ""] ?? THEMES[DEFAULT_THEME];
}
