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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "./tasks/components/data-table";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";



const Page = () => {
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
                console.error("Ha ocurrido un error en la petición.");
                toast({ description: "No se han podido obtener productos" })
            }
            try {
                const fetchedCategories = await serviceGetAllCategories();
                setCategories(fetchedCategories)
            } catch (e) {
                console.error("Ha ocurrido un error en la petición.");
                toast({ description: "No se han podido obtener las categorías" })
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData: any = async () => {
            try {
                const fetchedCategories = await serviceGetAllCategories();
                setCategories(fetchedCategories)
            } catch (e) {
                console.error("Ha ocurrido un error en la petición.");
                toast({ description: "No se han podido obtener las categorías" })
            }
        };
        fetchData();
    }, [])

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

    const [uploadMode, setUploadMode] = useState({
        mainImage: "file",
        hologramImage: "file",
        images: "file",
        image: "file",
    });

    const handleMultipleFileUpload = async (files: FileList) => {
        const uploadedImages = await Promise.all(
            Array.from(files).map((file) => uploadToCloudinary(file))
        );
        formik.setFieldValue("images", uploadedImages);
    };

    const handleSwitchChange = (field: string, mode: "file" | "url") => {
        setUploadMode((prev) => ({ ...prev, [field]: mode }));
        formik.setFieldValue(field, mode === "url" ? "" : null);
    };

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
                console.error("Error saving item:", error);
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

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

        const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER_NAME as string, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }

        const data = await response.json();
        return data.secure_url;
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

    const handleFileUpload = async (file: File, field: string) => {
        const url = await uploadToCloudinary(file);
        formik.setFieldValue(field, url);
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
                <Dialog open={dialogOpen} onOpenChange={() => { setEditItem(null); setDialogOpen(false) }}>
                    <DialogContent className="z-[65] mt-6 mb-20 max-h-[90vh] overflow-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editItem ? "Edit Item" : "Add New Item"}
                            </DialogTitle>
                            <DialogDescription>
                                Fill the form below to save the item.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={formik.handleSubmit} className="space-y-4 px-2 pt-2 overflow-x-auto">
                            <div className="flex space-y-1 flex-col">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder={isProductTab ? "Pikachu" : "Marvel"}
                                    onBlur={() => formik.setFieldTouched("name", true)}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    className="input"
                                />
                                {formik.errors.name && formik.touched.name && (<span className="text-red-500 text-xs">{formik.errors.name}</span>)}
                            </div>
                            {isProductTab && (
                                <>
                                    <div className="flex space-y-1 flex-col">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Description"
                                            onBlur={() => formik.setFieldTouched("description", true)}
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            className="textarea"
                                        />
                                        {formik.errors.description && formik.touched.description && (<span className="text-red-500 text-xs">{formik.errors.description}</span>)}
                                    </div>
                                    <div className="flex space-y-2 flex-col">
                                        <Label htmlFor="mainImage">Main Image</Label>
                                        <div className="flex gap-2">
                                            <Switch
                                                checked={uploadMode.mainImage === "url"}
                                                onCheckedChange={() =>
                                                    handleSwitchChange("mainImage", uploadMode.mainImage === "file" ? "url" : "file")
                                                }
                                            />
                                            <span className="text-sm text-light">{uploadMode.mainImage === "file" ? "File" : "Url"}</span>
                                        </div>
                                        {uploadMode.mainImage === "file" ? (
                                            <Input
                                                id="mainImage"
                                                name="mainImage"
                                                type="file"
                                                onBlur={() => formik.setFieldTouched("mainImage", true)}
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        handleFileUpload(e.target.files[0], "mainImage");
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <Input
                                                id="mainImageUrl"
                                                name="mainImage"
                                                placeholder="Enter a valid image URL"
                                                onBlur={() => formik.setFieldTouched("mainImage", true)}
                                                onChange={(e) => formik.setFieldValue("mainImage", e.target.value)}
                                            />
                                        )}
                                        {formik.errors.mainImage && formik.touched.mainImage && (<span className="text-red-500 text-xs">{formik.errors.mainImage}</span>)}
                                        {formik.values.mainImage && (<img src={formik.values.mainImage} alt="Main Image" className="self-center w-1/2" />)}
                                    </div>
                                    <div className="flex space-y-2 flex-col">
                                        <Label htmlFor="hologramImage">Hologram Image</Label>
                                        <div className="flex gap-2">
                                            <Switch
                                                checked={uploadMode.hologramImage === "url"}
                                                onCheckedChange={() =>
                                                    handleSwitchChange("hologramImage", uploadMode.hologramImage === "file" ? "url" : "file")
                                                }
                                            />
                                            <span className="text-sm text-light">{uploadMode.hologramImage === "file" ? "File" : "Url"}</span>
                                        </div>
                                        {uploadMode.hologramImage === "file" ? (
                                            <Input
                                                id="hologramImage"
                                                name="hologramImage"
                                                type="file"
                                                onBlur={() => formik.setFieldTouched("hologramImage", true)}
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        handleFileUpload(e.target.files[0], "hologramImage");
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <Input
                                                id="hologramImage"
                                                name="hologramImage"
                                                placeholder="Enter a valid image URL"
                                                onBlur={() => formik.setFieldTouched("hologramImage", true)}
                                                onChange={(e) => formik.setFieldValue("hologramImage", e.target.value)}
                                            />
                                        )}
                                        {formik.errors.hologramImage && formik.touched.hologramImage && (<span className="text-red-500 text-xs">{formik.errors.hologramImage}</span>)}
                                        {formik.values.hologramImage && (<img src={formik.values.hologramImage} alt="Hologram" className="self-center w-1/2" />)}
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex w-1/2 space-y-2 flex-col pr-1">
                                            <Label htmlFor="price">Price</Label>
                                            <div className="relative">
                                                <Input
                                                    name="price"
                                                    type="number"
                                                    placeholder="0"
                                                    onBlur={() => formik.setFieldTouched("price", true)}
                                                    value={formik.values.price}
                                                    onChange={formik.handleChange}
                                                    className="input text-right"
                                                />
                                                <span className="absolute left-4 top-[20%]">$</span>
                                            </div>
                                            {formik.errors.price && formik.touched.price && (<span className="text-red-500 text-xs">{formik.errors.price}</span>)}
                                        </div>
                                        <div className="flex w-1/2 space-y-2 flex-col pl-1">
                                            <Label htmlFor="price">Stock</Label>
                                            <Input
                                                id="price"
                                                name="stock"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                value={formik.values.stock}
                                                onBlur={() => formik.setFieldTouched("stock", true)}
                                                onChange={formik.handleChange}
                                                className="input text-right"
                                            />
                                            {formik.errors.stock && formik.touched.stock && (<span className="text-red-500 text-xs">{formik.errors.stock}</span>)}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex w-1/2 space-y-2 flex-col pr-1">
                                            <Label htmlFor="salesQty">Sales Quantity</Label>
                                            <Input
                                                id="salesQty"
                                                name="salesQty"
                                                type="number"
                                                placeholder="Sales Quantity"
                                                value={formik.values.salesQty}
                                                onBlur={() => formik.setFieldTouched("salesQty", true)}
                                                onChange={formik.handleChange}
                                                className="input"
                                            />
                                            {formik.errors.salesQty && formik.touched.salesQty && (<span className="text-red-500 text-xs">{formik.errors.salesQty}</span>)}
                                        </div>
                                        <div className="flex w-1/2 space-y-2 flex-col pr-1">
                                            <Label htmlFor="offerPercentage">Deal Percentage</Label>
                                            <Input
                                                id="offerPercentage"
                                                name="offerPercentage"
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                value={formik.values.offerPercentage}
                                                onBlur={() => formik.setFieldTouched("offerPercentage", true)}
                                                onChange={formik.handleChange}
                                                className="input"
                                            />
                                            {formik.errors.offerPercentage && formik.touched.offerPercentage && (<span className="text-red-500 text-xs">{formik.errors.offerPercentage}</span>)}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="images">Images</Label>
                                        <div className="flex gap-2">
                                            <Switch
                                                checked={uploadMode.images === "url"}
                                                onCheckedChange={() =>
                                                    handleSwitchChange("images", uploadMode.images === "file" ? "url" : "file")
                                                }
                                            />
                                            <span className="text-sm text-light">{uploadMode.images === "file" ? "File" : "Url"}</span>
                                        </div>
                                        {uploadMode.images === "file" ? (
                                            <Input
                                                id="images"
                                                name="images"
                                                type="file"
                                                multiple
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        handleMultipleFileUpload(e.target.files);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="space-y-2">
                                                {formik.values.images && formik.values.images?.map((image, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <Input
                                                            type="text"
                                                            value={image}
                                                            onChange={(e) => {
                                                                const updatedImages = formik.values.images ? [...formik.values.images] : [];
                                                                updatedImages[index] = e.target.value;
                                                                formik.setFieldValue("images", updatedImages);

                                                                // Añadir un nuevo input si es el último y no está vacío
                                                                if (e.target.value && index === updatedImages.length - 1) {
                                                                    formik.setFieldValue("images", [...updatedImages, ""]);
                                                                }
                                                            }}
                                                            placeholder={`Image URL ${index + 1}`}
                                                            className="flex-1"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                const updatedImages = formik.values.images ? [...formik.values.images] : [];
                                                                updatedImages.splice(index, 1);
                                                                formik.setFieldValue("images", updatedImages);
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                                {/* Input inicial si el arreglo está vacío */}
                                                {(!formik.values.images || formik.values.images.length === 0) && (
                                                    <Input
                                                        type="text"
                                                        onChange={(e) => {
                                                            formik.setFieldValue("images", [e.target.value, ""]);
                                                        }}
                                                        placeholder="Enter image URL"
                                                        className="flex-1"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {formik.errors.images && formik.touched.images && (<span className="text-red-500 text-xs">{formik.errors.images}</span>)}
                                        {formik.values?.images && formik.values?.images?.length > 0 && (
                                            <Carousel className="w-full">
                                                <CarouselContent>
                                                    {formik.values.images.filter((item) => item.length > 0).map((image, index) => (
                                                        <CarouselItem key={index}>
                                                            <div className="p-1">
                                                                <Card>
                                                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                                                        {image.length > 0 && <img src={image} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />}
                                                                    </CardContent>
                                                                </Card>
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious className="border-0 -left-1" />
                                                <CarouselNext className="border-0 -right-1" />
                                            </Carousel>
                                        )}
                                    </div>
                                    <Select name="categoryId" defaultValue={formik.values.categoryId}
                                        onValueChange={(value) => formik.setFieldValue("categoryId", value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[70]"
                                            defaultValue={formik.values.categoryId}>
                                            <SelectGroup defaultValue={formik.values.categoryId}>
                                                <SelectLabel>Category</SelectLabel>
                                                {categories.map((category: Category) => (
                                                    <SelectItem key={category.id} value={`${category.id}`}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {formik.errors.categoryId && formik.touched.categoryId && (<span className="text-red-500 text-xs">{formik.errors.categoryId}</span>)}
                                </>
                            )}
                            {!isProductTab && (
                                <div className="flex space-y-2 flex-col">
                                    <Label htmlFor="image">Image</Label>
                                    <div className="flex gap-2">
                                        <Switch
                                            checked={uploadMode.image === "url"}
                                            onCheckedChange={() =>
                                                handleSwitchChange("image", uploadMode.image === "file" ? "url" : "file")
                                            }
                                        />
                                        <span className="text-sm text-light">{uploadMode.image === "file" ? "File" : "Url"}</span>
                                    </div>
                                    {uploadMode.image === "file" ? (
                                        <Input
                                            id="image"
                                            name="image"
                                            type="file"
                                            onBlur={() => formik.setFieldTouched("image", true)}
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    handleFileUpload(e.target.files[0], "image");
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Input
                                            id="image"
                                            name="image"
                                            placeholder="Enter a valid image URL"
                                            onBlur={() => formik.setFieldTouched("image", true)}
                                            onChange={(e) => formik.setFieldValue("image", e.target.value)}
                                        />
                                    )}
                                    {formik.errors.image && formik.touched.image && (<span className="text-red-500 text-xs">{formik.errors.image}</span>)}
                                    {formik.values.image && (<img src={formik.values.image} alt="Hologram" className="self-center w-1/2" />)}
                                </div>
                            )}
                            <div className="flex w-full justify-end">
                                <Button type="submit" disabled={loadingPost} onClick={() => { formik.setTouched({}) }} className="btn bg-blue-600 text-white self-end justify-self-end">
                                    {loadingPost ? <div>
                                        <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="pl-2">Loading</span>
                                    </div> :
                                        <span>{editItem ? "Save Changes" : isProductTab ? "Add Product" : "Add Category"}</span>}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
                    <DialogContent className="z-[65] mt-6 mb-20 max-h-[90vh] overflow-auto">
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setConfirmationDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" disabled={loadingPost} onClick={confirmDelete}>
                                {loadingPost ? <div>
                                    <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="pl-2">Loading</span>
                                </div> :
                                    <span>Delete</span>}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Tabs>
        </div >
    );
}

export default Page;