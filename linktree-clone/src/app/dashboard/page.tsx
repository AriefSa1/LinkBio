import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "../(auth)/actions";
import {
  updateProfile,
  addLink,
  updateLink,
  toggleLink,
  deleteLink,
  moveLink,
} from "./actions";
import { SubmitButton } from "@/components/SubmitButton";
import { AvatarUpload } from "@/components/AvatarUpload";
import { AppearanceEditor } from "@/components/AppearanceEditor";
import { IconPicker } from "@/components/IconPicker";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const links = user.links;

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <span className="font-display text-lg font-extrabold">
            ✦ Dashboard
          </span>
          <div className="flex items-center gap-2">
            {user.isAdmin && (
              <Link
                href="/admin"
                className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Admin
              </Link>
            )}
            <Link
              href={`/${user.username}`}
              target="_blank"
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium transition hover:bg-neutral-100"
            >
              Lihat halaman ↗
            </Link>
            <form action={logoutAction}>
              <SubmitButton
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-500 transition hover:text-rose-600"
                pendingText="Keluar…"
              >
                Keluar
              </SubmitButton>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-5 py-8">
        {/* URL publik */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          Halaman publikmu:{" "}
          <Link
            href={`/${user.username}`}
            target="_blank"
            className="font-semibold underline underline-offset-2"
          >
            /{user.username}
          </Link>
        </div>

        {/* ---------- Edit Profil ---------- */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold">Profil</h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Informasi yang tampil di halaman publikmu.
          </p>

          <form action={updateProfile} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">
                Nama tampilan
              </span>
              <input
                name="name"
                defaultValue={user.name ?? ""}
                maxLength={60}
                placeholder="Nama kamu"
                className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 outline-none transition focus:border-neutral-900"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Bio</span>
              <textarea
                name="bio"
                defaultValue={user.bio ?? ""}
                maxLength={200}
                rows={2}
                placeholder="Ceritakan sedikit tentang dirimu…"
                className="w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 outline-none transition focus:border-neutral-900"
              />
            </label>

            <AvatarUpload
              initialSrc={user.avatarData ?? user.avatarUrl ?? null}
              name={user.name ?? user.username}
            />

            <AppearanceEditor
              initialTheme={user.theme}
              initialBgType={user.bgType}
              initialBgColor={user.bgColor}
              initialBgImage={user.bgImage}
              initialCardMode={user.cardMode}
              name={user.name ?? user.username}
              avatarSrc={user.avatarData ?? user.avatarUrl}
            />

            <SubmitButton
              className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-60"
              pendingText="Menyimpan…"
            >
              Simpan profil
            </SubmitButton>
          </form>
        </section>

        {/* ---------- Tambah Link ---------- */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold">Tambah link</h2>
          <form
            action={addLink}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
          >
            <IconPicker name="icon" initial="auto" />
            <input
              name="title"
              required
              maxLength={80}
              placeholder="Judul (mis. Instagram)"
              className="flex-1 rounded-lg border border-neutral-300 px-3.5 py-2.5 outline-none transition focus:border-neutral-900"
            />
            <input
              name="url"
              required
              placeholder="instagram.com/akunku"
              className="flex-1 rounded-lg border border-neutral-300 px-3.5 py-2.5 outline-none transition focus:border-neutral-900"
            />
            <SubmitButton
              className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
              pendingText="Menambah…"
            >
              + Tambah
            </SubmitButton>
          </form>
        </section>

        {/* ---------- Daftar Link ---------- */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold">Link kamu</h2>
            <span className="text-sm text-neutral-400">{links.length} link</span>
          </div>

          {links.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-neutral-300 py-10 text-center text-sm text-neutral-400">
              Belum ada link. Tambahkan yang pertama di atas 👆
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {links.map((link, i) => (
                <li
                  key={link.id}
                  className="rounded-xl border border-neutral-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-medium">
                        <span className="truncate">{link.title}</span>
                        {!link.active && (
                          <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                            nonaktif
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-neutral-400">
                        {link.url}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {/* Urutkan naik */}
                      <form action={moveLink}>
                        <input type="hidden" name="id" value={link.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          type="submit"
                          disabled={i === 0}
                          title="Naik"
                          className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 disabled:opacity-30"
                        >
                          ↑
                        </button>
                      </form>
                      {/* Urutkan turun */}
                      <form action={moveLink}>
                        <input type="hidden" name="id" value={link.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={i === links.length - 1}
                          title="Turun"
                          className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </form>
                      {/* Aktif / nonaktif */}
                      <form action={toggleLink}>
                        <input type="hidden" name="id" value={link.id} />
                        <button
                          type="submit"
                          title={link.active ? "Sembunyikan" : "Tampilkan"}
                          className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100"
                        >
                          {link.active ? "🙈" : "👁"}
                        </button>
                      </form>
                      {/* Hapus */}
                      <form action={deleteLink}>
                        <input type="hidden" name="id" value={link.id} />
                        <button
                          type="submit"
                          title="Hapus"
                          className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Edit (collapsible, tidak nested di form lain) */}
                  <details className="mt-3 group">
                    <summary className="cursor-pointer select-none text-sm font-medium text-neutral-500 transition hover:text-neutral-900">
                      Edit
                    </summary>
                    <form
                      action={updateLink}
                      className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start"
                    >
                      <input type="hidden" name="id" value={link.id} />
                      <IconPicker
                        name="icon"
                        initial={link.icon ?? "auto"}
                      />
                      <input
                        name="title"
                        defaultValue={link.title}
                        maxLength={80}
                        required
                        className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-900"
                      />
                      <input
                        name="url"
                        defaultValue={link.url}
                        required
                        className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-900"
                      />
                      <SubmitButton
                        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-60"
                        pendingText="…"
                      >
                        Simpan
                      </SubmitButton>
                    </form>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
