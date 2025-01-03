
import { Metadata } from "next";
import SuccessPage from "./components/SuccesPage";

export const metadata: Metadata = {
    title: "Success",
    description: "Get ready to add a new favorite to your collection!",
    openGraph: {
        title: "Success",
        description: "Thank you for your purchase! Your Funko Pop! is on its way to you. Get ready to add a new favorite to your collection!",
        url: "https://clevatech.vercel.app/success",
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
        title: "Success",
        description: "Thank you for your purchase! Your Funko Pop! is on its way to you. Get ready to add a new favorite to your collection!",
        images: ["./flayer.png"],
    }
};


const Page = () => {

    return (
        <SuccessPage />
    );
};

export default Page;