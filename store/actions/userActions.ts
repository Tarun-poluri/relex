// store/actions/userActions.ts
import { getUsersApi, saveUsersApi, updateUserApi, deleteUserApi } from '../api/usersApi';
import { AppDispatch } from '../store';

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setUsersLoading(true));
    const response = await getUsersApi();
    dispatch(setUsers(response.data));
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    dispatch(setUsersLoading(false));
  }
};

export const createUser = (user: any) => async (dispatch: AppDispatch) => {
  try {
    const currentUsersResponse = await getUsersApi();
    const currentUsers = currentUsersResponse.data;
    const maxId = Math.max(0, ...currentUsers.map((u: any) => parseInt(u.id)));
    const newId = String(maxId + 1);
    
    const newUser = {
      ...user,
      id: newId,
      status: "Active",
      lastLogin: new Date().toLocaleString(),
      avatar: "/placeholder.svg",
    };
    
    await saveUsersApi([...currentUsers, newUser]);
    dispatch(fetchUsers());
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
};

export const updateUser = (user: any) => async (dispatch: AppDispatch) => {
  try {
    await updateUserApi(user);
    dispatch(fetchUsers());
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error };
  }
};

export const removeUser = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await deleteUserApi(id);
    dispatch(fetchUsers());
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
};

export const setUsers = (users: any) => ({
  type: 'users/setUsers',
  payload: users,
});

export const setUsersLoading = (isLoading: boolean) => ({
  type: 'users/setLoading',
  payload: isLoading,
});