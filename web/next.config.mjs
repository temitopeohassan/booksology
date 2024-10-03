/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      canvas: 'commonjs canvas',
      encoding: 'encoding',
    });
    return config;
  },
};

export default nextConfig;
