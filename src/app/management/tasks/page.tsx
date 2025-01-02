"use client"
import { Metadata } from "next"


import { DataTable } from "./components/data-table"

const Page = () => {
  
  return (
    <div className="z-50 bg-white w-full pt-20">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <DataTable isProduct={true}/>
      </div>
    </div>
  )
}

export default Page;