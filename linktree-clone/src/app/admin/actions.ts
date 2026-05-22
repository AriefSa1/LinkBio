"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/** Pastikan pemanggil adalah admin. Mengembalikan user admin atau null. */
async function requireAdmin() {
  const me = await getCurrentUser();
  if (!me || !me.isAdmin) return null;
  return me;
}

export async function toggleAdmin(formData: FormData) {
  const me = await requireAdmin();
  if (!me) return;

  const id = String(formData.get("id") ?? "");
  // Tidak boleh mengubah status admin diri sendiri (mencegah terkunci)
  if (!id || id === me.id) return;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return;

  await prisma.user.update({
    where: { id },
    data: { isAdmin: !target.isAdmin },
  });

  revalidatePath("/admin");
}

export async function deleteUser(formData: FormData) {
  const me = await requireAdmin();
  if (!me) return;

  const id = String(formData.get("id") ?? "");
  // Tidak boleh menghapus akun sendiri
  if (!id || id === me.id) return;

  // Hapus user (link miliknya ikut terhapus karena onDelete: Cascade)
  await prisma.user.deleteMany({ where: { id } });

  revalidatePath("/admin");
}
