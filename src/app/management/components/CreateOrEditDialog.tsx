import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/interfaces/Product";
import { Category } from "@/interfaces/Category";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";


interface CreateOrEditDialogProps {
    dialogOpen: boolean;
    setEditItem: (item: Product | Category | null) => void;
    setDialogOpen: (open: boolean) => void;
    editItem: Product | Category | null;
    formik: any;
    isProductTab: boolean;
    loadingPost: boolean;
    categories: Category[];
}

const CreateOrEditDialog = ({ categories, dialogOpen, editItem, setEditItem, setDialogOpen, formik, isProductTab, loadingPost }: CreateOrEditDialogProps) => {


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


    const [uploadMode, setUploadMode] = useState({
        mainImage: "file",
        hologramImage: "file",
        images: "file",
        image: "file",
    });


    const handleFileUpload = async (file: File, field: string) => {
        const url = await uploadToCloudinary(file);
        formik.setFieldValue(field, url);
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

    return (
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
                                        {formik.values.images && formik.values.images?.map((image: string, index: number) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Input
                                                    type="text"
                                                    value={image}
                                                    onChange={(e) => {
                                                        const updatedImages = formik.values.images ? [...formik.values.images] : [];
                                                        updatedImages[index] = e.target.value;
                                                        formik.setFieldValue("images", updatedImages);
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
                                            {formik.values.images.filter((item:string) => item.length > 0).map((image:string, index:number) => (
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
    )
}

export default CreateOrEditDialog;