/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use 'domains' for broader compatibility
    domains: ["ik.imagekit.io"],
    // You can remove remotePatterns if you use domains
    // remotePatterns: [ ... ]
  },
};

export default nextConfig;