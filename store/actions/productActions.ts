import { AppDispatch } from "../store";
import { 
  getProductsApi, 
  createProductApi, 
  updateProductApi, 
  deleteProductApi 
} from "@/store/api/productsApi";
import { setProducts, addProduct, updateProduct, removeProduct, setLoading, setError } from "@/store/reducers/productReducer";
import { ProductInterface } from "@/app/types/productTypes";

export const fetchProducts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await getProductsApi();
    dispatch(setProducts(response.data));
  } catch (error) {
    dispatch(setError('Failed to fetch products'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createProduct = (product: Omit<ProductInterface, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => 
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const productWithStatus = {
        ...product,
        status: product.stockQuantity > 0 ? "Available" : "Out of Stock"
      };
      const response = await createProductApi(productWithStatus);
      dispatch(addProduct(response.data));
      return response.data;
    } catch (error) {
      dispatch(setError('Failed to create product'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateProductAction = (product: ProductInterface) => 
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const updatedProduct = {
        ...product,
        status: product.stockQuantity > 0 ? "Available" : "Out of Stock"
      };
      const response = await updateProductApi(updatedProduct);
      dispatch(updateProduct(response.data));
      return response.data;
    } catch (error) {
      dispatch(setError('Failed to update product'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteProduct = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await deleteProductApi(id);
    dispatch(removeProduct(id));
  } catch (error) {
    dispatch(setError('Failed to delete product'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};