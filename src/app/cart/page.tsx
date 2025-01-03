import { Metadata } from "next";
import CartPageContainer from "./components/CartPageContainer";

export const metadata: Metadata = {
    title: "Cart",
    description: "Review your Funko Pop! selections and get ready to complete your collection. Update quantities, remove items, or proceed to checkout with ease!",
    openGraph: {
        title: "Cart",
        description: "Review your Funko Pop! selections and get ready to complete your collection. Update quantities, remove items, or proceed to checkout with ease!",
        url: "https://clevatech.vercel.app/cart",
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
        title: "Cart",
        description: "Review your Funko Pop! selections and get ready to complete your collection. Update quantities, remove items, or proceed to checkout with ease!",
        images: ["./flayer.png"],
    }
};

const Page = () => {
    return (
        <CartPageContainer />
    );
};

export default Page;
