"use client";
import { Product } from "@/interfaces/Product";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartProductType{
    product: Product;
    quantity: number;
}

interface CartContextType {
  cartContext: CartProductType[];
  setCartContext: (noticia: CartProductType[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartContext, setCartContext] = useState<CartProductType[]>([]);

  return (
    <CartContext.Provider
      value={{
        cartContext,
        setCartContext,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      "useCart debe ser usando dentro de cartContextProvider"
    );
  }
  return context;
};