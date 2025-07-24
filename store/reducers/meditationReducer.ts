import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MusicMeditation } from "@/app/types/meditationTypes";

interface MeditationState {
  meditations: MusicMeditation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MeditationState = {
  meditations: [],
  isLoading: false,
  error: null,
};

const meditationSlice = createSlice({
  name: "meditations",
  initialState,
  reducers: {
    setMeditations: (state, action: PayloadAction<MusicMeditation[]>) => {
      state.meditations = action.payload;
    },
    addMeditation: (state, action: PayloadAction<MusicMeditation>) => {
      state.meditations.unshift(action.payload);
    },
    updateMeditationInState: (state, action: PayloadAction<MusicMeditation>) => {
      const updatedMeditation = action.payload;
      const index = state.meditations.findIndex(m => m.id === updatedMeditation.id);
      if (index !== -1) {
        state.meditations[index] = updatedMeditation;
      }
    },
    removeMeditation: (state, action: PayloadAction<string>) => {
      state.meditations = state.meditations.filter(m => m.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMeditations, addMeditation, updateMeditationInState, removeMeditation, setLoading, setError } = meditationSlice.actions;

export default meditationSlice.reducer;
