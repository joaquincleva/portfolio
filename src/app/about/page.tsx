import AboutPage from "./components/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Me",
    description: "Front-End developer with a passion for creating dynamic and user-friendly websites. Seeking for challenging projects to boost my professional growth.",
    openGraph: {
        title: "About Me",
        description: "Front-End developer with a passion for creating dynamic and user-friendly websites. Seeking for challenging projects to boost my professional growth.",
        url: "https://clevatech.vercel.app/about",
        siteName: "ClevaTech",
        type: "website",
        images: [
            {
                url: "./joaquin_cleva.png",
                secureUrl: "./joaquin_cleva.png",
                width: 630,
                height: 1200,
                alt: `About me image`,
            },
        ],
    },
    twitter: {
        card: "player",
        title: "About Me",
        description: "Front-End developer with a passion for creating dynamic and user-friendly websites. Seeking for challenging projects to boost my professional growth.",
        images: ["./joaquin_cleva.png"],
    }
};


const Page = () => {

    return (
        <AboutPage />
    );
};

export default Page;