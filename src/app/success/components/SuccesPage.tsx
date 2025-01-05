"use client";
import { useEffect, useState } from "react";
import Confetti from 'react-confetti'
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartProductType, useCartContext } from "@/store/CartContext";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
    const { setCartContext } = useCartContext();
    const router = useRouter()
    const [redirectTime, setRedirectTime] = useState(15);

    const [buyedProducts, setBuyedProducts] = useState<CartProductType[]>([]);
    useEffect(() => {
        const cartData = localStorage.getItem("cartData");
        if (cartData) {
            try {
                const parsedCart = JSON.parse(cartData);
                if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                    setCartContext([]);
                    setBuyedProducts(parsedCart);
                    localStorage.removeItem("cartData");
                    return;
                }
            } catch (error) {
                console.error("Error parsing cartData:", error);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setRedirectTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/");
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex relative w-full pt-24 px-4 pb-8 flex-col items-center justify-center min-h-[83vh] bg-white">
            <Confetti
                className="h-full w-full"
                numberOfPieces={100}
            />
            <Card className="bg-gray-200 w-full gap-2 flex flex-col p-6 px-1.5 sm:px-2 md:x-4 lg:px-6 items-center">
                <h1 className="text-lg md:text-xl xl:text-3xl 2xl:text-3xl font-bold text-green-600">Purchase Successful!</h1>
                <Separator className="bg-gray-500 mt-3" />
                <p className="mt-4 font-light text text-center w-full lg:w-2/3 mb-3">
                    Thank you for your purchase. Your order has been placed successfully. You will be redirected to the homepage in {redirectTime} seconds.
                </p>
                {buyedProducts.map((product: CartProductType, index: number) => (
                    <Card
                        key={index}
                        className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 border-b border-gray-300"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={product.product.mainImage}
                                alt={product.product.name}
                                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28  object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="text-xs sm:text-base md:text-lg xl:text-2xl 2xl:text-3xl font-semibold">
                                    {product.product.name}
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="text-xs sm:text-base md:text-lg xl:text-2xl 2xl:text-3xl">
                                ${" "}
                                {(
                                    product.product.price *
                                    (1 - (product.product.offerPercentage || 0))
                                ).toFixed(2)}
                            </p>
                            <p className="text-xs sm:text-base md:text-lg xl:text-2xl 2xl:text-3xl text-[#de942c]">x{product.quantity}</p>
                            <p className="text-xs sm:text-base md:text-lg xl:text-2xl 2xl:text-3xl px-4 font-semibold">
                                ${" "}
                                {(
                                    product.product.price *
                                    (1 - (product.product.offerPercentage || 0)) *
                                    product.quantity
                                ).toFixed(2)}
                            </p>

                        </div>
                    </Card>
                ))}
            </Card>
        </div>
    );
};

export default SuccessPage;