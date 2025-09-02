export interface WinnerModel {
  id: number;
  name: string;
  time: number;
  wins: number;
}

export type NewWinnerModel = Omit<WinnerModel, 'name'>;

export interface WinnerStateModel {
  winners: WinnerModel[];
  total: number;
  page: number;
  loading: boolean;
  error: string | undefined;
  sortField?: string;
  order?: Order;
}

export type Order = 'asc' | 'desc';
