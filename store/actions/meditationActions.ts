import { Dispatch } from '@reduxjs/toolkit';
import { getMeditationsApi, createMeditationApi, updateMeditationApi, deleteMeditationApi } from '@/store/api/meditationsApi';
import { MusicMeditation } from '@/app/types/meditationTypes';
import { setMeditations, addMeditation, updateMeditationInState, removeMeditation, setLoading, setError } from '@/store/reducers/meditationReducer';

type AppDispatch = Dispatch;

export const fetchMeditations = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await getMeditationsApi();
    dispatch(setMeditations(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
    console.error("Failed to fetch meditations:", errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createMeditation = (meditationData: Omit<MusicMeditation, 'id' | 'createdAt' | 'updatedAt'>) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await createMeditationApi(meditationData);
    dispatch(addMeditation(response.data));
    dispatch(setError(null));
    return response.data; // Return the created meditation
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
    console.error("Failed to create meditation:", errorMessage);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateMeditation = (meditation: MusicMeditation) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await updateMeditationApi(meditation);
    dispatch(updateMeditationInState(response.data));
    dispatch(setError(null));
    return response.data; // Return the updated meditation
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
    console.error("Failed to update meditation:", errorMessage);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteMeditation = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await deleteMeditationApi(id);
    dispatch(removeMeditation(id));
    dispatch(setError(null));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
    console.error("Failed to delete meditation:", errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};
