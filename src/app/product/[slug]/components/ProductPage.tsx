"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Category } from "@/interfaces/Category";
import { Product } from "@/interfaces/Product";
import { serviceGetAllCategories } from "@/services/categories";
import { serviceGetProductById } from "@/services/products";
import LoadingSpinner from '@/sharedComponents/LoadingSpinner';
import { useCartContext } from "@/store/CartContext";
import { ShoppingCart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ProductPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [qtyToAdd, setQtyToAdd] = useState<number>(0);
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const { cartContext, setCartContext } = useCartContext();
    const params = useParams();

    useEffect(() => {

        const fetchData: any = async () => {
            setLoading(true);
            try {
                const imagesToAdd = []
                const responseProducts: any = await serviceGetProductById(typeof params?.slug === "string" ? params.slug : "");
                if (responseProducts.name) { 
                    setProduct(responseProducts) 
                } else {
                    router.push("/")
                };
                if (responseProducts?.mainImage) imagesToAdd.push(responseProducts.mainImage);
                if (responseProducts?.images) imagesToAdd.push(...responseProducts.images);
                if (responseProducts?.hologramImage) imagesToAdd.push(responseProducts.hologramImage);
                setImages(imagesToAdd);
            } catch (e) {
                toast({
                    description: "Couln't get product.", variant: "destructive"
                })
            }
            try {
                const responseCategories = await serviceGetAllCategories();
                setCategories(responseCategories);
            } catch (e) {
                toast({
                    description: "Couldn't get categories.", variant: "destructive"
                })
            }
            finally {
                setLoading(false);
            }
        };
        if (params.slug) {
            fetchData();
        }
    }, [params]);

    const containerRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const [zoomActive, setZoomActive] = useState(false);

    const updateSpotlight = (
        e: React.MouseEvent<HTMLDivElement>,
        spotlightSize: string = 'transparent 160px, rgba(0, 0, 0, 0.85) 200px)',
        backgroundImage: string = ""
    ) => {
        const box = boxRef.current;
        if (!box) return;

        const posX = (e.pageX / (window.innerWidth * 1.25)) * 100;
        const posY = (e.pageY / window.innerHeight) * 100;

        if (backgroundImage) {
            box.style.backgroundImage = backgroundImage;
        } else {
            box.style.backgroundImage = `radial-gradient(circle at ${posX}% ${posY}%, ${spotlightSize})`;
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setZoomActive(true);
        updateSpotlight(e, 'transparent 100px, rgba(0, 0, 0, 0.80) 120px');
    };

    const handleMouseUp = () => {
        setZoomActive(false);
        if (boxRef.current) {
            boxRef.current.style.backgroundImage = "none";
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoomActive) {
            updateSpotlight(e, 'transparent 100px, rgba(0, 0, 0, 0.80) 120px');
        }
    };

    const handleMouseLeave = () => {
        setZoomActive(false);
        if (boxRef.current) {
            boxRef.current.style.backgroundImage = "none";
        }
    };

    return <div className={`bg-white items-center min-h-screen justify-center gap-10 pt-20 pb-8 w-full mx-auto z-50 ${loading && "flex"}`}>
        {loading ? (
            <div className="w-full h-full items-center flex-col flex justify-center">
                <LoadingSpinner path="./loading.gif"/>
            </div>
        ) : (
            <div className="w-full h-full pt-4 px-16">
                <div className="flex items-center justify-between w-full h-full">
                    <div className="h-[75vh] min-w-96 flex flex-col justify-around items-center w-1/3">
                        <div className="flex-col w-full">
                            <p className="w-full text-xl text-right text-[#de942c] font-bold">
                                {categories.find((categoryItem) => categoryItem.id === product?.categoryId)?.name}
                            </p>
                            <p className="w-full text-3xl text-center font-extrabold">{product?.name}</p>
                        </div>
                        <p className="w-full text-justify">{product?.description}</p>
                        <div className="flex flex-col w-full items-start">
                            {product?.offerPercentage && (
                                <p className="line-through text-[0.8rem]">${product?.price.toFixed(2)}</p>
                            )}
                            <div className="w-full text-[2rem] font-bold items-center justify-between flex">
                                <div className="flex items-center">
                                    <span>${((product?.price || 1) * (1 - (product?.offerPercentage || 0))).toFixed(2)}</span>
                                    {product?.offerPercentage && (
                                        <span className="text-[#de942c] text-lg pl-4">
                                            {product?.offerPercentage ? `${product?.offerPercentage * 100} %OFF` : " "}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm font-medium`}>
                                    Stock available: <span className={`${product?.stock === 0 && "text-red-500"}`}>{product?.stock}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full gap-0.5 justify-center items-center">
                            <Button
                                disabled={qtyToAdd === 0}
                                className="bg-[#de942c] hover:brightness-110 hover:bg-[#de942c] text-black hover:text-black text-xl px-4" onClick={() => setQtyToAdd(qtyToAdd === 0 ? 0 : qtyToAdd - 1)}>-</Button>
                            <Input
                                type="number"
                                className="w-24 text-right mx-1.5"
                                value={qtyToAdd}
                                onChange={(e) => {
                                    if (e.target.value === "") return setQtyToAdd(0);
                                    else if (Number(e.target.value) > (product?.stock || 0)) {
                                        setQtyToAdd(product?.stock || 0);
                                    } else if (Number(e.target.value) < 0) {
                                        setQtyToAdd(0);
                                    } else {
                                        setQtyToAdd(Number(e.target.value))
                                    }
                                }}
                            />
                            <Button
                                disabled={product?.stock === 0 || qtyToAdd >= (product?.stock || 0)}
                                className="bg-[#de942c] hover:brightness-110 hover:bg-[#de942c] text-black hover:text-black text-xl px-4" onClick={() => setQtyToAdd(qtyToAdd + 1)}>+</Button>
                            <Button
                                disabled={product?.stock === 0 || qtyToAdd === 0}
                                className="ml-2 bg-blue-500 hover:brightness-110 hover:bg-blue-500"
                                onClick={() => {
                                    setCartContext([...cartContext, { product: product as Product, quantity: qtyToAdd }]);
                                }}
                            >
                                Add to cart
                                <ShoppingCart />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full ml-20 flex items-center gap-6 flex-col justify-center h-full overflow-x-visible ">
                        <div className="relative border-4 border-black rounded-xl p-1 w-2/3 h-full">
                            {product?.stock === 0 && !zoomActive && <div className="info absolute  bottom-auto w-full h-full  bg-transparent flex justify-center items-center  transition-all duration-500 ease-linear">
                                <p className="rotate-12 z-50 border-red-500 border-4 bg-[#ffffffcc] text-red-500 font-extrabold text-6xl rounded-lg py-2 px-6">
                                    Sold out
                                </p>
                            </div>}
                            <div
                                ref={containerRef}
                                className="relative w-full h-80 rounded-xl"
                                style={{
                                    backgroundImage: `url(${images[imageIndex]})`,
                                    backgroundSize: zoomActive ? "125%" : "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center center",
                                    cursor: "zoom-in",
                                    transition: "background-size 0.3s ease",
                                }}
                            >
                                <div
                                    ref={boxRef}
                                    style={{
                                        position: "absolute",
                                        height: "100%",
                                        width: "100%",
                                        transition: "background-image 0.3s ease",
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                ></div>
                            </div>
                        </div>
                        <div className="flex w-full max-w-2/3 justify-center items-center gap-4">
                            {images.map((image, index) => (
                                <div
                                    onClick={() => setImageIndex(index)}
                                    key={index}
                                    className={`w-[15%] h-20 cursor-pointer rounded-xl ${imageIndex === index ? "border-2 border-[#de942c]" : "border-2 border-black"}`}
                                    style={{
                                        backgroundImage: `url(${image})`,
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center center",
                                    }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div >
}
export default ProductPage;