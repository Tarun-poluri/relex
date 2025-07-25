import axios from 'axios';
import { DailyPlayRecord } from '@/app/types/dailyPlayTypes';

export const getDailyPlayApi = () => axios.get<DailyPlayRecord[]>('/api/daily-play');
export const updateDailyPlayApi = (date: string, meditationId: string) =>
  axios.put<DailyPlayRecord>('/api/daily-play', { date, meditationId }); // Pass date and meditationId
