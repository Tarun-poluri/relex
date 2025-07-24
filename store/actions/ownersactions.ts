import { Dispatch } from '@reduxjs/toolkit';
import { getOwnersApi, saveOwnerApi, updateOwnerApi, deleteOwnerApi } from '@/store/api/ownersApi';
import { Owner } from '@/app/types/ownerTypes';
import { setLoading, setError, setOwners } from '@/store/reducers/ownerReducer';
import { addOwner, updateOwnerInState, removeOwner } from '@/store/reducers/ownerReducer';

type AppDispatch = Dispatch;

export const fetchOwners = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await getOwnersApi();
    dispatch(setOwners(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
    console.error("Failed to fetch owners:", errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createOwner = (ownerData: Omit<Owner, 'id' | 'status' | 'createdAt'>) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await saveOwnerApi(ownerData as Owner);
    dispatch(addOwner(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
    console.error("Failed to create owner:", errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateOwner = (owner: Owner) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await updateOwnerApi(owner);
    dispatch(updateOwnerInState(response.data));
    dispatch(setError(null));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
    console.error("Failed to update owner:", errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteOwner = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await deleteOwnerApi(id);
    dispatch(removeOwner(id));
    dispatch(setError(null));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
    console.error("Failed to delete owner:", errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};
