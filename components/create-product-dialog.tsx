"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, X } from "lucide-react"
import { ProductInterface } from "@/app/types/productTypes"
import { useForm, Controller } from "react-hook-form"
import { useAppDispatch } from "@/store/hooks"
import { createProduct, updateProductAction, fetchProducts } from "@/store/actions/productActions" // Import actions

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productToEdit?: ProductInterface | null
}

type ProductFormValues = {
  name: string
  deviceId: string
  description: string
  price: number
  stockQuantity: number
  category: "therapy" | "meditation" | "accessories" | "software"
  isActive: boolean
  image: string
}

export function CreateProductDialog({ open, onOpenChange, productToEdit }: CreateProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()

  const isEditing = !!productToEdit;

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      deviceId: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      category: "therapy",
      isActive: true,
      image: "/placeholder.svg"
    },
  });

  useEffect(() => {
    if (open && productToEdit) {
      form.reset({
        name: productToEdit.name,
        deviceId: productToEdit.deviceId,
        description: productToEdit.description,
        price: productToEdit.price,
        stockQuantity: productToEdit.stockQuantity,
        category: productToEdit.category,
        isActive: productToEdit.isActive,
        image: productToEdit.image || "/placeholder.svg"
      });
      setSelectedImage(productToEdit.image || "/placeholder.svg");
    } else if (open && !productToEdit) {
      form.reset({
        name: "",
        deviceId: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        category: "therapy",
        isActive: true,
        image: "/placeholder.svg"
      });
      setSelectedImage(null);
    }
  }, [productToEdit, open, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setSelectedImage(imageUrl)
        form.setValue("image", imageUrl, { shouldValidate: true })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    form.setValue("image", "/placeholder.svg", { shouldValidate: true }) // Default placeholder
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true)
    try {
      if (isEditing && productToEdit) {
        // Update existing product
        const updatedProduct: ProductInterface = {
          ...productToEdit,
          ...data,
          status: data.stockQuantity > 0 ? "Available" : "Out of Stock",
          updatedAt: new Date().toISOString(),
        };
        await dispatch(updateProductAction(updatedProduct));
      } else {
        // Create new product
        const newProduct: Omit<ProductInterface, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
          ...data,
        };
        await dispatch(createProduct(newProduct));
      }
      dispatch(fetchProducts());
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedImage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Create New Product"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update product information" : "Add a new product to the catalog"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <Controller
                name="name"
                control={form.control}
                rules={{ required: "Product name is required", minLength: { value: 2, message: "Min 2 characters" } }}
                render={({ field }) => (
                  <Input placeholder="Enter product name" {...field} />
                )}
              />
              {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Device ID</label>
              <Controller
                name="deviceId"
                control={form.control}
                rules={{
                  required: "Device ID is required",
                  minLength: { value: 3, message: "Min 3 characters" },
                  pattern: { value: /^[A-Za-z0-9-_]+$/, message: "Invalid format" }
                }}
                render={({ field }) => (
                  <Input placeholder="e.g., RFB-001, HH-PRO-2024" {...field} />
                )}
              />
              {form.formState.errors.deviceId && <p className="text-red-500 text-xs mt-1">{form.formState.errors.deviceId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Controller
                name="category"
                control={form.control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="therapy">Therapy</SelectItem>
                      <SelectItem value="meditation">Meditation</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.category && <p className="text-red-500 text-xs mt-1">{form.formState.errors.category.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <Controller
                  name="price"
                  control={form.control}
                  rules={{
                    required: "Price is required",
                    min: { value: 0.01, message: "Must be greater than 0" },
                    validate: value => !isNaN(value) || "Must be a number"
                  }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  )}
                />
                {form.formState.errors.price && <p className="text-red-500 text-xs mt-1">{form.formState.errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Controller
                  name="stockQuantity"
                  control={form.control}
                  rules={{
                    required: "Stock quantity is required",
                    min: { value: 0, message: "Cannot be negative" },
                    validate: value => !isNaN(value) || "Must be a number"
                  }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  )}
                />
                {form.formState.errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{form.formState.errors.stockQuantity.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Controller
              name="description"
              control={form.control}
              rules={{
                required: "Description is required",
                minLength: { value: 10, message: "Min 10 characters" },
                maxLength: { value: 500, message: "Max 500 characters" }
              }}
              render={({ field }) => (
                <Textarea placeholder="Enter product description" className="min-h-[100px]" {...field} />
              )}
            />
            {form.formState.errors.description && <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <div className="flex items-center gap-4">
              {selectedImage && selectedImage !== "/placeholder.svg" ? (
                <div className="relative">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
                    <img
                      src={selectedImage}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  {selectedImage && selectedImage !== "/placeholder.svg" ? "Change Image" : "Upload Image"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Recommended: 400x400px, max 2MB</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Active Product</label>
              <div className="text-sm text-muted-foreground">Make this product available for purchase</div>
            </div>
            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
