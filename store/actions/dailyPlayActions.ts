import { getDailyPlayApi, updateDailyPlayApi } from '@/store/api/dailyPlayApi';
import { setDailyPlays, setDailyPlayLoading, setDailyPlayError } from '@/store/reducers/dailyPlayReducer';
import { DailyPlayRecord } from '@/app/types/dailyPlayTypes';
import { AppDispatch, RootState } from '@/store/store';

export const fetchDailyPlay = () => async (dispatch: AppDispatch) => {
  dispatch(setDailyPlayLoading(true));
  try {
    const response = await getDailyPlayApi();
    dispatch(setDailyPlays(response.data));
    dispatch(setDailyPlayError(null));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setDailyPlayError(errorMessage));
    console.error("Failed to fetch daily play data:", errorMessage);
  } finally {
    dispatch(setDailyPlayLoading(false));
  }
};

export const recordMeditationPlay = (meditationId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  try {
    const currentDailyPlays = getState().dailyPlay.dailyPlays;

    let updatedPlays: DailyPlayRecord[];
    const existingRecordIndex = currentDailyPlays.findIndex(record => record.date === todayString);

    if (existingRecordIndex !== -1) {
      updatedPlays = [...currentDailyPlays];
      updatedPlays[existingRecordIndex] = {
        ...updatedPlays[existingRecordIndex],
        plays: updatedPlays[existingRecordIndex].plays + 1
      };
    } else {
      const newRecord: DailyPlayRecord = { date: todayString, plays: 1 };
      updatedPlays = [...currentDailyPlays, newRecord];
      updatedPlays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    dispatch(setDailyPlays(updatedPlays));
    dispatch(setDailyPlayError(null));

    await updateDailyPlayApi(todayString, meditationId);

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setDailyPlayError(errorMessage));
    console.error("Failed to record meditation play:", errorMessage);
    dispatch(fetchDailyPlay());
  }
};
