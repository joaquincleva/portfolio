import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Category } from "@/interfaces/Category";
import { Product } from "@/interfaces/Product";
import Logo from "@/sharedComponents/Logo";
import { ArrowRightCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface BestSellingCarouselProps {
    mostSealedProducts: Product[];
    categories: Category[];
}

const BestSellingCarousel = ({mostSealedProducts, categories}: BestSellingCarouselProps) => {

    const router = useRouter();

    return <div className="w-full h-96">
        <Carousel className="w-full bg-transparent h-96" style={{
            backgroundImage: `url('background-carousel.jpg')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom"
        }}>
            <CarouselContent className="h-96" >

                {mostSealedProducts.map((item, index) => (
                    <CarouselItem key={index} className="bg-transparent border-none border-0 h-full" >
                        <div className="p-1 bg-transparent h-full flex items-center justify-center">
                            <div className="w-1/3 h-full flex flex-col justify-between items-center ">
                                <div className="w-full ml-24 mt-4 flex justify-start ">
                                    <div className="rounded-full p-0">
                                        <Logo height="75px" width="75px" fill="#6b7280" />
                                    </div>
                                </div>
                                <div className="flex w-full flex-col justify-center h-full items-end">
                                    <span className="block  text-[#de942c] text-xl font-bold">
                                        {categories.filter((categoryItem: any) => {
                                            return categoryItem.id === item.categoryId
                                        })[0]?.name}
                                    </span>
                                    <p className="mb-4 w-full text-5xl pb-4 font-extrabold text-end text-white">{item.name}</p>

                                    <p onClick={()=>{router.push(`/product/${item.id}`)}} className="flex w-auto justify-center items-end hover:bg-[#6b7280] hover:text-white bg-white px-3 pt-1.5 rounded-full text-black cursor-pointer group text-xl my-4 mb-6 py-1">
                                        <span className=" font-bold text-sm ">Buy Now! </span>
                                        <ArrowRightCircle className="h-5" />
                                    </p>
                                </div>

                            </div>
                            <div className="w-1/3 flex flex-col h-full justify-center items-center">
                                <img className="rounded-full" alt={item.name} src={item.hologramImage} width={300} height={300} />
                            </div>
                            <div className="w-1/3 flex flex-col h-full justify-around items-center text-white">
                                <p className="text-3xl text-start w-full text-blue-500 font-extrabold">Best Selling Funkos!</p>
                                <p className="pr-40 text-xs">{item.description.slice(0, 200)}{item.description.length > 200 && "..."}</p>
                                <div className="flex flex-col w-full items-start">
                                    {item?.offerPercentage && <p className="line-through text-[0.8rem]">
                                        ${item?.price.toFixed(2)}
                                    </p>}
                                    <p className="text-[2rem] font-bold">
                                        ${(item?.price * (1 - (item?.offerPercentage || 0))).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious variant={"default"} />
            <CarouselNext variant={"default"} />
        </Carousel>
    </div>
}
export default BestSellingCarousel;