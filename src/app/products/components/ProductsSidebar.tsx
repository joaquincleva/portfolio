import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from "@/components/ui/sidebar";
import { FiltersProps } from "./ProductsPage";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/interfaces/Category";

interface ProductsSidebarProps {
    filters: FiltersProps;
    setFilters: (filters: FiltersProps) => void;
    categories: Category[]
}

const ProductsSidebar = ({ filters, setFilters, categories }: ProductsSidebarProps) => {
    return (
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
                            className='z-50 w-auto mr-3 pl-8 text-right'
                            type="number"
                            step={1}
                            placeholder="Min. Discount"
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
    )
}
export default ProductsSidebar;