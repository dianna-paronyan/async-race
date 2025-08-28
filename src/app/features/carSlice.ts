import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { CarModel, CarStateModel, NewCarModel } from '../../core/models/car.model.ts';
import CarService from '../../core/services/car.service.ts';
import { generateRandomCars } from '../../helpers/generateRandomCars.ts';

const initialState: CarStateModel = {
  cars: [],
  page: 0,
  total: 0,
  loading: false,
  error: undefined,
};

export const getCars = createAsyncThunk<
  { data: CarModel[]; total: number },
  { page: number; limit: number }
>('cars/getCars', async ({ page, limit }) => {
  return await CarService.getCars(page, limit);
});

export const addCar = createAsyncThunk(
  'cars/addCar',
  async (car: NewCarModel) => await CarService.createCar(car),
);

export const editCar = createAsyncThunk(
  'cars/editCar',
  async ({ id, car }: { id: number; car: NewCarModel }) => {
    return await CarService.updateCar(id, car);
  },
);

export const removeCar = createAsyncThunk(
  'cars/removeCar',
  async (id: number) => await CarService.deleteCar(id),
);

export const addRandomCars = createAsyncThunk('cars/addRandomCars', async (count: number) => {
  return await generateRandomCars(count);
});

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCars.fulfilled, (state: CarStateModel, action) => {
        state.loading = false;
        state.cars = action.payload.data;
        state.total = action.payload.total;
        state.page = action.meta.arg.page;
      })
      .addCase(getCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.cars.push(action.payload);
      })
      .addCase(editCar.fulfilled, (state, action) => {
        const NOT_FOUND = -1;
        const carIndex = state.cars.findIndex((car) => car.id === action.payload.id);

        if (carIndex !== NOT_FOUND) {
          state.cars[carIndex] = action.payload;
        }
      })
      .addCase(removeCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
        state.total -= 1;
        if (state.cars.length === 0 && state.page > 1) {
          state.page = state.page - 1;
        }
      })
      .addCase(addRandomCars.fulfilled, (state, action) => {
        state.cars = action.payload;
      });
  },
});

export default carsSlice.reducer;
