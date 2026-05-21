"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, deleteSession } from "@/lib/session";

export type AuthState = { error?: string } | undefined;

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export async function registerAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!username || !email || !password) {
    return { error: "Semua field wajib diisi." };
  }
  if (!USERNAME_RE.test(username)) {
    return {
      error:
        "Username harus 3–20 karakter, hanya huruf kecil, angka, atau underscore.",
    };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Format email tidak valid." };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }
  // Cegah bentrok dengan rute aplikasi
  const RESERVED = ["dashboard", "login", "register", "api", "demo"];
  if (RESERVED.includes(username)) {
    return { error: "Username tersebut tidak tersedia." };
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    return { error: "Username atau email sudah terdaftar." };
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: await hashPassword(password),
      name: name || username,
    },
  });

  await createSession({ userId: user.id, username: user.username });
  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const identifier = String(formData.get("identifier") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Isi username/email dan password." };
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });

  // Pesan error sama untuk user tidak ada / password salah (keamanan)
  if (!user || !(await verifyPassword(password, user.password))) {
    return { error: "Username/email atau password salah." };
  }

  await createSession({ userId: user.id, username: user.username });
  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
