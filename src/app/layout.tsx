import type { Metadata } from "next";
import { Exo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/sharedComponents/Navbar";
import Footer from "@/sharedComponents/Footer";
import DraggableImage from "./homeComponents/DraggableImage";
import { CartProvider } from "@/store/CartContext";
import { ToastProvider } from "@radix-ui/react-toast";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "ClevaTech | %s ",
    default: "ClevaTech",
  },
  description: "Discover the largest collection of exclusive Funko Pop!, limited editions and your favorite characters in one place.",
  icons: ["/favicon.ico"],
};

const exo = Exo({
  subsets: ['latin'],
  variable: '--font-exo',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <CartProvider>
        <html lang="en">
          <body
          style={{maxWidth: "100vw"}}
            className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-b from-[#000] to-[#1a1a1a] antialiased flex flex-col max-w-screen h-full min-h-screen scrollbar-custom justify-between items-center`}
          >
            <Navbar />
            {children}
            <Toaster />
            <Footer />
          </body>
        </html>
      </CartProvider>
    </ToastProvider>
  );
}
