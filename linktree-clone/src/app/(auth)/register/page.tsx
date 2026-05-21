"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { registerAction, type AuthState } from "../actions";
import { SubmitButton } from "@/components/SubmitButton";

export default function RegisterPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(
    registerAction,
    undefined
  );

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(120%_120%_at_50%_0%,#1e293b_0%,#0f172a_45%,#020617_100%)] px-6 py-12">
      <div className="w-full max-w-sm animate-rise">
        <Link
          href="/"
          className="mb-8 block text-center font-display text-2xl font-extrabold text-slate-50"
        >
          ✦ linktr.ee/clone
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h1 className="font-display text-2xl font-bold text-slate-50">
            Buat halamanmu
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gratis, butuh kurang dari satu menit.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <Field
              label="Nama tampilan"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Budi Santoso"
              required={false}
            />
            <div>
              <Field
                label="Username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="budi"
              />
              <p className="mt-1 text-xs text-slate-500">
                Halaman publikmu: /username
              </p>
            </div>
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="budi@email.com"
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimal 6 karakter"
            />

            {state?.error && (
              <p className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-300">
                {state.error}
              </p>
            )}

            <SubmitButton
              className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
              pendingText="Membuat akun…"
            >
              Daftar
            </SubmitButton>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-300 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  required = true,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <input
        {...props}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
      />
    </label>
  );
}
