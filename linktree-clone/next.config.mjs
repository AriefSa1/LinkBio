/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Beri ruang untuk data foto yang dikirim lewat Server Action
      bodySizeLimit: "3mb",
    },
  },
  images: {
    remotePatterns: [
      // Izinkan gambar avatar dari mana saja (untuk demo). Persempit di produksi.
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
