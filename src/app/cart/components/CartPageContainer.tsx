"use client"
import { useCartContext } from "@/store/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CartProducts from "./CartProducts";
import PaymentForm from "./PaymentForm";

const CartPageContainer = () => {

    const { cartContext } = useCartContext();
    const router = useRouter();

    useEffect(() => {
        if (cartContext.length === 0) {
            router.push("/");
        }
    }, [cartContext, router]);

    return (
        <div className="bg-white items-center flex justify-center gap-10 pt-20 pb-8 h-screen w-full mx-auto z-50">
            <div className="flex flex-col gap-4 w-1/2 h-full pl-8">
                <p className="text-3xl place-self-start text-center py-4 w-full font-bold">
                    Funkos added to your cart!
                </p>
                <CartProducts />
            </div>
            <div className="w-1/2 h-full flex flex-col items-center justify-start">
                <PaymentForm />
            </div>
        </div>
    );
};

export default CartPageContainer;
