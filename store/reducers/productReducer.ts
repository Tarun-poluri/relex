import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductInterface } from "@/app/types/productTypes";

interface ProductState {
  products: ProductInterface[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductInterface[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<ProductInterface>) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<ProductInterface>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setProducts, 
  addProduct, 
  updateProduct, 
  removeProduct, 
  setLoading, 
  setError,
  clearError
} = productSlice.actions;

export default productSlice.reducer;