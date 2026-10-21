// Static export: `npm run build` writes out/index.html (en), out/hi/index.html, … — deploy out/ to any static host.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // main motion code mutates the server-rendered DOM once; Strict Mode's double effects would run it twice.
  reactStrictMode: false,
};

export default nextConfig;
