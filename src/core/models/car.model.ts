interface Car {
  id: number;
  name: string;
  color: string;
}
export interface CarModel extends Car {
  position?: number;
  racing?: boolean;
  velocity?: number;
  distance?: number;
}

export type NewCarModel = Omit<Car, 'id'>;

export interface CarStateModel {
  cars: CarModel[];
  page: number;
  total: number;
  racing: boolean;
  loading: boolean;
  error: string | undefined;
}
