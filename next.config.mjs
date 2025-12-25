/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable Turbopack for production builds (fixes PostCSS/autoprefixer issues)
    experimental: {
        turbo: false,
    },
};

export default nextConfig;
