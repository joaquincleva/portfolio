import { Card } from "@/components/ui/card";
import { useCartContext } from "@/store/CartContext";
import { Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CartProducts = () => {

    const { cartContext, setCartContext } = useCartContext();

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
        <div ref={sectionRef}  className={`flex flex-col gap-4 w-full max-w-3xl mx-auto overflow-auto transition-opacity duration-700 ${isVisible ? "animate-fadeInUp" : "opacity-0"}`}>
            {cartContext.map((product) => (
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
                        <Trash2Icon
                            className="text-red-500 h-6 w-6 cursor-pointer"
                            onClick={() => {
                                const newCart = cartContext.filter(
                                    (cartProduct) =>
                                        cartProduct.product.id !== product.product.id
                                );
                                setCartContext(newCart);
                            }}
                        />
                    </div>
                </Card>
            ))}
        </div>
    )

}

export default CartProducts;