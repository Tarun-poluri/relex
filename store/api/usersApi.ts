import axios from 'axios';

export const getUsersApi = () => axios.get('/api/users');
export const saveUsersApi = (users: any) => axios.post('/api/users', users);
export const updateUserApi = (user: any) => axios.put('/api/users', user);
export const deleteUserApi = (id: string) => axios.delete('/api/users', { data: { id } });