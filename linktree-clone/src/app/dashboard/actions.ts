"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, normalizeUrl } from "@/lib/auth";
import { THEMES, DEFAULT_THEME } from "@/lib/themes";

/** Revalidasi dashboard + halaman publik user agar tampilan ikut ter-update. */
function refresh(username: string) {
  revalidatePath("/dashboard");
  revalidatePath(`/${username}`);
}

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  const bio = String(formData.get("bio") ?? "").trim().slice(0, 200);
  let theme = String(formData.get("theme") ?? "").trim();
  if (!THEMES[theme]) theme = DEFAULT_THEME;

  // --- Tampilan: latar & mode kartu ---
  const bgTypeRaw = String(formData.get("bgType") ?? "theme").trim();
  const bgType = ["theme", "color", "image"].includes(bgTypeRaw)
    ? bgTypeRaw
    : "theme";
  const bgColorRaw = String(formData.get("bgColor") ?? "").trim();
  const bgColor = /^#[0-9a-fA-F]{6}$/.test(bgColorRaw) ? bgColorRaw : null;
  const cardMode = String(formData.get("cardMode") ?? "") === "1";

  // --- Foto profil & gambar latar (data URL hasil resize di browser) ---
  const avatarData = String(formData.get("avatarData") ?? "");
  const avatarRemove = String(formData.get("avatarRemove") ?? "") === "1";
  const bgImage = String(formData.get("bgImage") ?? "");
  const bgImageRemove = String(formData.get("bgImageRemove") ?? "") === "1";

  const data: Prisma.UserUpdateInput = {
    name: name || user.username,
    bio: bio || null,
    theme,
    bgType,
    bgColor,
    cardMode,
  };

  if (avatarRemove) {
    // Hapus foto (baik yang di-upload maupun URL)
    data.avatarData = null;
    data.avatarUrl = null;
  } else if (avatarData) {
    if (avatarData.startsWith("data:image/") && avatarData.length < 3_000_000) {
      data.avatarData = avatarData;
    }
  }

  if (bgImageRemove) {
    data.bgImage = null;
  } else if (bgImage) {
    if (bgImage.startsWith("data:image/") && bgImage.length < 3_000_000) {
      data.bgImage = bgImage;
    }
  }

  await prisma.user.update({ where: { id: user.id }, data });

  refresh(user.username);
}

export async function addLink(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const rawUrl = String(formData.get("url") ?? "").trim();
  if (!title || !rawUrl) return;

  const count = await prisma.link.count({ where: { userId: user.id } });

  await prisma.link.create({
    data: {
      title,
      url: normalizeUrl(rawUrl),
      order: count,
      userId: user.id,
    },
  });

  refresh(user.username);
}

export async function updateLink(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const rawUrl = String(formData.get("url") ?? "").trim();
  if (!id || !title || !rawUrl) return;

  // updateMany dengan filter userId => hanya bisa mengubah link milik sendiri
  await prisma.link.updateMany({
    where: { id, userId: user.id },
    data: { title, url: normalizeUrl(rawUrl) },
  });

  refresh(user.username);
}

export async function toggleLink(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  const link = await prisma.link.findFirst({ where: { id, userId: user.id } });
  if (!link) return;

  await prisma.link.update({
    where: { id: link.id },
    data: { active: !link.active },
  });

  refresh(user.username);
}

export async function deleteLink(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  // deleteMany dengan filter userId => aman, hanya hapus milik sendiri
  await prisma.link.deleteMany({ where: { id, userId: user.id } });

  refresh(user.username);
}

export async function moveLink(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? ""); // "up" | "down"

  const links = await prisma.link.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });

  const index = links.findIndex((l) => l.id === id);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= links.length) return;

  const current = links[index];
  const neighbor = links[swapWith];

  // Tukar nilai order keduanya dalam satu transaksi
  await prisma.$transaction([
    prisma.link.update({
      where: { id: current.id },
      data: { order: neighbor.order },
    }),
    prisma.link.update({
      where: { id: neighbor.id },
      data: { order: current.order },
    }),
  ]);

  refresh(user.username);
}
