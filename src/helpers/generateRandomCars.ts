import type { CarModel } from '../core/models/car.model.ts';
import CarService from '../core/services/car.service.ts';

export const generateRandomCars = async (count = 5): Promise<CarModel[]> => {
  const brands = [
    'Hyundai',
    'Ford',
    'Lexus',
    'Audi',
    'Volkswagen',
    'Toyota',
    'Honda',
    'Chevrolet',
    'Nissan',
    'Kia',
  ];
  const models = [
    'Model S',
    'Mustang',
    'X5',
    'A6',
    'Polo',
    'Camry',
    'Civic',
    'Corvette',
    'Altima',
    'Sportage',
  ];

  const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')}`;

  const cars: Omit<CarModel, 'id'>[] = [];
  for (let i = 0; i < count; i++) {
    cars.push({
      name: `${getRandomItem(brands)} ${getRandomItem(models)}`,
      color: getRandomColor(),
    });
  }

  return Promise.all(cars.map((car) => CarService.createCar(car)));
};
