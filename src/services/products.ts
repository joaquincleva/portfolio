import { getDoc, getDocs, collection, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Product } from "@/interfaces/Product";

export const serviceGetAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const allProducts: Product[] = [];
    querySnapshot.forEach((doc) => {
        allProducts.push({ ...doc.data(), id: doc.id } as Product);
    });
    return allProducts;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
    return [];
  }
};

export const serviceGetProductById = async (id: string) => {
  try {
    const document = doc(db, "productos", id);
    const response = await getDoc(document);
    const product = {...response.data() as Product, id: id};
    return product;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
  }
};

export const serviceEditProductId = async (id: string, updatedProduct: Partial<Omit<Product, 'id'>>) => {
  try {
    const serviceRef = doc(db, "productos", id);
    await updateDoc(serviceRef, updatedProduct);
    return true;
  } catch (e) {
    console.error("Error al editar el producto: ", e);
    throw new Error("No se pudo editar el producto.");
  }
};

export const serviceCreateProduct = async (
  product: Omit<Product, "id">
): Promise<void> => {
  try {
    const productRef = collection(db, "productos");
    await addDoc(productRef, product);
  } catch (error) {
    console.error("Error al agregar producto: ", error);
  }
};

export const serviceUpdateProductStockAndSales = async (
  id: string,
  quantitySold: number
) => {
  try {
    const productRef = doc(db, "productos", id);
    const productSnapshot = await getDoc(productRef);
    if (!productSnapshot.exists()) {
      throw new Error("Product not found");
    }
    const productData = productSnapshot.data() as Product;
    const updatedData = {
      stock: productData.stock - quantitySold,
      salesQty: productData.salesQty + quantitySold,
    };
    await updateDoc(productRef, updatedData);
  } catch (error) {
    console.error("Error updating product: ", error);
    throw new Error("Failed to update product stock and sales.");
  }
};

export const serviceDeleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, "productos", id);
    await deleteDoc(productRef);
  } catch (error) {
    throw new Error("No se pudo eliminar el producto.");
  }
};