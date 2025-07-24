import axios from 'axios';
import { Owner } from '@/app/types/ownerTypes';

export const getOwnersApi = () => axios.get('/api/owners');
export const saveOwnerApi = (owner: Owner) => axios.post('/api/owners', owner);
export const updateOwnerApi = (owner: Owner) => axios.put('/api/owners', owner);
export const deleteOwnerApi = (id: string) => axios.delete('/api/owners', { data: { id } });