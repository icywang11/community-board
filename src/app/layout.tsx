import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_SC, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif",
  weight: ["400", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "社区舆情看板",
  description:
    "Discord 社区舆情看板：本周概览、反馈分类、高频议题与原话摘录。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${outfit.variable} ${cormorant.variable} ${notoSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
