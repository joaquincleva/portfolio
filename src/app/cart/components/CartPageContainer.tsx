"use client"
import { useCartContext } from "@/store/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

    return (
        <div
            className="bg-white items-center flex justify-center gap-10 pt-20 pb-8 h-screen w-full mx-auto z-50">
            <div className="flex flex-col gap-4 w-1/2 h-full pl-8">
                <p className="text-3xl place-self-start text-center py-4 w-full font-bold">
                    Funkos added to your cart!
                </p>
                <CartProducts />
            </div>
            <div
                ref={sectionRef} className={`w-1/2 h-full flex flex-col items-center justify-start transition-opacity duration-700 ${isVisible ? "animate-fadeInUp" : "opacity-0"}`}>
                <PaymentForm />
            </div>
        </div>
    );
};

export default CartPageContainer;
