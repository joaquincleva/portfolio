
import { Metadata } from "next";
import ProductsPage from "./components/ProductsPage";

export const metadata: Metadata = {
    title: "Products",
    description: "Discover an amazing collection of Funko Pop! figures featuring your favorite characters from movies, TV shows, games, and more. Perfect for collectors and fans alike!",
    openGraph: {
        title: "Products",
        description: "Discover an amazing collection of Funko Pop! figures featuring your favorite characters from movies, TV shows, games, and more. Perfect for collectors and fans alike!",
        url: "https://clevatech.vercel.app/products",
        siteName: "ClevaTech",
        type: "website",
        images: [
            {
                url: "./flayer.png",
                secureUrl: "./flayer.png",
                width: 1200,
                height: 630,
                alt: `Products image`,
            },
        ],
    },
    twitter: {
        card: "player",
        title: "Products",
        description: "Discover an amazing collection of Funko Pop! figures featuring your favorite characters from movies, TV shows, games, and more. Perfect for collectors and fans alike!",
        images: ["./flayer.png"],
    }
};


const Page = () => {

    return (
        <ProductsPage />
    );
};

export default Page;