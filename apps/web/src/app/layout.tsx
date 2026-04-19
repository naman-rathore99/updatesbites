import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { headers } from "next/headers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Bites of Bliss | Cloud Kitchen",
  description: "Elevated flavors delivered. A curated culinary experience.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          suppressHydrationWarning
          className={`${outfit.variable} ${dmSans.variable} font-sans min-h-screen bg-brand-neutral text-brand-secondary antialiased flex flex-col`}
        >
          {!isAdmin && <Header />}
          <div className="flex-1">{children}</div>
          {!isAdmin && <Footer />}
        </body>
      </html>
    </ClerkProvider>
  );
}
