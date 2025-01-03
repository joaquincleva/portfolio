import { useRouter } from "next/navigation";
import { FiltersProps } from "./ProductsPage";
import HologramCard from "@/sharedComponents/HologramCard";
import { Product } from "@/interfaces/Product";
import { Category } from "@/interfaces/Category";

interface ProductContainerProps{
    products: Product[];
    categories: Category[];
    filters: FiltersProps
}

const ProductsContainer = ({products, categories, filters}: ProductContainerProps) => {

    
    const router = useRouter();
    const filterProducts = ({ maxPrice, minPrice, nameOrDescription, category, hasDeal, hasStock, minOffer }: FiltersProps) =>
        products.filter(({ price, offerPercentage = 0, name, description, categoryId, offerTime, stock }) =>
            (!maxPrice || price * (1 - offerPercentage) <= maxPrice) &&
            (!minPrice || price * (1 - offerPercentage) >= minPrice) &&
            (!nameOrDescription || [name, description].some(text => text.toLowerCase().includes(nameOrDescription.toLowerCase()))) &&
            (!category || categoryId === category) &&
            (!hasDeal || (offerTime && offerTime > 0)) &&
            (!hasStock || stock > 0) &&
            (!minOffer || offerPercentage >= minOffer / 100)
        );
    return (
        <div className='w-full h-full pt-4'>
            <p className='w-full text-5xl text-center font-extrabold'>Select a Funko</p>
            {filterProducts(filters).length > 0 ?
                <div className="w-full flex-wrap gap-y-10 flex justify-center bg-white pb-16 pt-10">
                    {filterProducts(filters).map((item: Product, index: number) => (
                        <HologramCard key={index} item={item} index={index} categories={categories} />
                    ))}
                </div> :
                <div className="w-full flex gap-y-4 flex-col items-center justify-center bg-white">
                    <img src='./not-found.png' alt='Not found image' width={350} height={350} />
                    <p className="text-2xl text-center font-extrabold">No products found</p>
                </div>
            }
        </div>
    )
}

export default ProductsContainer;