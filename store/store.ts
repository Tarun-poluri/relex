// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/reducers/authReducer'
import userReducer from '@/store/reducers/userReducer'
import ownerReducer from '@/store/reducers/ownerReducer'
import productReducer from '@/store/reducers/productReducer'
import meditationReducer from '@/store/reducers/meditationReducer'
import dailyPlayReducer from '@/store/reducers/dailyPlayReducer'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer, 
    owners: ownerReducer,
    products: productReducer,
    meditations: meditationReducer,
    dailyPlay: dailyPlayReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
