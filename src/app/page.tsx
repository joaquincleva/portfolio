import { Metadata } from "next";
import HomePage from "./homeComponents/HomePage";

export const metadata: Metadata = {
  description: "Discover the largest collection of exclusive Funko Pop!, limited editions and your favorite characters in one place.",
  openGraph: {
    title: "ClevaTech",
    description: "Discover the largest collection of exclusive Funko Pop!, limited editions and your favorite characters in one place.",
    url: "https://clevatech.vercel.app/",
    siteName: "ClevaTech",
    type: "website",
    images: [
      {
        url: "./flayer.png",
        secureUrl: "./flayer.png",
        width: 1200,
        height: 630,
        alt: `Imagen de flayer`,
      },
    ],
  },
  twitter: {
    card: "player",
    title: "ClevaTech",
    description: "Discover the largest collection of exclusive Funko Pop!, limited editions and your favorite characters in one place.",
    images: ["./flayer.png"],
  },
};

const Page = () => {

  return (
    <HomePage />
  );
}

export default Page;