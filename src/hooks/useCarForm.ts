import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { addCar, editCar, getCars } from '../app/features/carSlice.ts';
import type { CarModel, NewCarModel } from '../core/models/car.model.ts';
import type { AppDispatch } from '../app/store.tsx';

export const useCarForm = (currentPage = 1, pageSize = 7) => {
  const dispatch: AppDispatch = useDispatch();
  const [car, setCar] = useState<NewCarModel>({ name: '', color: '#000000' });
  const [originalCar, setOriginalCar] = useState<NewCarModel>({ name: '', color: '#000000' });
  const [editingCarId, setEditingCarId] = useState<number | null>(null);

  const editCarForm = (car: CarModel) => {
    setCar({ name: car.name, color: car.color });
    setOriginalCar({ name: car.name, color: car.color });
    setEditingCarId(car.id);
  };

  const handleChange = (field: keyof NewCarModel, value: string) => {
    setCar((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!car.name.trim()) {
      return message.error('Car name is required!');
    }

    if (editingCarId !== null) {
      dispatch(editCar({ id: editingCarId, car: car }));
    } else {
      dispatch(addCar(car));
      dispatch(getCars({ page: currentPage, limit: pageSize }));
    }

    setCar({ name: '', color: '#000000' });
    setOriginalCar({ name: '', color: '#000000' });
    setEditingCarId(null);
  };

  const isDisabled =
    !car.name.trim() ||
    (editingCarId !== null && car.name === originalCar.name && car.color === originalCar.color);

  return {
    car,
    editingCarId,
    editCarForm,
    handleChange,
    handleSubmit,
    isDisabled,
  };
};
