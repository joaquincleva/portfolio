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

const BestSellingCarousel = ({ mostSealedProducts, categories }: BestSellingCarouselProps) => {

    const router = useRouter();

    return <div className="w-full h-96 max-w-screen">
        <Carousel className="w-full bg-transparent h-96" style={{
            backgroundImage: `url('background-carousel.jpg')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom"
        }}>
            <CarouselContent className="h-96 max-w-screen" >

                {mostSealedProducts.map((item, index) => (
                    <CarouselItem key={index} className="bg-transparent border-none border-0 h-full" >
                        <div className="p-1 bg-transparent lg:h-full flex flex-col w-full  lg:flex-row items-center justify-center">
                            <div className="lg:w-1/3 pr-8 lg:pr-0 h-full flex flex-col justify-between items-center w-full ">
                                <div className="w-full ml-8 h-1/5 lg:h-full lg:ml-24 mt-4 flex flex-row lg:flex-col justify-between">
                                    <div className="rounded-full p-0 w-[75px] text-[#6b7280]">
                                        <Logo 
                                            // height={`${window.innerWidth >= 1280 ? "125px" : window.innerWidth >= 1024 ? "75px" : "45px"}`}
                                            // width={`${window.innerWidth >= 1280 ? "125px" : window.innerWidth >= 1024 ? "75px" : "45px"}`}
                                            height="45px"
                                            width="45px"
                                            fill="#6b7280" />
                                    </div>
                                    <p className="lg:hidden block text-sm sm:text-xl text-center w-1/2 justify-self-end pl-4 lg:pl-0 text-blue-500 font-bold">Best Selling Funkos!</p>
                                    <div className="flex w-full flex-col justify-center h-full items-end">
                                        <span className="block self-end text-[#de942c] lg:text-xl  font-bold">
                                            {categories.filter((categoryItem: any) => {
                                                return categoryItem.id === item.categoryId
                                            })[0]?.name}
                                        </span>
                                        <p className="lg:mb-4 w-full text-2xl lg:text-5xl pb-2 lg:pb-4 font-extrabold text-end text-white">{item.name}</p>

                                        <p onClick={() => { router.push(`/product/${item.id}`) }} className="flex w-auto justify-center items-end hover:bg-[#6b7280] hover:text-white bg-white px-3 pt-1.5 rounded-full text-black cursor-pointer group text-xl lg:my-4 lg:mb-6 py-1">
                                            <span className=" font-bold text-sm ">Buy Now! </span>
                                            <ArrowRightCircle className="h-5" />
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <div className="w-1/3 flex flex-col h-full justify-center items-center">
                                <img className="rounded-full" alt={item.name} src={item.hologramImage} 
                                width={300} height={300}
                                // width={`${window.innerWidth >= 1280 ? 450 : window.innerWidth >= 1024 ? 300 : window.innerWidth >= 768 ? 200 : 250}`} 
                                />
                            </div>
                            <div className="w-full lg:w-1/3 flex flex-col h-full justify-around items-center text-white">
                                <p className="hidden lg:block text-3xl text-start w-full text-blue-500 font-extrabold">Best Selling Funkos!</p>
                                <p className="px-8 lg:px-0 lg:pr-40 text-xs">{item.description.slice(0, 200)}{item.description.length > 200 && "..."}</p>
                                <div className="flex lg:pr-0 pr-8 flex-col w-full items-end lg:items-start">
                                    {item?.offerPercentage && <p className="line-through text-[0.8rem]">
                                        ${item?.price.toFixed(2)}
                                    </p>}
                                    <p className="lg:text-[2rem] font-bold">
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