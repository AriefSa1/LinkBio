import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getTheme } from "@/lib/themes";

type Props = { params: { username: string } };

async function getProfile(username: string) {
  return prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      links: { where: { active: true }, orderBy: { order: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getProfile(params.username);
  if (!user) return { title: "Halaman tidak ditemukan" };
  const title = `${user.name ?? user.username} — Linktree Clone`;
  return {
    title,
    description: user.bio ?? `Semua link dari ${user.name ?? user.username}.`,
    openGraph: { title, description: user.bio ?? undefined },
  };
}

export default async function PublicProfile({ params }: Props) {
  const user = await getProfile(params.username);
  if (!user) notFound();

  const theme = getTheme(user.theme);
  const initial = (user.name ?? user.username).charAt(0).toUpperCase();

  return (
    <main className={`min-h-dvh ${theme.page} px-5 py-16`}>
      <div className="mx-auto flex max-w-md flex-col items-center">
        {/* Avatar */}
        <div className="animate-rise">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name ?? user.username}
              className="h-24 w-24 rounded-full border-2 border-white/20 object-cover shadow-xl"
            />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-white/20 bg-white/10 text-3xl font-bold text-white shadow-xl backdrop-blur">
              {initial}
            </div>
          )}
        </div>

        {/* Nama & bio */}
        <h1
          className={`mt-5 animate-rise font-display text-2xl font-bold [animation-delay:0.05s] ${theme.text}`}
        >
          {user.name ?? user.username}
        </h1>
        <p className={`mt-1 animate-rise text-sm [animation-delay:0.08s] ${theme.subtext}`}>
          @{user.username}
        </p>
        {user.bio && (
          <p
            className={`mt-3 max-w-xs animate-rise text-center text-sm leading-relaxed [animation-delay:0.12s] ${theme.subtext}`}
          >
            {user.bio}
          </p>
        )}

        {/* Daftar link */}
        {user.links.length > 0 ? (
          <div className="link-stagger mt-8 w-full space-y-3">
            {user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`block w-full rounded-xl px-5 py-4 text-center font-medium transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 ${theme.button}`}
              >
                {link.title}
              </a>
            ))}
          </div>
        ) : (
          <p className={`mt-8 text-sm ${theme.subtext}`}>Belum ada link.</p>
        )}

        {/* Footer */}
        <Link
          href="/"
          className={`mt-12 text-xs opacity-60 transition hover:opacity-100 ${theme.subtext}`}
        >
          ✦ Dibuat dengan Linktree Clone
        </Link>
      </div>
    </main>
  );
}
