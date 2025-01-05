import { useCartContext } from "@/store/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { serviceUpdateProductStockAndSales } from "@/services/products";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const PaymentForm = () => {
    const { cartContext } = useCartContext();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const calculateTotal = () => cartContext.reduce((total, { product, quantity }) =>
        total + product.price * (1 - (product.offerPercentage || 0)) * quantity, 0).toFixed(2);

    const formik = useFormik({
        initialValues: { cardholderName: "", cardNumber: "", expiryDate: "", cvc: "" },
        validationSchema: Yup.object({
            cardholderName: Yup.string().required("Cardholder name is required"),
            cardNumber: Yup.string().matches(/^\d{16}$/, "Card number must be 16 digits").required("Card number is required"),
            expiryDate: Yup.string().matches(/^(0[1-9]|1[0-2])\/(\d{2})$/, "Expiry date must be MM/YY").required("Expiry date is required"),
            cvc: Yup.string().matches(/^\d{3}$/, "CVC must be 3 digits").required("CVC is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                localStorage.setItem("cartData", JSON.stringify(cartContext));
                await Promise.all(cartContext.map(({ product, quantity }) =>
                    serviceUpdateProductStockAndSales(product.id!, quantity)));
                router.push("/success");
            } catch (error) {
                toast({ description: "An error occurred while processing your payment.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        },
    });

    const renderInput = (label: string, field: keyof typeof formik.values, placeholder: string) => (
        <div>
            <label className="block text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-gray-700">{label}</label>
            <Input placeholder={placeholder} className="bg-white" {...formik.getFieldProps(field)} />
            {formik.touched[field] && formik.errors[field] && (
                <p className="text-red-500 text-sm mt-1">{formik.errors[field]}</p>
            )}
        </div>
    );

    return (
        <Card className="bg-gray-100 p-8 my-4 w-full xl:w-5/6">
            <Tabs defaultValue="credit-card" className="w-full">
                <TabsList className="w-full bg-gray-100">
                    <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                </TabsList>
                <TabsContent value="credit-card">
                    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                        {renderInput("Cardholder Name", "cardholderName", "Cardholder Name")}
                        {renderInput("Card Number", "cardNumber", "Card Number")}
                        <div className="flex gap-4">
                            {renderInput("Expiry Date", "expiryDate", "MM/YY")}
                            {renderInput("CVC", "cvc", "CVC")}
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 text-white">
                            {loading ? (
                                <div>
                                    <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="pl-2">Loading</span>
                                </div>
                            ) : (
                                <span>Pay ${calculateTotal()}</span>
                            )}
                        </Button>
                    </form>
                </TabsContent>
                <TabsContent value="paypal">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-center text-gray-600">You will be redirected to PayPal to complete your purchase.</p>
                        <Button className="w-full bg-yellow-500 text-white">Pay ${calculateTotal()} with PayPal</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    );
};

export default PaymentForm;