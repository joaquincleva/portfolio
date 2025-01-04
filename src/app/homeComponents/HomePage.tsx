"use client"

import { useToast } from "@/hooks/use-toast";
import { Category } from "@/interfaces/Category";
import { Product } from "@/interfaces/Product";
import { serviceGetAllCategories } from "@/services/categories";
import { serviceGetAllProducts } from "@/services/products";
import { useEffect, useState } from "react";
import DraggableImage from "./DraggableImage";
import HeroSection from "./HeroSection";
import LoadingSpinner from "@/sharedComponents/LoadingSpinner";
import DealSection from "./DealsSection";
import BestSellingCarousel from "./BestSellingCarousel";
import CategoriesCard from "./CategoriesCard";
import HologramCard from "@/sharedComponents/HologramCard";

const HomePage = () => {
    
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [dealProducts, setdealProducts] = useState<Product[]>([]);
  const [mostSealedProducts, setMostSealedProducts] = useState<Product[]>([]);
  const [selectedDealProduct, setSelectedDealProduct] = useState(0)
  const [categories, setCategories] = useState<Category[]>([]);
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
        toast({
          description: "Couldn't get funkos.", variant: "destructive"
        })
      }
      try {
        const responseCategories = await serviceGetAllCategories();
        setCategories(responseCategories);
        setTexts(responseCategories.map((item: Category) => item.name))
      } catch (e) {
        toast({
          description: "Couldn't get categories.", variant: "destructive"
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
             <div className="absolute w-full max-w-screen h-full mx-auto flex items-center justify-center overflow-hidden">
              <div className="line ml-[50%]"></div>
              <div className="line ml-[25%]"></div>
              <div className="line"></div>
              <div className="line mr-[25%]"></div>
              <div className="line mr-[50%]"></div>
            </div>
            <DraggableImage images={products.map((item) => item.hologramImage)} />
            <div className="relative max-w-full w-full flex flex-col px-32">
                <HeroSection
                    categoriesCount={categoriesCount}
                    salesCount={salesCount}
                    productsCount={productsCount}
                    texts={texts}
                    currentText={currentText}
                    currentIndex={currentIndex}
                />
            </div>

            {loading ? (
                <div className="w-full items-center flex-col bg-white flex">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="relative h-full w-full flex flex-col items-center">
                    <DealSection categories={categories}
                        dealProducts={dealProducts}
                        remainingTime={remainingTime}
                        setSelectedDealProduct={setSelectedDealProduct}
                        selectedDealProduct={selectedDealProduct} />
                    <BestSellingCarousel mostSealedProducts={mostSealedProducts} categories={categories} />
                    <CategoriesCard categories={categories} products={products} />
                    <div key={1} className="w-full flex justify-center bg-white py-16 pt-20">
                        {products.filter((_, index) => index <= 4).map((item:Product, index:number) => (
                            <HologramCard key={index} index={index} item={item} categories={categories} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomePage