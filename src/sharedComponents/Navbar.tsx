"use client"
import { Badge } from "@/components/ui/badge";
import Logo from "@/sharedComponents/Logo"
import { useCartContext } from "@/store/CartContext";
import { ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Navbar = () => {
    const [isTop, setIsTop] = useState(true);
    const router = useRouter();
    const { cartContext } = useCartContext()

    useEffect(() => {
        const handleScroll = () => {
            setIsTop(window.scrollY === 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div
            className={
                `w-full max-w-screen fixed px-4 md:px-10 flex justify-between items-center transition-all duration-500 delay-100 z-[55] ${isTop ? "h-20 bg-black" : "h-14 bg-white"
                }`}
        >
            <div className={`flex items-center hover:text-gray-500 text-white cursor-pointer ${!isTop ? "pl-15" : ""}`} onClick={() => { router.push("/") }}>
                <Logo fill={isTop ? "#fff" : "#6b7280"}
                    width={typeof window === "undefined" ? "2.5em" : isTop && window.innerWidth >= 768 ? "3.5em" : "2.5em"}
                    height={typeof window === "undefined" ? "2.5em" : isTop && window.innerWidth >= 768 ? "3.5em" : "2.5em"}
                />
                {isTop && <p className="hidden md:block pl-4 font-bold text-2xl">Cleva Tech</p>}
            </div>
            <ul className="list-none flex gap-x-4 tracking-wider font-semibold">

                {navbarRoutes.map((item: NavbarRoutesType, index: number) => (
                    <li
                        key={index}
                        className={`relative inline-block text-xs sm:text-sm lg:text-base cursor-pointer  ${!isTop ? "text-gray-500 hover:text-black" : "hover:text-gray-500 text-white"
                            } group`}
                        onClick={() => {
                            router.push(item.route);
                        }}
                    >
                        {item.label}
                        <span
                            className={`absolute left-0 top-[50%] h-[3px] w-full bg-current transition-all duration-500 ease-in-out transform scale-y-0 group-hover:scale-y-50 group-hover:top-[115%] group-focus:scale-y-250 group-focus:top-full`}
                        />
                    </li>
                ))}
                {cartContext.length > 0 && <li className={`flex cursor-pointer ${!isTop ? "text-gray-500 hover:text-black" : "text-white hover:text-gray-500"}`} onClick={() => { router.push("/cart") }}>
                    <ShoppingCartIcon className="w-6 h-6 " /> <Badge variant={"destructive"} className="rounded-full p-1 pt-1.5 h-4 hover:opacity-100">{cartContext.length}</Badge>
                </li>}
            </ul>
        </div>)
}

export default Navbar


interface NavbarRoutesType {
    route: string,
    label: string
}

const navbarRoutes: NavbarRoutesType[] = [
    {
        route: "/products",
        label: "Products"
    },
    {
        route: "/management",
        label: "Management"
    },
    {
        route: "/about",
        label: "About"
    }
]