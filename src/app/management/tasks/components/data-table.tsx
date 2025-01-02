"use client"

import { useEffect, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import LoadingSpinner from "@/sharedComponents/LoadingSpinner"
import { categoriesColumns, productColumns } from "./columns"
import { Product } from "@/interfaces/Product"
import { serviceGetAllProducts } from "@/services/products"
import { toast } from "@/hooks/use-toast"
import { serviceGetAllCategories } from "@/services/categories"
import { Category } from "@/interfaces/Category"

interface DataTableProps {
  isProduct: boolean
  handleEdit: (item: Category | Product) => void
  handleDelete: (item: string) => void
  products: Product[]
  loading: boolean
  categories: Category[]
}
type DataItem = Product | Category;

export function DataTable({ isProduct, handleEdit, handleDelete, products, categories, loading
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable<DataItem>({
    data: isProduct ? products : categories,
    columns: isProduct ? productColumns({ handleEdit, handleDelete }) : categoriesColumns({ handleEdit, handleDelete }),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar isProduct={isProduct} table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) :
              <TableRow className="w-full">

                <TableCell
                  colSpan={products.length}
                  className="h-48 text-center relative w-full"
                >
                  {loading ?
                    <div className="flex w-[94vw] absolute left-2/5 h-auto top-12 justify-center items-center">
                      <LoadingSpinner width={150} height={150} />
                    </div> :
                    <span>No results.</span>

                  }
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
