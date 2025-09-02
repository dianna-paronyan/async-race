import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import CarService from '../../core/services/car.service.ts';
import type { CarModel, CarStateModel, NewCarModel } from '../../core/models/car.model.ts';
import { generateRandomCars } from '../../helpers/generateRandomCars.ts';

const initialState: CarStateModel = {
  cars: [],
  page: 1,
  total: 0,
  racing: false,
  loading: false,
  error: undefined,
};

export const getCars = createAsyncThunk<
  { data: CarModel[]; total: number },
  { page?: number; limit?: number } | undefined
>('cars/getCars', async ({ page, limit } = {}) => {
  if (!page && !limit) {
    const res = await CarService.getCars();
    return { data: res.data, total: res.total };
  }
  return await CarService.getCars(page ?? 1, limit ?? 10);
});

export const addCar = createAsyncThunk(
  'cars/addCar',
  async (car: NewCarModel) => await CarService.createCar(car),
);

export const addRandomCars = createAsyncThunk('cars/addRandomCars', async (count: number) => {
  return await generateRandomCars(count);
});

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

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCarRacing: (state, action: PayloadAction<{ id: number; racing: boolean }>) => {
      const car = state.cars.find((c) => c.id === action.payload.id);
      if (car) car.racing = action.payload.racing;
      state.racing = state.cars.some((c) => c.racing);
    },
    setCarPosition: (state, action: PayloadAction<{ id: number; position: number }>) => {
      const car = state.cars.find((c) => c.id === action.payload.id);
      if (car) car.position = action.payload.position;
      state.racing = state.cars.some((c) => c.racing);
    },
    finishRace: (state) => {
      state.cars.forEach((car: CarModel) => (car.racing = false));
      state.racing = false;
    },
    resetRace: (state) => {
      state.cars.forEach((car) => {
        car.position = 0;
        car.racing = false;
      });
      state.racing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.data.map((car) => ({
          ...car,
          position: 0,
          racing: false,
          velocity: 0,
          distance: 0,
        }));
        state.total = action.payload.total;
        if (action.meta.arg?.page !== undefined) {
          state.page = action.meta.arg.page;
        }
      })
      .addCase(getCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.cars.push({
          ...action.payload,
          position: 0,
          racing: false,
          velocity: 0,
          distance: 0,
        });
        state.total += 1;
      })
      .addCase(editCar.fulfilled, (state, action) => {
        const idx = state.cars.findIndex((car) => car.id === action.payload.id);
        if (idx !== -1) {
          state.cars[idx] = {
            ...action.payload,
            position: state.cars[idx].position,
            racing: state.cars[idx].racing,
            velocity: state.cars[idx].velocity,
            distance: state.cars[idx].distance,
          };
        }
      })
      .addCase(removeCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
        state.total -= 1;
        if (state.cars.length === 0 && state.page > 1) {
          state.page -= 1;
        }
      })
      .addCase(addRandomCars.fulfilled, (state, action) => {
        state.cars = action.payload.map((car) => ({
          ...car,
          position: 0,
          racing: false,
          velocity: 0,
          distance: 0,
        }));

        state.total += action.payload.length;
      });
  },
});

export const { setCarRacing, setCarPosition, finishRace, resetRace } = carsSlice.actions;
export default carsSlice.reducer;
