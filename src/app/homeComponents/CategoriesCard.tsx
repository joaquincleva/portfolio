import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Category } from "@/interfaces/Category"
import { Product } from "@/interfaces/Product"
import { useEffect, useRef, useState } from "react"

interface CategoriesCardProps {
    products: Product[]
    categories: Category[]
}

const CategoriesCard = ({ categories, products }: CategoriesCardProps) => {

    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <div ref={sectionRef} className={`w-full flex-wrap justify-center gap-6 px-10 flex py-16 transition-opacity duration-700 ${isVisible ? "animate-fadeInUp" : "opacity-0"}`}>
            {categories.map((item: Category, index: number) => (

                <Card key={index} className="w-[23%] bg-transparent text-white hover:text-black hover:bg-white hover:border-[#de942c] border p-0 border-blue-500 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] group hover:-translate-y-3 transition-all delay-100 duration-300">
                    <CardHeader className="h-36 rounded-t-xl grayscale group-hover:grayscale-0 transition-all delay-300 duration-300"
                        style={{
                            backgroundImage: `url('${item.image}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center top"
                        }}></CardHeader>
                    <div className="px-4">
                        <Separator className="my-3" />
                    </div>
                    <CardContent className="flex flex-col px-4 items-start justify-center">
                        <p className="font-bold text-xl self-center">{item.name}</p>
                        <ul className="mt-2 flex flex-col gap-1">
                            <li><span className="text-[#de942c] mr-2">✔</span>Total Funkos: {products.filter((productItem: any) => {
                                return productItem.categoryId === item.id
                            }).length}</li>
                            <li><span className="text-[#de942c] mr-2">✔</span>Funkos sold: {products.filter((productItem: any) => {
                                return productItem.categoryId === item.id
                            }).reduce((acc, curr) => acc + curr.salesQty, 0)}</li>
                            <li><span className="text-[#de942c] mr-2">✔</span>Funkos with deals: {products.filter((productItem: any) => {
                                return productItem.categoryId === item.id && productItem.offerPercentage != null
                            }).length}</li>
                        </ul>
                    </CardContent>
                </Card>))}

        </div>
    )
}
export default CategoriesCard;