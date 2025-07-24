export interface ProductInterface {
  id: string;
  name: string;
  deviceId: string;
  description: string;
  price: number;
  stockQuantity: number;
  status: "Available" | "Out of Stock";
  category: "therapy" | "meditation" | "accessories" | "software";
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}