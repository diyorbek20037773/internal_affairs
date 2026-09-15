import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const embedOrigins = (process.env.NEXT_PUBLIC_EMBED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .join(" ");

const nextConfig = {
  reactStrictMode: true,
  // Separate build dir for a side-by-side dev/test server (`NEXT_DIST_DIR=.next-dev`).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
          // Only the E-O'quv host (NEXT_PUBLIC_EMBED_ORIGINS) may frame the app.
          { key: "Content-Security-Policy", value: `frame-ancestors 'self' ${embedOrigins}`.trim() },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
