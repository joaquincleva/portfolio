"use client"
import { MoreHorizontal, PencilLine, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Row } from "@tanstack/react-table"
import { Category } from "@/interfaces/Category"
import { Product } from "@/interfaces/Product"

interface DataTableRowActionProp {
  row: Row<any>,
  handleEdit: (item: Product | Category) => void,
  handleDelete: (item: string) => void
}

export function DataTableRowActions({
  row,
  handleEdit,
  handleDelete
}: DataTableRowActionProp) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => { handleEdit(row.original) }} className="cursor-pointer">Edit
          <DropdownMenuShortcut><PencilLine className="w-4 h-4 text-blue-500" /></DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => { handleDelete(row.original.id) }}>
          Delete
          <DropdownMenuShortcut><Trash2Icon className="w-4 h-4 text-red-500" /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
