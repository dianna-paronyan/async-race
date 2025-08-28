import axios, { AxiosError } from 'axios';
import type { CarModel, NewCarModel } from '../models/car.model.ts';
import { Urls } from '../data/urls.ts';

const CarService = () => {
  const getCars = async (page: number, limit: number) => {
    try {
      const res = await axios.get(`${Urls.CARS}?_page=${page}&_limit=${limit}`);

      return {
        data: res.data,
        total: Number(res.headers['x-total-count']),
      };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error getting car');
    }
  };

  const createCar = async (car: NewCarModel) => {
    try {
      const res = await axios.post<CarModel>(Urls.CARS, car);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error creating car');
    }
  };

  const updateCar = async (id: number, car: NewCarModel) => {
    try {
      const res = await axios.put<CarModel>(`${Urls.CARS}/${id}`, car);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error updating car');
    }
  };

  const deleteCar = async (id: number) => {
    try {
      await axios.delete(`${Urls.CARS}/${id}`);
      return id;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error deleting car');
    }
  };

  return { getCars, createCar, updateCar, deleteCar };
};

export default CarService();
