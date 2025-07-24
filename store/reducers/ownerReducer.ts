import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Owner } from "@/app/types/ownerTypes";

interface OwnerState {
  owners: Owner[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OwnerState = {
  owners: [],
  isLoading: false,
  error: null,
};

const ownerSlice = createSlice({
  name: "owners",
  initialState,
  reducers: {
    setOwners: (state, action: PayloadAction<Owner[]>) => {
      state.owners = action.payload;
    },
    addOwner: (state, action: PayloadAction<Owner>) => {
      state.owners.unshift(action.payload);
    },
    updateOwnerInState: (state, action: PayloadAction<Owner>) => {
      const updatedOwner = action.payload;
      const index = state.owners.findIndex(owner => owner.id === updatedOwner.id);
      if (index !== -1) {
        state.owners[index] = updatedOwner;
      }
    },
    removeOwner: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      state.owners = state.owners.filter(owner => owner.id !== idToRemove);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setOwners, addOwner, updateOwnerInState, removeOwner, setLoading, setError } = ownerSlice.actions;

export default ownerSlice.reducer;
