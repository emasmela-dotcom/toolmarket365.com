import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { HOME_PANELS_CSS } from "@/lib/homePanelsCssString";
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
  title: "ToolMarket365",
  description: "ToolMarket365 platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <style
          id="home-panels-css"
          dangerouslySetInnerHTML={{ __html: HOME_PANELS_CSS }}
        />
        <Script id="theme-dark-class" strategy="beforeInteractive">
          {`(function(){try{var m=window.matchMedia("(prefers-color-scheme: dark)");function s(){document.documentElement.classList.toggle("dark",m.matches);}s();m.addEventListener("change",s);}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
