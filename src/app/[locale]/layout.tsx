import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/AppShell";
import { PwaRegister } from "@/components/layout/PwaRegister";
import { EmbedBridge } from "@/components/layout/EmbedBridge";
import { EMBED_BOOT_SCRIPT } from "@/lib/embed/bridge";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://internalaffairs-production.up.railway.app";
const TITLE = "HIMOYA-360 — Milliy smart-ta'lim modeli";
const DESCRIPTION =
  "IIV xodimlarini real xizmatga tayyorlovchi ssenariyli simulyatsion o'qitish platformasi: AI-Muloqot, Qaror simulyatori, Smart Mahalla, Hujjatlashtirish, Smart Debrifing, HIMOYA-ID. Ichida — «Mening Inspektorim» AI yordamchisi.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · HIMOYA-360" },
  description: DESCRIPTION,
  applicationName: "HIMOYA-360",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/iiv_logo.svg", apple: "/icon-192.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "HIMOYA-360" },
  openGraph: {
    type: "website",
    siteName: "HIMOYA-360",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/iiv_logo.jpg", width: 512, height: 512, alt: "HIMOYA-360" }],
    locale: "uz_UZ",
  },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION, images: ["/iiv_logo.jpg"] },
};

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as never)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* E-O'quv embed: hide the shell chrome before hydration (see src/lib/embed/bridge.ts) */}
        <script dangerouslySetInnerHTML={{ __html: EMBED_BOOT_SCRIPT }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <AppShell>{children}</AppShell>
            <PwaRegister />
            <EmbedBridge />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
