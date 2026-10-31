/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // This repo is a workspace with sibling lockfiles — pin OUR lockfile as root.
    root: import.meta?.dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
};

export default nextConfig;
