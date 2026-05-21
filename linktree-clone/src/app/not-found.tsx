import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(120%_120%_at_50%_0%,#1e293b_0%,#0f172a_45%,#020617_100%)] px-6 text-center">
      <div className="animate-rise">
        <p className="font-display text-7xl font-extrabold text-slate-700">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-slate-100">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-slate-400">
          Username ini belum terdaftar atau halaman tidak ada.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
