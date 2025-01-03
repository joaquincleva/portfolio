"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { serviceGetAllCategories } from "@/services/categories"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  isProduct: boolean
}

export interface DataTableCategories {
  label: string,
  value: string
}

export function DataTableToolbar<TData>({
  table,
  isProduct
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [categories, setCategories] = useState<DataTableCategories[]>([])

  useEffect(() => {
    const fetchData: any = async () => {
      try {
        const fetchedCategories = await serviceGetAllCategories();
        setCategories(fetchedCategories.map((category) => {
          return { label: `${category.name}`, value: `${category.id}` }
        }))
      } catch (e) {
        toast({ description: "Couldn't get categories", variant: "destructive" })
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={isProduct ? "Filter Funkos...": "Filter categories..."}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isProduct && table.getColumn("categoryId") && (
          <DataTableFacetedFilter
            column={table.getColumn("categoryId")}
            title="Category"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
