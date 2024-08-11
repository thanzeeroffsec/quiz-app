/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.pikpng.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
