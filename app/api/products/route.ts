import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { ProductInterface } from '@/app/types/productTypes';

const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

// Helper function to read products
async function readProducts(): Promise<ProductInterface[]> {
  try {
    const fileContents = await fs.readFile(productsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

// Helper function to save products
async function saveProducts(products: ProductInterface[]): Promise<void> {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    const products = await readProducts();
    
    // Generate new ID
    const maxId = Math.max(0, ...products.map(p => parseInt(p.id)));
    const productWithId = {
      ...newProduct,
      id: String(maxId + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: newProduct.stockQuantity > 0 ? "Available" : "Out of Stock"
    };

    // Add new product to beginning of array
    const updatedProducts = [productWithId, ...products];
    await saveProducts(updatedProducts);
    
    return NextResponse.json(productWithId);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    const products = await readProducts();
    
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    products[index] = {
      ...updatedProduct,
      updatedAt: new Date().toISOString(),
      status: updatedProduct.stockQuantity > 0 ? "Available" : "Out of Stock"
    };

    await saveProducts(products);
    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const products = await readProducts();
    
    const updatedProducts = products.filter(product => product.id !== id);
    await saveProducts(updatedProducts);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}