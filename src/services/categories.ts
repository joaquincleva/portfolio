import { getDoc, getDocs, collection, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Category } from "@/interfaces/Category";

export const serviceGetAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    const allCategories: Category[] = [];
    querySnapshot.forEach((doc) => {
        allCategories.push({ ...doc.data(), id: doc.id } as Category);
    });
    return allCategories;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
    return [];
  }
};

export const serviceGetCategoryById = async (id: string) => {
  try {
    const document = doc(db, "categorias", id);
    const response = await getDoc(document);
    const category = {...response.data() as Category, id: id};
    return category;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
  }
};

export const serviceEditCategoryId = async (id: string, updatedCategory: Partial<Omit<Category, 'id'>>) => {
  try {
    const serviceRef = doc(db, "categorias", id);
    await updateDoc(serviceRef, updatedCategory);
    return true;
  } catch (e) {
    console.error("Error al editar la categoría: ", e);
    throw new Error("No se pudo editar la categoría.");
  }
};

export const serviceCreateCategory = async (
  category: Omit<Category, "id">
): Promise<void> => {
  try {
    const categoryRef = collection(db, "categorias");
    await addDoc(categoryRef, category);
  } catch (error) {
    console.error("Error al agregar categoría: ", error);
  }
};

export const serviceDeleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(db, "categorias", id);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error al eliminar la categoría: ", error);
    throw new Error("No se pudo eliminar la categoría.");
  }
};