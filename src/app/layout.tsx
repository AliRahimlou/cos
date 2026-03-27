import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

import { THEME_COOKIE_NAME } from "@/lib/portal/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COS Training Portal",
  description: "Creative Office Solutions - Sales Rep Onboarding & Training Portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const htmlClassName = [
    geistSans.variable,
    geistMono.variable,
    "h-full",
    "antialiased",
    theme === "dark" ? "dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={htmlClassName}
    >
      <body className="min-h-full flex flex-col [min-height:-webkit-fill-available] [min-height:100svh]">
        {children}
      </body>
    </html>
  );
}
