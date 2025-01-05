import { ArrowUpRight } from "lucide-react"
import { useRef } from "react";

interface HeroSectionProps {
    categoriesCount: number;
    salesCount: number;
    productsCount: number;
    texts: string[];
    currentText: string;
    currentIndex: number;
}

const HeroSection = ({ categoriesCount, salesCount, productsCount, texts, currentText, currentIndex }: HeroSectionProps) => {


    const constrain = 500;
    const containerRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        const box = boxRef.current;

        if (container && box) {
            const boxRect = box.getBoundingClientRect();
            const calcX = -(e.clientY - boxRect.y - boxRect.height / 2) / constrain;
            const calcY = (e.clientX - boxRect.x - boxRect.width / 2) / constrain;

            box.style.transform = `perspective(100px) rotateX(${calcX}deg) rotateY(${calcY}deg)`;
        }
    };

    const resetTransform = () => {
        const box = boxRef.current;
        if (box) {
            box.style.transform = "perspective(100px) rotateX(0deg) rotateY(0deg)";
        }
    };

    return (
        <div className="w-full text-white justify-center xl:justify-evenly flex items-center pb-28 flex-col-reverse lg:flex-row">
            <div className="flex flex-col gap-4 font-extrabold">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-x-4 gap-y-4 lg:gap-y-0">
                    <img src="./funkoLogo.png" width={175} />
                    <span className="text-3xl lg:text-4xl pt-4 uppercase font-extrabold text-[#de942c] font-mono">{currentText}{currentText.length !== texts[currentIndex].length && "|"}</span>
                </div>
                <p className="flex flex-col text-4xl xl:text-6xl text-center lg:text-left">
                    Your Official Funko Pop Store!
                </p>
                <p className="w-full lg:w-1/2 2xl:w-[1/4] 2xl:text-2xl text-center lg:text-left">
                    Discover the largest collection of exclusive Funko Pop!, limited editions and your favorite characters in one place.
                </p>
                <div className="flex flex-col items-center lg:items-start">
                    <p className="flex items-end gap-2 text-[#de942c] cursor-pointer group text-xl my-4 mb-6 w-full text-center justify-center lg:justify-start lg:w-1/4 py-1">
                        <span className="group-hover:border-b-2 border-[#de942c] ">Buy Now! </span>
                        <ArrowUpRight className="group-hover:border-b-2 pb-1 border-[#de942c] " />
                    </p>
                    <div className="flex gap-6">
                        <div className="flex flex-col text-center">
                            <p className="text-3xl">{categoriesCount}</p>
                            <p className="text-sm">Categorías</p>
                        </div>
                        <div className="flex flex-col text-center">
                            <p className="text-3xl">{salesCount}</p>
                            <p className="text-sm">Ventas</p>
                        </div>
                        <div className="flex flex-col text-center">
                            <p className="text-3xl">{productsCount}</p>
                            <p className="text-sm">Productos</p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                ref={containerRef}
                className="relative w-[250px] sm:w-[350px] md:w-[450px] lg:w-[700px] xl:w-[800x] p-10 flex items-center justify-center overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={resetTransform}
            >
                <div
                    ref={boxRef}
                    className="relative box"
                >
                    <img className="absolute right-[-2rem] top-[-1.5rem] w-[75px] md:w-[100px] lg:w-[125px]" src="./popLogo.png" width={125} />
                    <img className="rounded-3xl w-[175px] sm:w-[250px] md:w-[350px] lg:w-[500px] h-[175px] sm:h-[200px] md:h-[300px] lg:h-[450px]" src="./flayer.jpeg" />
                </div>
            </div>
            <div className="air air1 mt-48"></div>
        </div>
    )
}

export default HeroSection