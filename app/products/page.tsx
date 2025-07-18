"use client"

import { useState } from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { DashboardHeader } from "../../components/dashboard-header"
import { ProductsTable } from "../../components/products-table"
import { CreateProductDialog } from "../../components/create-product-dialog"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Package } from "lucide-react"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          {/* Page Header */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            </div>
            <p className="text-muted-foreground">Manage RelaxFlow's sound therapy devices and services.</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="therapy">Therapy</SelectItem>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Product
            </Button>
          </div>

          {/* Products Table */}
          <ProductsTable searchQuery={searchQuery} categoryFilter={categoryFilter} />

          {/* Create Product Dialog */}
          <CreateProductDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
