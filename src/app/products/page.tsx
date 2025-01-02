"use client"
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/interfaces/Category';
import { Product } from '@/interfaces/Product';
import { serviceGetAllCategories } from '@/services/categories';
import { serviceGetAllProducts } from '@/services/products';
import LoadingSpinner from '@/sharedComponents/LoadingSpinner';
import { PercentCircleIcon, PercentDiamondIcon, PercentIcon, PercentSquare, PercentSquareIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface FiltersProps {
    maxPrice: number;
    minPrice: number;
    nameOrDescription: string;
    category: string;
    hasDeal: boolean;
    hasStock: boolean;
    minOffer: number;
}

const ProductsPage: React.FC = () => {

    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();
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
                console.error("Ha ocurrido un error en la petición.");
                toast({
                    description: "No se han podido obtener los usuarios."
                })
            }
            try {
                const responseCategories = await serviceGetAllCategories();
                setCategories(responseCategories);
            } catch (e) {
                console.error("Ha ocurrido un error en la petición.");
                toast({
                    description: "No se han podido obtener las categorías de servivios."
                })
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filterProducts = (filters: FiltersProps) => {
        return products.filter((product) => {
            const matchPrice =
                (!filters.maxPrice || product?.price * (1 - (product?.offerPercentage || 0)) <= filters.maxPrice) &&
                (!filters.minPrice || product?.price * (1 - (product?.offerPercentage || 0)) >= filters.minPrice);

            const matchNameOrDescription =
                !filters.nameOrDescription ||
                product.name.toLowerCase().includes(filters.nameOrDescription.toLowerCase()) ||
                product.description.toLowerCase().includes(filters.nameOrDescription.toLowerCase());

            const matchCategory = !filters.category || product.categoryId === filters.category;

            const matchHasDeal = !filters.hasDeal || (product.offerTime && product.offerTime > 0);

            const matchHasStock = !filters.hasStock || product.stock > 0;

            const matchMinOffer = !filters.minOffer || (product.offerPercentage ?? 0) >= filters.minOffer / 100;

            return (
                matchPrice &&
                matchNameOrDescription &&
                matchCategory &&
                matchHasDeal &&
                matchHasStock &&
                matchMinOffer
            );
        });
    };

    return (
        <div className="bg-white min-h-screen items-center justify-center gap-10 mt-20 w-full my-8 mx-auto h-auto z-50">
            {loading ? (
                <div className="w-full items-center flex-col bg-white flex">
                    <LoadingSpinner />
                </div>
            ) : (
                <SidebarProvider className='mt-0' open={togleSidebar} onOpenChange={(open) => setTogleSidebar(open)}>
                    <Sidebar className='h-full'>
                        <SidebarGroup>
                            <SidebarContent className='h-full w-1/6 fixed flex flex-col gap-y-4 py-4 pl-1'>
                                <Input
                                    className='z-50 w-auto mr-4'
                                    type="text"
                                    placeholder="Name or Description"
                                    value={filters.nameOrDescription}
                                    onChange={(e) =>
                                        setFilters({ ...filters, nameOrDescription: e.target.value })
                                    }
                                />
                                <Input
                                    className='z-50 w-auto mr-4'
                                    type="number"
                                    placeholder="Max Price"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) =>
                                        setFilters({ ...filters, maxPrice: Number(e.target.value) })
                                    }
                                />
                                <Input
                                    className='z-50 w-auto mr-4'
                                    type="number"
                                    placeholder="Min Price"
                                    value={filters.minPrice || ''}
                                    onChange={(e) =>
                                        setFilters({ ...filters, minPrice: Number(e.target.value) })
                                    }
                                />
                                <Select>
                                    <SelectTrigger className='z-50 w-auto mr-4'>
                                        <SelectValue placeholder="Category"></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Category</SelectLabel>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={`${category.id}`}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="relative flex items-center">
                                    <p className="absolute left-4 top-1/2 transform -translate-y-1/2">%</p>
                                    <Input
                                        className='z-50 w-auto mr-4 pl-8 text-right'
                                        type="number"
                                        step={1}
                                        placeholder="Mini Discount"
                                        value={filters.minOffer || ''}
                                        onChange={(e) =>
                                            setFilters({ ...filters, minOffer: Number(e.target.value) })
                                        }

                                    />
                                </div>

                                <div>
                                    <input
                                        className='rounded-full'
                                        type="checkbox"
                                        checked={filters.hasDeal}
                                        onChange={(e) =>
                                            setFilters({ ...filters, hasDeal: e.target.checked })
                                        }
                                    />
                                    <label className='pl-2'>Has deal</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={filters.hasStock}
                                        onChange={(e) =>
                                            setFilters({ ...filters, hasStock: e.target.checked })
                                        }
                                    />
                                    <label className='pl-2'>Has stock</label>
                                </div>
                            </SidebarContent>
                        </SidebarGroup>
                        <SidebarFooter />
                    </Sidebar>
                    <SidebarTrigger className='relative'></SidebarTrigger>
                    <div className='w-full h-full pt-4'>
                        <p className='w-full text-5xl text-center font-extrabold'>Select a Funko</p>
                        <div className="w-full flex-wrap gap-y-10 flex justify-center bg-white pb-16 pt-10">
                            {filterProducts(filters).map((item, index) => (
                                <div
                                    key={index}
                                    rel="noopener noreferrer"
                                    className="group w-[200px] cursor-pointer h-[300px] rounded-xl flex-col relative flex justify-center items-end mx-6 perspective"
                                    onClick={() => router.push(`/product/${item.id}`)}
                                >
                                    <div className="absolute inset-0 rounded-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-y-25deg group-hover:shadow-lg">
                                        <img
                                            src={item.mainImage}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                        />
                                        <div className="absolute rounded-xl inset-0 bg-gradient-to-t from-transparent via-black/50 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute rounded-xl inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-black/50 to-black/80 opacity-100 group-hover:h-36 transition-all duration-500"></div>
                                    </div>
                                    <p className="absolute top-56 inset-0 w-full text-center text-xl text-white font-extrabold transition-all duration-500 group-hover:translate-y-[-25px] group-hover:translate-z-20 z-50">
                                        {item.name}
                                    </p>
                                    <p className="absolute top-64 inset-0 w-full text-center text-[#de942c] text-xl font-extrabold transition-all duration-500 group-hover:translate-y-[-25px] group-hover:translate-z-20 z-50">
                                        {categories.find((categoryItem) => categoryItem.id === item.categoryId)?.name}
                                    </p>
                                    <div className="absolute top-12 pr-1.5 inset-0 w-full text-right text-[#de942c] text-xl font-extrabold transition-all duration-500 group-hover:translate-y-[-0px] group-hover:translate-z-20 z-50">
                                        <p className="text-[1rem] font-bold">
                                            ${(item?.price * (1 - (item?.offerPercentage || 0))).toFixed(2)}
                                        </p>
                                    </div>
                                    <img
                                        src={item.hologramImage}
                                        alt=""
                                        className="absolute perspectiveHologram self-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-[-20%]"
                                    />
                                </div>
                            ))}
                        </div></div>
                </SidebarProvider>

            )}
        </div>
    );
};

export default ProductsPage;