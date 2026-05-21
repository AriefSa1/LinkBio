/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Izinkan gambar avatar dari mana saja (untuk demo). Persempit di produksi.
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
