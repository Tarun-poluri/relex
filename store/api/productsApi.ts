import axios from 'axios';

export const getProductsApi = () => axios.get('/api/products');
export const createProductApi = (product: any) => axios.post('/api/products', product);
export const updateProductApi = (product: any) => axios.put('/api/products', product);
export const deleteProductApi = (id: string) => axios.delete('/api/products', { data: { id } });