import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  lastLogin: string;
  avatar?: string;
}

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setUsers, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;