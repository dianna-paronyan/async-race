import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import WinnerService from '../../core/services/winner.service.ts';
import type {
  NewWinnerModel,
  WinnerModel,
  WinnerStateModel,
} from '../../core/models/winner.model.ts';

const initialState: WinnerStateModel = {
  winners: [],
  total: 0,
  page: 1,
  loading: false,
  error: undefined,
  sortField: undefined,
  order: undefined,
};

export const getWinners = createAsyncThunk<
  { data: WinnerModel[]; total: number },
  { page: number; limit: number; sortField?: string; order?: 'asc' | 'desc' }
>('winners/getWinners', async ({ page, limit, sortField, order }) => {
  return await WinnerService.getWinners(page, limit, sortField, order);
});

export const addWinner = createAsyncThunk('cars/addWinner', async (winner: NewWinnerModel) => {
  return await WinnerService.addWinner(winner);
});

export const removeWinner = createAsyncThunk(
  'cars/removeWinner',
  async (id: number) => await WinnerService.deleteWinner(id),
);

const winnerSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWinners.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWinners.fulfilled, (state: WinnerStateModel, action) => {
        state.loading = false;
        state.winners = action.payload.data;
        state.total = action.payload.total;
        state.page = action.meta.arg.page;
      })
      .addCase(getWinners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addWinner.fulfilled, (state, action) => {
        state.loading = false;
        state.winners.push(action.payload);
      })
      .addCase(addWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeWinner.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = state.winners.filter((winner) => winner.id !== action.payload);
        state.total -= 1;
        if (state.winners.length === 0 && state.page > 1) {
          state.page -= 1;
        }
      })
      .addCase(removeWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {} = winnerSlice.actions;
export default winnerSlice.reducer;
