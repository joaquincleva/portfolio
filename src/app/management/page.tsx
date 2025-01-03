import { Metadata } from "next";
import ManagementPage from "./components/ManagementPage";

export const metadata: Metadata = {
    title: "Management",
    description: "Manage your Funko Pop! inventory with ease. Add, edit, or remove products and categories to keep your collection organized and up to date.",
    openGraph: {
        title: "Management",
        description: "Manage your Funko Pop! inventory with ease. Add, edit, or remove products and categories to keep your collection organized and up to date.",
        url: "https://clevatech.vercel.app/management",
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
        title: "Management",
        description: "Manage your Funko Pop! inventory with ease. Add, edit, or remove products and categories to keep your collection organized and up to date.",
        images: ["./flayer.png"],
    }
};

const Page = () => {

    return (
        <ManagementPage />
    );
}

export default Page;