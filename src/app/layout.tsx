import type { Metadata } from "next";
import { Inter, Playfair_Display, Fira_Code } from "next/font/google";
import GSAPProvider from "@/components/providers/GSAPProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "smartscaile. — Portal",
  description: "Portal de clientes smartscaile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} ${firaCode.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#050505] text-[#F3F4F6]" suppressHydrationWarning>
        <GSAPProvider>{children}</GSAPProvider>
      </body>
    </html>
  );
}
