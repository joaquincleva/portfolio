import { Category } from "@/interfaces/Category";
import { Product } from "@/interfaces/Product";
import { useRouter } from "next/navigation"

interface HologramCardProps {
    index: number;
    item: Product;
    categories: Category[];
}

const HologramCard = ({index, item, categories}: HologramCardProps) => {
    const router = useRouter();
    return (
        <div
            key={index}
            rel="noopener noreferrer"
            className="group w-[200px] cursor-pointer h-[300px] rounded-xl flex-col relative flex justify-center items-end mx-6 perspective"
            onClick={() => router.push(`/product/${item.id}`)}
        >
            <div className="absolute inset-0 rounded-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-y-25deg group-hover:shadow-lg">
                <img
                    src={item.mainImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
                <div className="absolute rounded-xl inset-0 bg-gradient-to-t from-transparent via-black/50 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute rounded-xl inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-black/50 to-black/80 opacity-100 group-hover:h-36 transition-all duration-500"></div>
            </div>
            <p className="absolute top-56 inset-0 w-full text-center text-xl text-white font-extrabold transition-all duration-500 group-hover:translate-y-[-25px] group-hover:translate-z-20 z-50">
                {item.name}
            </p>
            <p className="absolute top-64 inset-0 w-full text-center text-[#de942c] text-xl font-extrabold transition-all duration-500 group-hover:translate-y-[-25px] group-hover:translate-z-20 z-50">
                {categories.find((categoryItem) => categoryItem.id === item.categoryId)?.name}
            </p>
            <div className="absolute top-12 pr-1.5 inset-0 w-full text-right text-[#de942c] text-xl font-extrabold transition-all duration-500 group-hover:translate-y-[-0px] group-hover:translate-z-20 z-50">
                <p className="text-[1rem] font-bold">
                    ${(item?.price * (1 - (item?.offerPercentage || 0))).toFixed(2)}
                </p>
            </div>
            <img
                src={item.hologramImage}
                alt=""
                className="absolute perspectiveHologram self-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-[-20%]"
            />
        </div>
    )
}

export default HologramCard;