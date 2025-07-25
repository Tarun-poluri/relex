import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DailyPlayRecord } from "@/app/types/dailyPlayTypes";

interface DailyPlayState {
  dailyPlays: DailyPlayRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DailyPlayState = {
  dailyPlays: [],
  isLoading: false,
  error: null,
};

const dailyPlaySlice = createSlice({
  name: "dailyPlay",
  initialState,
  reducers: {
    setDailyPlays: (state, action: PayloadAction<DailyPlayRecord[]>) => {
      state.dailyPlays = action.payload;
    },
    setDailyPlayLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDailyPlayError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setDailyPlays, setDailyPlayLoading, setDailyPlayError } = dailyPlaySlice.actions;

export default dailyPlaySlice.reducer;
