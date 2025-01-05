import { Category } from "@/interfaces/Category";
import { Product } from "@/interfaces/Product";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface DealSectionsProps {
    categories: Category[];
    dealProducts: Product[];
    remainingTime: number;
    setSelectedDealProduct: (index: number) => void;
    selectedDealProduct: number;
}

const DealSection = ({ categories,
    dealProducts,
    remainingTime, setSelectedDealProduct,
    selectedDealProduct }: DealSectionsProps) => {

    const router = useRouter();
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

    const formatTime = (seconds: number): string => {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    return (
        <div className="z-50 text-black bg-white w-full flex items-center justify-center flex-col-reverse lg:flex-row py-20 px-8 lg:px-32">
            <div className="flex justify-center items-center w-full lg:w-1/3">
                <div ref={sectionRef} className={`flex items-center justify-center lg:w-auto transition-opacity duration-700 ${isVisible ? "animate-fadeInUp" : "opacity-0"}`}>
                    <div className="cursor-pointer minip flex justify-end group w-[300px] h-[450px] bg-gray-300 relative">
                        <div className="mg absolute top-0 left-0 w-full h-[200px] grid grid-cols-[250px_50px] grid-rows-[100px_150px] transition-[grid-template-columns,grid-template-rows] duration-500 ease-linear group-hover:grid-cols-[150px_150px] group-hover:grid-rows-[50px_300px]">
                            <div className="relative clr bg-[#333]">
                                <img className="absolute lg:-left-8 -rotate-45" width={75} src="./deal-ballon.png" />
                                <p className="p-2 w-fit text-xl font-bold text-center rounded-full px-4 text-white -rotate-45 absolute -left-1 lg:-left-9 top-1.5">-{dealProducts[selectedDealProduct]?.offerPercentage ? dealProducts[selectedDealProduct]?.offerPercentage * 100 : 0}%</p>
                            </div>
                            <div className="group flex items-center justify-center text-[10px] uppercase tracking-[1px] font-mono writing-mode-vertical-lr">
                                <span className="block text-sm font-bold rotate-90 transition-transform duration-500  ease-linear group-hover:rotate-0">
                                    {categories.filter((item: any) => {
                                        return item.id === dealProducts[selectedDealProduct].categoryId
                                    })[0]?.name}
                                </span>
                            </div>
                        </div>
                        <div
                            className="av absolute bottom-0 right-0 w-[200px] h-[350px] bg-top bg-cover transition-all duration-500 ease-linear group-hover:w-[250px] group-hover:h-[400px]"
                            style={{
                                backgroundImage: `url('${dealProducts[selectedDealProduct]?.mainImage}')`,
                            }}
                        ></div>
                        <div className="info absolute bottom-[100px] left-0 w-[140px] max-h-[100px] bg-[#de942c] flex flex-col justify-center transition-all duration-500 ease-linear group-hover:bottom-[50px]">
                            <div className="name text-center mt-[5px] text-xl font-bold tracking-[1px] font-display">
                                {dealProducts[selectedDealProduct]?.name}
                            </div>
                            <div className="deets text-[10px] leading-[15px] items-start px-5 flex flex-col uppercase tracking-[1px] font-mono">
                                <div className="flex flex-col justify-end">
                                    <p className="line-through text-[0.7rem]">
                                        ${dealProducts[selectedDealProduct]?.price.toFixed(2)}
                                    </p>
                                    <p className="text-[1.2rem] font-bold">
                                        ${(dealProducts[selectedDealProduct]?.price * (1 - (dealProducts[selectedDealProduct]?.offerPercentage || 0))).toFixed(2)}
                                    </p>
                                </div>
                                {remainingTime > 0 ? (
                                    <p className="mb-2">
                                        <span className="font-bold">{formatTime(remainingTime)}</span>
                                    </p>
                                ) : (
                                    <p className="mt-2 mb-2">Oferta finalizada</p>
                                )}
                            </div>
                        </div>
                        <span
                            onClick={() => { router.push(`/product/${dealProducts[selectedDealProduct]?.id}`) }}
                            className="plot absolute bottom-[75px] left-[50px] w-[90px] h-[25px] bg-blue-500 text-white text-[10px] uppercase tracking-[1px] font-mono flex items-center justify-center transition-all duration-500 ease-linear group-hover:bottom-[25px]"
                        >
                            BUY →
                        </span>
                        {dealProducts[selectedDealProduct]?.stock === 0 && <div className="info absolute  bottom-auto top-auto left-0 w-full h-full  bg-transparent flex justify-center items-center  transition-all duration-500 ease-linear">
                            <p className="rotate-12 border-red-500 border-4 bg-[#ffffffcc] text-red-500 font-extrabold text-4xl rounded-lg py-2 px-6">
                                Sold out
                            </p>
                        </div>}
                    </div>
                </div>
                <div className="flex gap-2 w-1.5/5 lg:pr-32 flex-col justify-center">
                    <p onClick={() => { setSelectedDealProduct(0) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 0 ? "text-[#de942c]" : "text-gray-400"} px-3.5 pt-1 hover:text-[#de942c]`}>01</p>
                    <p onClick={() => { setSelectedDealProduct(1) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 1 ? "text-[#de942c]" : "text-gray-400"} px-3 pt-1 hover:text-[#de942c]`}>02</p>
                    <p onClick={() => { setSelectedDealProduct(2) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 2 ? "text-[#de942c]" : "text-gray-400"} px-3 pt-1 hover:text-[#de942c]`}>03</p>
                    <p onClick={() => { setSelectedDealProduct(3) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 3 ? "text-[#de942c]" : "text-gray-400"} px-3 pt-1 hover:text-[#de942c]`}>04</p>
                    <p onClick={() => { setSelectedDealProduct(4) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 4 ? "text-[#de942c]" : "text-gray-400"} px-3 pt-1 hover:text-[#de942c]`}>05</p>
                </div>
            </div>
            <div className="flex relative items-start mb-10 lg:mb-0 gap-6 flex-col w-full lg:w-1/2 xl:w-auto">
                <p className="text-3xl lg:text-4xl font-extrabold text-blue-500 absolute left-[-25px] xl:left-[-75px] top-[-40px] lg:top-[-75px]  -rotate-[12deg]">Funko Pop Deals!</p>
                <p className="text-4xl text-center lg:text-left font-extrabold">Collect Your Favorites at Discounted Prices</p>
                <p className="">Discover amazing discounts on a wide selection of Funko Pop! figures. Grab your favorite characters from movies, TV shows, and more before they're gone!</p>
            </div>
        </div>
    )
}

export default DealSection;