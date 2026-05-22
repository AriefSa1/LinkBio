"use client";

import { useEffect, useRef, useState } from "react";
import { ICON_OPTIONS } from "@/lib/link-icons";
import { LinkIcon } from "@/components/icons";

/** Glyph kecil untuk opsi non-ikon di pemilih. */
function OptionGlyph({ id }: { id: string }) {
  if (id === "auto") return <span className="text-sm">✦</span>;
  if (id === "none") return <span className="text-sm text-neutral-400">∅</span>;
  return <LinkIcon name={id} className="h-5 w-5" />;
}

export function IconPicker({
  name,
  initial = "auto",
}: {
  name: string;
  initial?: string;
}) {
  const [value, setValue] = useState(initial || "auto");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = ICON_OPTIONS.find((o) => o.id === value) ?? ICON_OPTIONS[0];

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2.5 text-sm transition hover:bg-neutral-100"
        title="Pilih ikon"
      >
        <span className="grid h-5 w-5 place-items-center text-neutral-700">
          <OptionGlyph id={value} />
        </span>
        <span className="text-neutral-600">{current.label}</span>
        <span className="text-neutral-400">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
          <div className="grid grid-cols-5 gap-1">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                title={opt.label}
                onClick={() => {
                  setValue(opt.id);
                  setOpen(false);
                }}
                className={`grid aspect-square place-items-center rounded-lg text-neutral-700 transition hover:bg-neutral-100 ${
                  value === opt.id ? "bg-neutral-900 text-white" : ""
                }`}
              >
                <OptionGlyph id={opt.id} />
              </button>
            ))}
          </div>
        </div>
      )}

      <input type="hidden" name={name} value={value} />
    </div>
  );
}
