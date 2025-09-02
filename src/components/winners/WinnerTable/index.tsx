import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store.tsx';
import { useEffect, useMemo } from 'react';
import { getWinners } from '../../../app/features/winnerSlice.ts';
import { getCars } from '../../../app/features/carSlice.ts';
import { Table } from 'antd';
import type { FC } from 'react';
import type { TablePaginationConfig } from 'antd';
import type { CarModel } from '../../../core/models/car.model.ts';
import type { Order } from '../../../core/models/winner.model.ts';
import type { FilterValue } from 'antd/es/table/interface';
import './style.scss';

interface WinnerTableProps {
  pageSize?: number;
}

const WinnerTable: FC<WinnerTableProps> = ({ pageSize = 10 }) => {
  const dispatch: AppDispatch = useDispatch();

  const { winners, total, loading, page, error } = useSelector((state: RootState) => state.winners);
  const { cars } = useSelector((state: RootState) => state.cars);

  useEffect(() => {
    dispatch(getWinners({ page, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  const carMap = useMemo(() => {
    const map = new Map<number, CarModel>();
    cars.forEach((car) => map.set(car.id, car));
    return map;
  }, [cars]);

  const winnersWithCar = useMemo(() => {
    return winners.map((winner) => {
      const car = carMap.get(winner.id);
      return {
        ...winner,
        carName: car?.name || '',
        carColor: car?.color || '#000',
      };
    });
  }, [winners, carMap]);

  const columns = [
    { title: 'N%', dataIndex: 'id', key: 'id' },
    {
      title: 'Car',
      dataIndex: 'carColor',
      key: 'carColor',
      render: (color: string) => <div style={{ backgroundColor: color }} className="car" />,
    },
    { title: 'Name', dataIndex: 'carName', key: 'carName' },
    { title: 'Wins', dataIndex: 'wins', key: 'wins', sorter: true },
    {
      title: 'Best Time',
      dataIndex: 'time',
      key: 'time',
      sorter: true,
      render: (t: number) => `${t.toFixed(2)}s`,
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: Record<string, FilterValue | null>,
    sorter: any,
  ) => {
    const currentPage = pagination.current ?? 1;

    let sortField: string | undefined;
    let order: Order | undefined;

    if (sorter.order) {
      sortField = sorter.field as string;
      order = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    dispatch(getWinners({ page: currentPage, limit: pageSize, sortField, order }));
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={winnersWithCar}
      pagination={{ current: page, total, pageSize }}
      onChange={handleTableChange}
      loading={loading}
      locale={{ emptyText: 'No winners yet!' }}
    />
  );
};

export default WinnerTable;
