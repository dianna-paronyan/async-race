import axios, { AxiosError } from 'axios';
import { Urls } from '../data/urls.ts';
import type { NewWinnerModel } from '../models/winner.model.ts';
import { isArrayValue } from '../../helpers/isArray.ts';

const WinnerService = () => {
  const getWinners = async (page: number, limit: number, sortField?: string, order?: string) => {
    const res = await axios.get(
      `${Urls.WINNERS}?_page=${page}&_limit=${limit}${
        sortField ? `&_sort=${sortField}&_order=${order}` : ''
      }`,
    );
    return { data: isArrayValue(res.data), total: Number(res.headers['x-total-count']) };
  };

  const addWinner = async (winner: NewWinnerModel) => {
    try {
      const res = await axios.get(`${Urls.WINNERS}/${winner.id}`);
      const existing = res.data;
      const updated = {
        ...existing,
        wins: existing.wins + 1,
        time: Math.min(existing.time, winner.time),
      };
      await axios.put(`${Urls.WINNERS}/${winner.id}`, updated);
      return updated;
    } catch {
      const res = await axios.post(Urls.WINNERS, { ...winner, wins: 1 });
      return res.data;
    }
  };

  const deleteWinner = async (id: number) => {
    try {
      await axios.delete(`${Urls.WINNERS}/${id}`);
      return id;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Error deleting winner');
    }
  };

  return { getWinners, addWinner, deleteWinner };
};

export default WinnerService();
