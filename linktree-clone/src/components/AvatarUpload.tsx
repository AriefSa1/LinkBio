"use client";

import { useRef, useState } from "react";

/**
 * Upload foto profil. Gambar di-resize di browser (maks 512px, JPEG)
 * lalu dikirim sebagai data URL melalui input tersembunyi `avatarData`.
 * Ukuran hasil biasanya < 100KB sehingga aman disimpan di database.
 */
export function AvatarUpload({
  initialSrc,
  name,
}: {
  initialSrc: string | null;
  name: string;
}) {
  const [preview, setPreview] = useState<string | null>(initialSrc);
  const [dataUrl, setDataUrl] = useState(""); // foto baru (kosong = tidak berubah)
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 8MB.");
      return;
    }
    try {
      const resized = await resizeImage(file, 512, 0.85);
      setDataUrl(resized);
      setPreview(resized);
      setRemoved(false);
    } catch {
      setError("Gagal memproses gambar. Coba file lain.");
    }
  }

  function handleRemove() {
    setDataUrl("");
    setPreview(null);
    setRemoved(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  const initial = (name || "?").charAt(0).toUpperCase();

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">Foto profil</span>
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Pratinjau foto profil"
            className="h-16 w-16 rounded-full border border-neutral-300 object-cover"
          />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-full bg-neutral-200 text-xl font-bold text-neutral-600">
            {initial}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium transition hover:bg-neutral-100"
          >
            {preview ? "Ganti foto" : "Pilih foto"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition hover:text-rose-600"
            >
              Hapus foto
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <p className="mt-1 text-xs text-neutral-400">
        Gambar otomatis diperkecil. JPG/PNG, maks 8MB.
      </p>

      {/* Dikirim bersama form profil */}
      <input type="hidden" name="avatarData" value={dataUrl} />
      <input type="hidden" name="avatarRemove" value={removed ? "1" : ""} />
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
