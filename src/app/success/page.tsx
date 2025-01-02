"use client";
import { useEffect, useState } from "react";
import { loadFull } from "tsparticles";
import { tsParticles } from "@tsparticles/engine";
import Confetti from 'react-confetti'
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartProductType, useCartContext } from "@/store/CartContext";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
    const { setCartContext } = useCartContext();
    const router = useRouter()
    const [buyedProducts, setBuyedProducts] = useState<CartProductType[]>([]);
    const [redirectTime, setRedirectTime] = useState(15);

    useEffect(() => {
        const cartData = localStorage.getItem("cartData");
        if (cartData) {
            setCartContext([]);
            const parsedCart = JSON.parse(cartData);
            setBuyedProducts(parsedCart);
            localStorage.removeItem("cartData");
        } else {
            router.push("/")
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
    }, [router]);

    return (
        <div className="flex relative w-full pt-24 pb-8 flex-col items-center justify-center min-h-screen bg-white">
            <Confetti
                width={window.innerWidth - 15}
                numberOfPieces={100}
            // tweenDuration={1000}
            />
            <Card className="bg-gray-200 max-w-1/3 gap-2 flex flex-col p-6 items-center">
                <h1 className="text-3xl font-bold text-green-600">Purchase Successful!</h1>
                <Separator className="bg-gray-500 mt-3" />
                <p className="mt-4 font-light text text-center w-2/3 mb-3">
                    Thank you for your purchase. Your order has been placed successfully. You will be redirected to the homepage in {redirectTime} seconds.
                </p>
                {buyedProducts.map((product) => (
                    <Card
                        key={product.product.id}
                        className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 border-b border-gray-300"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={product.product.mainImage}
                                alt={product.product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {product.product.name}
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="text-base">
                                ${" "}
                                {(
                                    product.product.price *
                                    (1 - (product.product.offerPercentage || 0))
                                ).toFixed(2)}
                            </p>
                            <p className="text-base text-[#de942c]">x{product.quantity}</p>
                            <p className="text-lg px-4 font-semibold">
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
                {buyedProducts.map((product) => (
                    <Card
                        key={product.product.id}
                        className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 border-b border-gray-300"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={product.product.mainImage}
                                alt={product.product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {product.product.name}
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="text-base">
                                ${" "}
                                {(
                                    product.product.price *
                                    (1 - (product.product.offerPercentage || 0))
                                ).toFixed(2)}
                            </p>
                            <p className="text-base text-[#de942c]">x{product.quantity}</p>
                            <p className="text-lg px-4 font-semibold">
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
                {buyedProducts.map((product) => (
                    <Card
                        key={product.product.id}
                        className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 border-b border-gray-300"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={product.product.mainImage}
                                alt={product.product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {product.product.name}
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="text-base">
                                ${" "}
                                {(
                                    product.product.price *
                                    (1 - (product.product.offerPercentage || 0))
                                ).toFixed(2)}
                            </p>
                            <p className="text-base text-[#de942c]">x{product.quantity}</p>
                            <p className="text-lg px-4 font-semibold">
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
                {buyedProducts.map((product) => (
                    <Card
                        key={product.product.id}
                        className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 border-b border-gray-300"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={product.product.mainImage}
                                alt={product.product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {product.product.name}
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="text-base">
                                ${" "}
                                {(
                                    product.product.price *
                                    (1 - (product.product.offerPercentage || 0))
                                ).toFixed(2)}
                            </p>
                            <p className="text-base text-[#de942c]">x{product.quantity}</p>
                            <p className="text-lg px-4 font-semibold">
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
