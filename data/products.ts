export interface Product {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  status: "Available" | "Out of Stock"
  category: "therapy" | "meditation" | "accessories" | "software"
  image: string
  isActive: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "RelaxFlow Sound Bowl Pro",
    description: "Premium sound therapy bowl with advanced vibration technology",
    price: 299.99,
    stockQuantity: 25,
    status: "Available",
    category: "therapy",
    image: "/placeholder.svg?height=60&width=60",
    isActive: true,
  },
  {
    id: "2",
    name: "Meditation Cushion Set",
    description: "Ergonomic meditation cushions for enhanced comfort",
    price: 89.99,
    stockQuantity: 0,
    status: "Out of Stock",
    category: "meditation",
    image: "/placeholder.svg?height=60&width=60",
    isActive: true,
  },
  {
    id: "3",
    name: "Harmony Headphones",
    description: "Wireless headphones optimized for sound therapy sessions",
    price: 199.99,
    stockQuantity: 15,
    status: "Available",
    category: "accessories",
    image: "/placeholder.svg?height=60&width=60",
    isActive: true,
  },
  {
    id: "4",
    name: "RelaxFlow Mobile App Premium",
    description: "Premium subscription with exclusive content and features",
    price: 9.99,
    stockQuantity: 999,
    status: "Available",
    category: "software",
    image: "/placeholder.svg?height=60&width=60",
    isActive: true,
  },
  {
    id: "5",
    name: "Vibration Therapy Mat",
    description: "Full-body vibration mat for deep relaxation therapy",
    price: 449.99,
    stockQuantity: 8,
    status: "Available",
    category: "therapy",
    image: "/placeholder.svg?height=60&width=60",
    isActive: false,
  },
]
