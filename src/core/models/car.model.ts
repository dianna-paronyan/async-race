export interface CarModel {
  id: number;
  name: string;
  color: string;
}

export type NewCarModel = Omit<CarModel, 'id'>;

export interface CarStateModel {
  cars: CarModel[];
  page: number;
  total: number;
  raceWinner?: CarModel;
  loading: boolean;
  error: string | undefined;
}
