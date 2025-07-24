import axios from 'axios';
import { MusicMeditation } from '@/app/types/meditationTypes';

export const getMeditationsApi = () => axios.get('/api/meditations');
export const createMeditationApi = (meditation: Omit<MusicMeditation, 'id' | 'createdAt' | 'updatedAt'>) => axios.post('/api/meditations', meditation);
export const updateMeditationApi = (meditation: MusicMeditation) => axios.put('/api/meditations', meditation);
export const deleteMeditationApi = (id: string) => axios.delete('/api/meditations', { data: { id } });
