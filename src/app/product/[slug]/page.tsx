import ProductPage from "./components/ProductPage";
import type { Metadata } from "next";
import { serviceGetProductById } from "@/services/products";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/interfaces/Product";

type Props = {
    params: Promise<{ id: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const id = (await params).id;
    let product: Product | undefined;
    try {
        product = await serviceGetProductById(id);
    }
    catch (e) {
        toast({ description: "Couldn't get funko", variant: "destructive" })
    }

    return {
        title: product?.name,
        description: product?.description,
        openGraph: {
            title: product?.name,
            description: product?.description,
            url: `https://clevatech.vercel.app/product/${product?.id}`,
            siteName: "ClevaTech",
            type: "website",
            images: [
                {
                    url: product?.mainImage ?? "",
                    secureUrl: product?.mainImage ?? "",
                    width: 1200,
                    height: 630,
                    alt: `Imagen del producto ${product?.name}`,
                },
            ],
        },
        twitter: {
            card: "player",
            title: product?.name,
            description: product?.description,
            images: [product?.mainImage ?? "", ...product?.images ?? [], product?.hologramImage ?? ""],
        },
    };
}

const Page = () => {
    return (
        <ProductPage />
    )
}
export default Page;