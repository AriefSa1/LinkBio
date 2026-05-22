"use client";

import { useRef, useState } from "react";
import { THEMES } from "@/lib/themes";

const COLOR_PRESETS = [
  "#0f172a",
  "#111827",
  "#1e1b4b",
  "#7c2d12",
  "#064e3b",
  "#831843",
  "#0c4a6e",
  "#f5f5f4",
];

type Props = {
  initialTheme: string;
  initialBgType: string;
  initialBgColor: string | null;
  initialBgImage: string | null;
  initialCardMode: boolean;
  name: string;
  avatarSrc: string | null;
};

export function AppearanceEditor({
  initialTheme,
  initialBgType,
  initialBgColor,
  initialBgImage,
  initialCardMode,
  name,
  avatarSrc,
}: Props) {
  const [theme, setTheme] = useState(
    THEMES[initialTheme] ? initialTheme : "midnight"
  );
  const [bgType, setBgType] = useState<"theme" | "color" | "image">(
    initialBgType === "color" || initialBgType === "image"
      ? initialBgType
      : "theme"
  );
  const [bgColor, setBgColor] = useState(initialBgColor || "#0f172a");
  const [bgImageNew, setBgImageNew] = useState(""); // gambar baru (data URL)
  const [bgImageRemoved, setBgImageRemoved] = useState(false);
  const [cardMode, setCardMode] = useState(initialCardMode);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const currentBgImage = bgImageRemoved ? null : bgImageNew || initialBgImage;
  const t = THEMES[theme];
  const initial = (name || "?").charAt(0).toUpperCase();

  async function handleBgFile(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 12MB.");
      return;
    }
    try {
      const resized = await resizeImage(file, 1280, 0.72);
      setBgImageNew(resized);
      setBgImageRemoved(false);
      setBgType("image");
    } catch {
      setError("Gagal memproses gambar. Coba file lain.");
    }
  }

  function removeBgImage() {
    setBgImageNew("");
    setBgImageRemoved(true);
    if (inputRef.current) inputRef.current.value = "";
    if (bgType === "image") setBgType("theme");
  }

  // Style latar untuk pratinjau
  const previewBg: React.CSSProperties = {};
  let previewBgClass = "";
  if (bgType === "image" && currentBgImage) {
    previewBg.backgroundImage = `url(${currentBgImage})`;
    previewBg.backgroundSize = "cover";
    previewBg.backgroundPosition = "center";
  } else if (bgType === "color") {
    previewBg.backgroundColor = bgColor;
  } else {
    previewBgClass = t.page;
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-medium">Tampilan halaman</span>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        {/* ---------- Kontrol ---------- */}
        <div className="space-y-5">
          {/* Tema (warna teks & tombol) */}
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
              Tema (warna teks &amp; tombol)
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.values(THEMES).map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    theme === th.id
                      ? "border-neutral-900 ring-2 ring-neutral-900/10"
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  <span className={`h-4 w-4 rounded-full ${th.preview}`} />
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Latar belakang */}
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
              Latar belakang
            </p>
            <div className="inline-flex rounded-lg border border-neutral-300 p-1">
              {(
                [
                  ["theme", "Tema"],
                  ["color", "Warna"],
                  ["image", "Gambar"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBgType(val)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    bgType === val
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {bgType === "color" && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBgColor(c)}
                    style={{ backgroundColor: c }}
                    className={`h-7 w-7 rounded-full border transition ${
                      bgColor.toLowerCase() === c.toLowerCase()
                        ? "border-neutral-900 ring-2 ring-neutral-900/20"
                        : "border-neutral-300"
                    }`}
                    aria-label={c}
                  />
                ))}
                <label className="flex items-center gap-2 text-sm text-neutral-500">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-7 w-9 cursor-pointer rounded border border-neutral-300 bg-transparent"
                  />
                  Pilih
                </label>
              </div>
            )}

            {bgType === "image" && (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium transition hover:bg-neutral-100"
                  >
                    {currentBgImage ? "Ganti gambar" : "Upload gambar"}
                  </button>
                  {currentBgImage && (
                    <button
                      type="button"
                      onClick={removeBgImage}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition hover:text-rose-600"
                    >
                      Hapus gambar
                    </button>
                  )}
                </div>
                <p className="text-xs text-neutral-400">
                  Gambar otomatis diperkecil. Disarankan aktifkan mode kartu agar
                  teks tetap terbaca.
                </p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleBgFile(f);
              }}
            />
          </div>

          {/* Mode kartu */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3.5 py-3">
            <div>
              <p className="text-sm font-medium">Mode kartu</p>
              <p className="text-xs text-neutral-400">
                Bungkus konten dalam kartu di tengah halaman.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={cardMode}
              onClick={() => setCardMode((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                cardMode ? "bg-neutral-900" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  cardMode ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>

        {/* ---------- Pratinjau ---------- */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`relative h-[300px] w-[170px] overflow-hidden rounded-[1.75rem] border-4 border-neutral-800 ${previewBgClass}`}
            style={previewBg}
          >
            {bgType === "image" && currentBgImage && (
              <div className="absolute inset-0 bg-black/25" />
            )}
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-3">
              <div
                className={
                  cardMode
                    ? `${t.card} w-full rounded-2xl p-3 shadow-lg`
                    : "w-full"
                }
              >
                <div className="flex flex-col items-center gap-2">
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarSrc}
                      alt=""
                      className="h-10 w-10 rounded-full border border-white/30 object-cover"
                    />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-sm font-bold text-white">
                      {initial}
                    </div>
                  )}
                  <p className={`text-xs font-bold ${t.text}`}>
                    {name || "Nama"}
                  </p>
                  <div className="w-full space-y-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-6 w-full rounded-lg ${t.button}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="text-xs text-neutral-400">Pratinjau</span>
        </div>
      </div>

      {/* Input tersembunyi — dikirim bersama form profil */}
      <input type="hidden" name="theme" value={theme} />
      <input type="hidden" name="bgType" value={bgType} />
      <input type="hidden" name="bgColor" value={bgColor} />
      <input type="hidden" name="bgImage" value={bgImageNew} />
      <input type="hidden" name="bgImageRemove" value={bgImageRemoved ? "1" : ""} />
      <input type="hidden" name="cardMode" value={cardMode ? "1" : ""} />
    </div>
  );
}

function resizeImage(
  file: File,
  maxSize: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("image error"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("no canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
