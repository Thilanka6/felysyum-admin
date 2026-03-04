const nextConfig = {
  output: "export",
  trailingSlash: true, // ← this is critical, generates /dashboard/index.html
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
