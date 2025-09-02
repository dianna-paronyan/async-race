import { configureStore } from '@reduxjs/toolkit';
import carReducer from './features/carSlice.ts';
import winnerReducer from './features/winnerSlice.ts';

export const store = configureStore({
  reducer: {
    cars: carReducer,
    winners: winnerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
