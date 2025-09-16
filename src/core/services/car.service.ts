import axios, { AxiosError } from 'axios';
import type { CarModel, NewCarModel } from '../models/car.model.ts';
import { Urls } from '../data/urls.ts';
import { isArrayValue } from '../../helpers/isArray.ts';

const CarService = () => {
  const getCars = async (page?: number, limit?: number) => {
    try {
      let url = Urls.CARS;
      if (page && limit) {
        url += `?_page=${page}&_limit=${limit}`;
      }
      const res = await axios.get(url);
      return {
        data: isArrayValue(res.data),
        total: Number(res.headers['x-total-count']),
      };
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error getting cars');
    }
  };

  const getCar = async (id: number) => {
    try {
      const res = await axios.get(`${Urls.CARS}/${id}`);
      return res.data;
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

  const startEngine = async (id: number) => {
    try {
      const res = await axios.patch<{ velocity: number; distance: number }>(
        `${Urls.ENGINE}?id=${id}&status=started`,
      );
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error starting engine for car');
    }
  };

  const stopEngine = async (id: number) => {
    try {
      const res = await axios.patch(`${Urls.ENGINE}?id=${id}&status=stopped`);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error stopping engine for car');
    }
  };

  const drive = async (id: number) => {
    try {
      const res = await axios.patch<{ success: boolean }>(`${Urls.ENGINE}?id=${id}&status=drive`);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error driving car');
    }
  };

  return { getCars, getCar, createCar, updateCar, deleteCar, startEngine, stopEngine, drive };
};

export default CarService();
