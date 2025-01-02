"use client"
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import DraggableImage from "./homeComponents/DraggableImage";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/interfaces/Category";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/Product";
import { serviceGetAllProducts } from "@/services/products";
import { serviceGetAllCategories } from "@/services/categories";
import LoadingSpinner from "@/sharedComponents/LoadingSpinner";
import { ArrowRightCircle, ArrowUpRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Logo from "@/sharedComponents/Logo";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [dealProducts, setdealProducts] = useState<Product[]>([]);
  const [mostSealedProducts, setMostSealedProducts] = useState<Product[]>([]);
  const [selectedDealProduct, setSelectedDealProduct] = useState(0)
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [texts, setTexts] = useState([""])



  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 1500;

  useEffect(() => {
    const fullText = texts[currentIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText((prev) => fullText.slice(0, prev.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setCurrentText((prev) => fullText.slice(0, prev.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
          setCurrentText("")
        }
      }
    };

    const typingTimeout = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(typingTimeout);
  }, [currentText, isDeleting, currentIndex, texts]);

  const constrain = 500;
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  useEffect(() => {
    setRemainingTime(dealProducts[selectedDealProduct]?.offerTime ?? 0)
  }, [selectedDealProduct])

  const formatTime = (seconds: number): string => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

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

  useEffect(() => {
    const fetchData: any = async () => {
      setLoading(true);
      try {
        const responseProducts = await serviceGetAllProducts();
        setProducts(responseProducts);
        setdealProducts(responseProducts.filter((item: Product, index: number) => item?.offerPercentage != null)
          .sort((a, b) => b.offerPercentage! - a.offerPercentage!)
          .slice(0, 5))
        setMostSealedProducts(responseProducts.filter((item) => item.stock > 0).sort((a, b) => b.salesQty! - a.salesQty!)
          .slice(0, 5))
        setRemainingTime(responseProducts[0]?.offerTime ?? 0)
      } catch (e) {
        console.error("Ha ocurrido un error en la petición.");
        toast({
          description: "No se han podido obtener los usuarios."
        })
      }
      try {
        const responseCategories = await serviceGetAllCategories();
        setCategories(responseCategories);
        setTexts(responseCategories.map((item) => item.name))
      } catch (e) {
        console.error("Ha ocurrido un error en la petición.");
        toast({
          description: "No se han podido obtener las categorías de servivios."
        })
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [categoriesCount, setCategoriesCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  const animateValue = (start: number, end: number, duration: number, setValue: (val: number) => void) => {
    const stepTime = 16;
    const steps = Math.ceil(duration / stepTime);
    const stepValue = (end - start) / steps;
    let currentValue = start;

    const step = () => {
      currentValue += stepValue;
      if ((stepValue > 0 && currentValue >= end) || (stepValue < 0 && currentValue <= end)) {
        setValue(end);
        return;
      }
      setValue(Math.floor(currentValue));
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (categories.length > 0) {
      animateValue(0, categories.length, 1000, setCategoriesCount);
    }

    if (products.length > 0) {
      const totalSales = products.reduce((a, b) => a + b.salesQty || 0, 0);
      animateValue(0, totalSales, 1000, setSalesCount);
      animateValue(0, products.length, 1000, setProductsCount);
    }
  }, [categories, products]);
  return (
    <div className="relative mt-16 w-full h-auto z-10 justify-between">
      
      <DraggableImage images={products.map((item) => item.hologramImage)} />
      <div className="relative max-w-full w-full flex flex-col px-32">
        <div className="w-full text-white justify-center flex items-center  mb-24">
          <div className="flex flex-col gap-4 font-extrabold">
            <div className="flex items-center gap-4">
              <img src="./funkoLogo.png" width={175} />
              <span className="text-4xl pt-4 uppercase font-extrabold text-[#de942c] font-mono">{currentText}{currentText.length !== texts[currentIndex].length && "|"}</span>
            </div>
            <p className="flex flex-col text-4xl ">
              Your Official Funko Pop Store!
            </p>
            <p className="w-1/2">
              Discover the largest collection of exclusive Funko Pop!, limited editions and your favorite characters in one place.
            </p>
            <div className="flex flex-col ">
              <p className="flex items-end gap-2 text-[#de942c] cursor-pointer group text-xl my-4 mb-6 w-1/4 py-1">
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
            className="relative w-[600px] p-10 flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTransform}
          >
            <div
              ref={boxRef}
              className="relative box"
            >
              <img className="absolute right-[-2rem] top-[-1.5rem]" src="./popLogo.png" width={125} />
              <img className="rounded-3xl " src="./flayer.jpeg" width={500} height={350} />
            </div>
          </div>
          <div className="air air1 mt-48"></div>
        </div>
      </div>

      {loading ? (
        <div className="w-full items-center flex-col bg-white flex">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="relative h-full w-full flex flex-col items-center">
          <div className="z-50 text-black bg-white flex items-center py-20 px-32">
            <div className="flex items-center justify-center w-2/4">
              <div className="cursor-pointer minip flex justify-end group mx-auto w-[300px] h-[450px] bg-gray-300 relative">
                <div className="mg absolute top-0 left-0 w-full h-[200px] grid grid-cols-[250px_50px] grid-rows-[100px_150px] transition-[grid-template-columns,grid-template-rows] duration-500 ease-linear group-hover:grid-cols-[150px_150px] group-hover:grid-rows-[50px_300px]">
                  <div className="relative clr bg-[#333]">
                    <img className="absolute -left-8 -rotate-45" width={75} src="./deal-ballon.png" />
                    <p className="p-2 w-fit text-xl font-bold text-center rounded-full px-4 text-white -rotate-45 absolute -left-9 top-1.5">-{dealProducts[selectedDealProduct]?.offerPercentage ? dealProducts[selectedDealProduct]?.offerPercentage * 100 : 0}%</p>
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
                <a
                  href="/"
                  className="plot absolute bottom-[75px] left-[50px] w-[90px] h-[25px] bg-blue-500 text-white text-[10px] uppercase tracking-[1px] font-mono flex items-center justify-center transition-all duration-500 ease-linear group-hover:bottom-[25px]"
                >
                  BUY →
                </a>
                {dealProducts[selectedDealProduct]?.stock === 0 && <div className="info absolute  bottom-auto top-auto left-0 w-full h-full  bg-transparent flex justify-center items-center  transition-all duration-500 ease-linear">
                  <p className="rotate-12 border-red-500 border-4 bg-[#ffffffcc] text-red-500 font-extrabold text-4xl rounded-lg py-2 px-6">
                    Sold out
                  </p>
                </div>}
              </div>
              <div className="flex gap-2 w-1/5 pr-32 flex-col items-center">
                <p onClick={() => { setSelectedDealProduct(0) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 0 ? "text-[#de942c]" : "text-gray-400"} px-3.5 pt-1 hover:text-[#de942c]`}>01</p>
                <p onClick={() => { setSelectedDealProduct(1) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 1 ? "text-[#de942c]" : "text-gray-400"} px-3 pt-1 hover:text-[#de942c]`}>02</p>
                <p onClick={() => { setSelectedDealProduct(2) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 2 ? "text-[#de942c]" : "text-gray-400"} px-3 pt-1 hover:text-[#de942c]`}>03</p>
                <p onClick={() => { setSelectedDealProduct(3) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 3 ? "text-[#de942c]" : "text-gray-400"} px-3 pt-1 hover:text-[#de942c]`}>04</p>
                <p onClick={() => { setSelectedDealProduct(4) }} className={`cursor-pointer font-extrabold text-lg rounded ${selectedDealProduct === 4 ? "text-[#de942c]" : "text-gray-400"} px-3 pt-1 hover:text-[#de942c]`}>05</p>
              </div>
            </div>
            <div className="flex relative items-center gap-6 flex-col w-2/5">
              <p className="text-4xl font-extrabold text-blue-500 absolute left-[-75px] top-[-75px] -rotate-[12deg]">Funko Pop Deals!</p>
              <p className="text-4xl font-extrabold">Collect Your Favorites at Discounted Prices</p>
              <p className="">Discover amazing discounts on a wide selection of Funko Pop! figures. Grab your favorite characters from movies, TV shows, and more before they're gone!</p>
            </div>

          </div>
          <div className="w-full h-96">
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

                          <p className="flex w-auto justify-center items-end hover:bg-[#6b7280] hover:text-white bg-white px-3 pt-1.5 rounded-full text-black cursor-pointer group text-xl my-4 mb-6 py-1">
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
          <div className="w-full flex-wrap justify-center gap-6 px-10 flex py-16">
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
          <div className="w-full flex justify-center bg-white py-16 pt-20">
            {products.filter((_, index) => index <= 4).map((item, index) => (
              <a
                key={index}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-[200px] h-[300px] rounded-xl flex-col relative flex justify-center items-end mx-6 perspective"
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
                <img
                  src={item.hologramImage}
                  alt=""
                  className="absolute perspectiveHologram self-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-[-20%]"
                />
              </a>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}
