"use client"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableCategories } from "./data-table-toolbar"
import { Category } from "@/interfaces/Category"
import { serviceGetAllCategories } from "@/services/categories"
import { toast } from "@/hooks/use-toast"
import { Product } from "@/interfaces/Product"

let categories: DataTableCategories[] = []

interface DataColumn {
  handleEdit: (item: Product | Category) => void
  handleDelete: (item: string) => void
}

const fetchData: any = async () => {
  try {
    const fetchedCategories = await serviceGetAllCategories();
    categories = fetchedCategories.map((category: Category) => {
      return { label: `${category.name}`, value: `${category.id}` }
    })
  } catch (e) {
    toast({ description: "Couldn't get categories", variant: "destructive" })
  }
};
fetchData();

export const productColumns: any = ({ handleEdit, handleDelete }: DataColumn) =>  [
  {
    accessorKey: "mainImage",
    header: ({ column }:any) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }:any) => {
      return (
        <div className="flex w-[100px] items-center">
          <img className="h-14 rounded-lg" src={row.getValue("mainImage")}>
          </img>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }:any) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }:any) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "offerPercentage",
    header: ({ column }:any) => (
      <DataTableColumnHeader column={column} title="Deal" />
    ),
    cell: ({ row }:any) => {
      return (
        <div className="flex items-center">
          {row.getValue("offerPercentage") ? <span>{Number(row.getValue("offerPercentage")) * 100}%</span> : null}
        </div>
      )
    },
    filterFn: (row:any, id:any, value:any) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }:any) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }:any) => {

      return (
        <div className="flex items-center">
          <span>{row.getValue("stock")}</span>
        </div>
      )
    },
    filterFn: (row:any, id:any, value:any) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "salesQty",
    header: ({ column }:any) => (
      <DataTableColumnHeader column={column} title="Sales Quantity" />
    ),
    cell: ({ row }:any) => {

      return (
        <div className="flex items-center">
          <span>{row.getValue("salesQty")}</span>
        </div>
      )
    },
    filterFn: (row:any, id:any, value:any) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "categoryId",
    header: ({ column }:any) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }:any) => {
      const category = categories.find((category) => category.value === row.getValue("categoryId"))
      if (!category) {
        return null
      }
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {category.label}
          </span>
        </div>
      )
    },
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }:any) => <DataTableRowActions handleDelete={handleDelete} handleEdit={handleEdit} row={row} />,
  },
]

export const categoriesColumns: any = ({ handleEdit, handleDelete }: DataColumn) =>  [
  {
    accessorKey: "image",
    header: ({ column }:any) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }:any) => {
      return (
        <div className="flex w-[100px] items-center">
          <img className="rounded-lg h-14" src={row.getValue("image")}>
          </img>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }:any) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }:any) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }:any) => <DataTableRowActions handleDelete={handleDelete} handleEdit={handleEdit} row={row} />,
  },
]
