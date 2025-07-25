"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { type ProductInterface } from "@/app/types/productTypes" // Use ProductInterface
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchProducts, deleteProduct } from "@/store/actions/productActions" // Import actions
import { CreateProductDialog } from "@/components/create-product-dialog" // Import the dialog

interface ProductsTableProps {
  searchQuery: string
  categoryFilter: string
}

export function ProductsTable({ searchQuery, categoryFilter }: ProductsTableProps) {
  const dispatch = useAppDispatch()
  const { products, isLoading, error } = useAppSelector((state) => state.products)

  const [currentPage, setCurrentPage] = useState(1)
  const [productToDelete, setProductToDelete] = useState<ProductInterface | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductInterface | null>(null);

  const productsPerPage = 10

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const filteredProducts = useMemo(() => {
    return products.filter((product: ProductInterface) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, categoryFilter, products])

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handleDeleteProduct = (product: ProductInterface) => {
    setProductToDelete(product)
  }

  const handleEditProduct = (product: ProductInterface) => {
    setProductToEdit(product);
    setIsFormDialogOpen(true);
  };

  const confirmDeletion = async () => {
    if (productToDelete) {
      try {
        await dispatch(deleteProduct(productToDelete.id));
        setProductToDelete(null);
        dispatch(fetchProducts());
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  }

  const getStatusBadge = (status: string, stockQuantity: number) => {
    if (stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    return <Badge variant={status === "Available" ? "default" : "secondary"}>{status}</Badge>
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      therapy: "default",
      meditation: "secondary",
      accessories: "outline",
      software: "destructive",
    } as const

    return (
      <Badge variant={variants[category as keyof typeof variants] || "secondary"}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No products found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                currentProducts.map((product: ProductInterface) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=60&width=60";
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {!product.isActive && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-muted-foreground">{product.description}</div>
                    </TableCell>
                    <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={product.stockQuantity <= 5 ? "text-red-600 font-medium" : ""}>
                        {product.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status, product.stockQuantity)}</TableCell>
                    <TableCell>{getCategoryBadge(product.category)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProduct(product)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}{" "}
          products
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => { // Changed to totalPages to show all page numbers
              const pageNumber = i + 1
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className="w-8"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{productToDelete?.name}"? This action cannot be undone and
              will remove the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletion} className="bg-red-600 hover:bg-red-700">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product Form Dialog (for Create/Edit) */}
      <CreateProductDialog
        open={isFormDialogOpen}
        onOpenChange={(open) => {
          setIsFormDialogOpen(open);
          if (!open) {
            setProductToEdit(null);
          }
        }}
        productToEdit={productToEdit}
      />
    </>
  )
}
