import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toggleAdmin, deleteUser } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (!me.isAdmin) redirect("/dashboard"); // bukan admin → tendang ke dashboard

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { links: true } } },
  });

  const totalLinks = users.reduce((sum, u) => sum + u._count.links, 0);
  const totalAdmins = users.filter((u) => u.isAdmin).length;

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <span className="font-display text-lg font-extrabold">
            ✦ Panel Admin
          </span>
          <Link
            href="/dashboard"
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium transition hover:bg-neutral-100"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-5 py-8">
        {/* Ringkasan */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Total pengguna" value={users.length} />
          <Stat label="Admin" value={totalAdmins} />
          <Stat label="Total link" value={totalLinks} />
        </div>

        {/* Tabel pengguna */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="font-display text-xl font-bold">Pengguna</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="px-5 py-3 font-medium">Pengguna</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Link</th>
                  <th className="px-5 py-3 font-medium">Bergabung</th>
                  <th className="px-5 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isMe = u.id === me.id;
                  const avatar = u.avatarData ?? u.avatarUrl;
                  const initial = (u.name ?? u.username)
                    .charAt(0)
                    .toUpperCase();
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatar}
                              alt=""
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-neutral-200 text-sm font-bold text-neutral-600">
                              {initial}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 font-medium">
                              <span className="truncate">
                                {u.name ?? u.username}
                              </span>
                              {u.isAdmin && (
                                <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                  admin
                                </span>
                              )}
                              {isMe && (
                                <span className="text-xs text-neutral-400">
                                  (kamu)
                                </span>
                              )}
                            </p>
                            <Link
                              href={`/${u.username}`}
                              target="_blank"
                              className="text-xs text-neutral-400 hover:text-neutral-900 hover:underline"
                            >
                              @{u.username} ↗
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-neutral-500">{u.email}</td>
                      <td className="px-5 py-3 text-neutral-500">
                        {u._count.links}
                      </td>
                      <td className="px-5 py-3 text-neutral-500">
                        {dateFmt.format(u.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {isMe ? (
                            <span className="text-xs text-neutral-300">
                              —
                            </span>
                          ) : (
                            <>
                              <form action={toggleAdmin}>
                                <input type="hidden" name="id" value={u.id} />
                                <SubmitButton
                                  className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium transition hover:bg-neutral-100"
                                  pendingText="…"
                                >
                                  {u.isAdmin ? "Cabut admin" : "Jadikan admin"}
                                </SubmitButton>
                              </form>
                              <form action={deleteUser}>
                                <input type="hidden" name="id" value={u.id} />
                                <SubmitButton
                                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600"
                                  pendingText="…"
                                >
                                  Hapus
                                </SubmitButton>
                              </form>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-center text-xs text-neutral-400">
          Menghapus pengguna juga menghapus semua link miliknya dan tidak bisa
          dibatalkan.
        </p>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="font-display text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
    </div>
  );
}
