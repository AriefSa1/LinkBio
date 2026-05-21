import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,#1e293b_0%,#0f172a_45%,#020617_100%)] text-slate-50">
      {/* Dekorasi background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl animate-float [animation-delay:2s]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-6 animate-fade-in rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-slate-300 backdrop-blur">
          ✦ Dibuat dengan Next.js + Tailwind CSS
        </span>

        <h1 className="animate-rise font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
          Satu link untuk
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-violet-300 bg-clip-text text-transparent">
            semua yang kamu punya
          </span>
        </h1>

        <p className="mt-6 max-w-xl animate-rise text-lg text-slate-300 [animation-delay:0.1s]">
          Kumpulkan seluruh tautan penting—media sosial, portofolio, toko—dalam
          satu halaman cantik yang gampang dibagikan.
        </p>

        <div className="mt-10 flex animate-rise flex-col gap-3 sm:flex-row [animation-delay:0.2s]">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-emerald-400 px-8 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Buka Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-full bg-emerald-400 px-8 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Buat halaman gratis
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-3.5 font-semibold text-slate-100 backdrop-blur transition hover:bg-white/10"
              >
                Masuk
              </Link>
            </>
          )}
        </div>

        <p className="mt-10 animate-fade-in text-sm text-slate-400 [animation-delay:0.4s]">
          Lihat contoh:{" "}
          <Link
            href="/demo"
            className="font-medium text-emerald-300 underline-offset-4 hover:underline"
          >
            /demo
          </Link>
        </p>
      </div>
    </main>
  );
}
