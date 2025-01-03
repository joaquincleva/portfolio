"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useFormik } from "formik";
import * as yup from "yup";
import { serviceCreateCategory, serviceDeleteCategory, serviceEditCategoryId, serviceGetAllCategories } from "@/services/categories";
import { serviceCreateProduct, serviceDeleteProduct, serviceEditProductId, serviceGetAllProducts } from "@/services/products";
import { Category } from "@/interfaces/Category";
import { Product } from "@/interfaces/Product";
import { DataTable } from "./data-table";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import CreateOrEditDialog from "./CreateOrEditDialog";

const ManagementPage = () => {
    const [editItem, setEditItem] = useState<Category | Product | null>(null);
    const [isProductTab, setIsProductTab] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([])
    useEffect(() => {
        const fetchData: any = async () => {
            setLoading(true)
            try {
                const fetchedProducts = await serviceGetAllProducts();
                setProducts(fetchedProducts)
            } catch (e) {
                toast({ description: "Couldn't get funkos", variant: "destructive" })
            }
            try {
                const fetchedCategories = await serviceGetAllCategories();
                setCategories(fetchedCategories)
            } catch (e) {
                toast({ description: "Couldn't get categories", variant: "destructive" })
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, []);

    const categoryValidationSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        image: yup.string().url("Must be a valid URL").required("Image is required"),
    });

    const productValidationSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string().optional(),
        mainImage: yup.string().url("Must be a valid URL").required(),
        hologramImage: yup
            .string()
            .url("Must be a valid URL")
            .matches(/\.png$/, "Must be a .png file")
            .required(),
        images: yup.array().of(yup.string().url("Must be a valid URL")).required(),
        price: yup.number().positive("Must be a positive number").required("Price is required"),
        stock: yup.number().integer("Must be an integer").optional(),
        salesQty: yup.number().integer("Must be an integer").optional(),
        offerPercentage: yup
            .number()
            .min(0, "Must be at least 0")
            .max(100, "Must be at most 100")
            .optional(),
        categoryId: yup.string().required("Category is required"),
    });

    const formik = useFormik({
        initialValues: isProductTab
            ? {
                name: "",
                description: "",
                mainImage: "",
                hologramImage: "",
                images: [] as string[],
                price: 0,
                stock: 0,
                salesQty: 0,
                offerTime: 0,
                offerPercentage: 0,
                categoryId: "",
            }
            : {
                name: "",
                image: "",
            },
        validationSchema: isProductTab ? productValidationSchema : categoryValidationSchema,
        onSubmit: async (values) => {
            setLoadingPost(true);
            setLoading(true);
            const dataToSend = { ...values };
            if (!dataToSend.offerTime) delete dataToSend.offerTime;
            if (!dataToSend.offerPercentage) delete dataToSend.offerPercentage;
            if (!dataToSend.stock) dataToSend.stock = 0;
            try {
                if (isProductTab) {
                    delete dataToSend.image;
                    if (dataToSend.offerPercentage) dataToSend.offerPercentage = Number(dataToSend.offerPercentage) / 100;
                    if (dataToSend.offerPercentage) dataToSend.offerTime = 42000;
                } else {
                    delete dataToSend.images
                    delete dataToSend.price
                    delete dataToSend.stock
                    delete dataToSend.description
                    delete dataToSend.salesQty
                    delete dataToSend.offerTime
                    delete dataToSend.offerPercentage;
                    delete dataToSend.mainImage;
                    delete dataToSend.hologramImage;
                    delete dataToSend.categoryId;
                }
                if (editItem) {
                    if (isProductTab) {
                        await serviceEditProductId(`${editItem.id}`, dataToSend);
                        toast({ description: "Funko edited successfully", variant: "default" });
                    } else {

                        await serviceEditCategoryId(`${editItem.id}`, dataToSend);
                        toast({ description: "Cateogry edited successfully", variant: "default" });
                    }
                } else {
                    if (isProductTab) {
                        await serviceCreateProduct(dataToSend as Product);
                        toast({ description: "Funko created successfully", variant: "default" });
                    } else {
                        await serviceCreateCategory(dataToSend as Category);
                        toast({ description: "Cateogry created successfully", variant: "default" });
                    }
                }
                const fetchedCategories = await serviceGetAllCategories()
                setCategories(fetchedCategories)
                const fetchedProducts = await serviceGetAllProducts();
                setProducts(fetchedProducts)
                setDialogOpen(false);
                setEditItem(null);
                formik.resetForm();
            } catch (error) {
                toast({ description: "Error saving item", variant: "destructive" });
            }
            finally {
                setLoadingPost(false);
                setLoading(false);
            }
        },
    });
    const handleDelete = (id: string) => {
        setItemToDeleteId(id);
        setConfirmationDialogOpen(true);
    };
    const confirmDelete = async () => {
        if (!itemToDeleteId) return;
        try {
            setLoadingPost(true);
            if (isProductTab) {
                await serviceDeleteProduct(itemToDeleteId);
                toast({ description: "Product deleted successfully", variant: "default" });
            } else {
                if (products.some((product) => product.categoryId === itemToDeleteId)) {
                    toast({ description: "Category is in use. Can't be eliminated", variant: "destructive" });
                    setLoadingPost(false);
                    setConfirmationDialogOpen(false);
                    setItemToDeleteId(null);
                    return;
                } else {
                    await serviceDeleteCategory(itemToDeleteId);
                    toast({ description: "Category deleted successfully", variant: "default" });
                }
            }
        } catch (error) {
            toast({ description: "Error deleting item", variant: "destructive" });
        }
        try {
            const fetchedCategories = await serviceGetAllCategories()
            setCategories(fetchedCategories)
            const fetchedProducts = await serviceGetAllProducts();
            setProducts(fetchedProducts)
        } catch (error) {
            toast({ description: "Error fetching data:", variant: "destructive" });
        }
        finally {
            setLoadingPost(false);
            setConfirmationDialogOpen(false);
            setItemToDeleteId(null);
        }
    };

    const handleAddNew = () => {
        setEditItem(null);
        formik.resetForm();
        setDialogOpen(true);
    };

    const handleEdit = (item: Category | Product) => {
        setEditItem(item);

        const values = isProductTab
            ? {
                name: (item as Product).name || "",
                description: (item as Product).description || "",
                mainImage: (item as Product).mainImage || "",
                hologramImage: (item as Product).hologramImage || "",
                images: (item as Product).images || [],
                price: (item as Product).price || 0,
                stock: (item as Product).stock || 0,
                salesQty: (item as Product).salesQty || 0,
                offerTime: (item as Product).offerTime || 0,
                offerPercentage: Number((item as Product)?.offerPercentage) * 100 || 0,
                categoryId: (item as Product).categoryId || "",
            }
            : {
                name: (item as Category).name || "",
                image: (item as Category).image || "",
            };
        formik.setValues(values as typeof formik.initialValues);
        setDialogOpen(true);
    };

    return (
        <div className="flex relative w-full pt-24 pb-8 flex-col items-center justify-center min-h-screen bg-white">
            <Tabs defaultValue="products" className="w-full px-6" onValueChange={() => setIsProductTab(!isProductTab)}>
                <div className="w-full flex justify-between items-center">
                    <TabsList className="grid grid-cols-2 w-1/2" >
                        <TabsTrigger value="products" >
                            Products
                        </TabsTrigger>
                        <TabsTrigger value="categories">
                            Categories
                        </TabsTrigger>
                    </TabsList>
                    {
                        isProductTab ?
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto hidden h-8 lg:flex"
                                onClick={handleAddNew}
                            >
                                <PlusCircle />
                                New Product
                            </Button>
                            :
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto hidden h-8 lg:flex"
                                onClick={handleAddNew}
                            >
                                <PlusCircle />
                                New Category
                            </Button>
                    }
                </div>
                <TabsContent value="products" >
                    <DataTable handleEdit={handleEdit} loading={loading} products={products} categories={categories} handleDelete={handleDelete} isProduct={isProductTab} />
                </TabsContent>
                <TabsContent value="categories">
                    <DataTable handleEdit={handleEdit} loading={loading} products={products} categories={categories} handleDelete={handleDelete} isProduct={isProductTab} />
                </TabsContent>
                <CreateOrEditDialog 
                    dialogOpen={dialogOpen}
                    setEditItem={setEditItem}
                    setDialogOpen={setDialogOpen}
                    editItem={editItem}
                    formik={formik}
                    isProductTab={isProductTab}
                    loadingPost={loadingPost}
                    categories={categories}
                />
                <DeleteConfirmationDialog confirmationDialogOpen={confirmationDialogOpen} setConfirmationDialogOpen={setConfirmationDialogOpen} loadingPost={loadingPost} confirmDelete={confirmDelete} />
            </Tabs>
        </div >
    )
}

export default ManagementPage