// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/reducers/authReducer'
import userReducer from '@/store/reducers/userReducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer, // Ensure you import userReducer from the correct path
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
