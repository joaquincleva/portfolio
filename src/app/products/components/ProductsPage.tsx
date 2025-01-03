"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/interfaces/Category';
import { Product } from '@/interfaces/Product';
import { serviceGetAllCategories } from '@/services/categories';
import { serviceGetAllProducts } from '@/services/products';
import LoadingSpinner from '@/sharedComponents/LoadingSpinner';
import { useEffect, useState } from 'react';
import ProductsContainer from './ProductsContainer';
import ProductsSidebar from './ProductsSidebar';

export interface FiltersProps {
    maxPrice: number;
    minPrice: number;
    nameOrDescription: string;
    category: string;
    hasDeal: boolean;
    hasStock: boolean;
    minOffer: number;
}

const ProductsPage = () => {

    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [togleSidebar, setTogleSidebar] = useState<boolean>(true);
    const [filters, setFilters] = useState<FiltersProps>({
        maxPrice: 0,
        minPrice: 0,
        nameOrDescription: "",
        category: "",
        hasDeal: false,
        hasStock: true,
        minOffer: 0
    });

    useEffect(() => {
        const fetchData: any = async () => {
            setLoading(true);
            try {
                const responseProducts = await serviceGetAllProducts();
                setProducts(responseProducts);
            } catch (e) {
                toast({
                    description: "Couldn't get products", variant: "destructive"
                })
            }
            try {
                const responseCategories = await serviceGetAllCategories();
                setCategories(responseCategories);
            } catch (e) {
                toast({
                    description: "Couldn't get categories", variant: "destructive"
                })
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    return (
        <div className={`bg-white min-h-screen items-center justify-center gap-10 mt-20 w-full my-8 mx-auto h-auto z-50 ${loading && "flex"}`}>
            {loading ? (
                <div className="w-full h-full items-center flex-col flex justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <SidebarProvider className='mt-0' open={togleSidebar} onOpenChange={(open) => setTogleSidebar(open)}>
                    <ProductsSidebar categories={categories} filters={filters} setFilters={setFilters} />
                    <SidebarTrigger className='relative' />
                    <ProductsContainer products={products} categories={categories} filters={filters} />
                </SidebarProvider>
            )}
        </div>
    );
};

export default ProductsPage;