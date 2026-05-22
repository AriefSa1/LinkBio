import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("demo1234", 10);

  const demo = await prisma.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      username: "demo",
      email: "demo@example.com",
      password,
      name: "Demo Creator",
      bio: "Halo! Ini contoh halaman link ala Linktree. Login sebagai demo untuk mengeditnya.",
      avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Demo",
      theme: "midnight",
      isAdmin: true,
      links: {
        create: [
          { title: "Website Pribadi", url: "https://example.com", icon: "link", order: 0 },
          { title: "Instagram", url: "https://instagram.com", icon: "instagram", order: 1 },
          { title: "YouTube", url: "https://youtube.com", icon: "youtube", order: 2 },
          { title: "Kirim Email", url: "mailto:demo@example.com", order: 3 },
        ],
      },
    },
  });

  console.log(`✅ User demo siap: username "${demo.username}" / password "demo1234"`);
  console.log(`   Halaman publik: http://localhost:3000/${demo.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
