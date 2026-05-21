import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Ambil user yang sedang login beserta link-nya (urut berdasarkan order). */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { links: { orderBy: { order: "asc" } } },
  });
}

/**
 * Rapikan input URL dari user supaya aman dan valid.
 * - Tambahkan https:// jika protokol tidak ada
 * - Pertahankan mailto:
 * - Buang protokol berbahaya (mis. javascript:)
 */
export function normalizeUrl(input: string): string {
  let u = input.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (/^mailto:/i.test(u)) return u;
  // Buang protokol selain http/https/mailto (mencegah javascript:, data:, dll.)
  u = u.replace(/^[a-z][a-z0-9+.-]*:\/*/i, "");
  return "https://" + u;
}
