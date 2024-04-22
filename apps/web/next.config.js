/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dgfgljvxbegytbhujxbk.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};
