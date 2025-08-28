import { Pagination, Spin, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store.tsx';
import { useCarForm } from '../../hooks/useCarForm';
import { addRandomCars, getCars, removeCar } from '../../app/features/carSlice.ts';
import GarageControls from '../../components/GarageControls';
import CarRow from '../../components/CarRow';
import CarForm from '../../components/CarForm';
import { useEffect } from 'react';

const Garage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { cars, page, total, loading } = useSelector((state: RootState) => state.cars);
  const { car, editCarForm, handleChange, handleSubmit, isDisabled } = useCarForm(page);

  useEffect(() => {
    dispatch(getCars({ page, limit: 7 }));
  }, [dispatch, page]);

  const generateRandomCars = () => {
    dispatch(addRandomCars(5));
    dispatch(getCars({ page, limit: 7 }));
  };

  const handleDelete = (id: number) => dispatch(removeCar(id));

  const handlePageChange = (newPage: number) => dispatch(getCars({ page: newPage, limit: 7 }));

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 20 }}>
      <CarForm
        car={car}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isDisabled={isDisabled}
      />
      <GarageControls onAddCars={generateRandomCars} />
      {cars.map((carItem) => (
        <div key={carItem.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button onClick={() => editCarForm(carItem)}>Edit</Button>
          <Button danger onClick={() => handleDelete(carItem.id)}>
            Delete
          </Button>
          <CarRow car={carItem} />
        </div>
      ))}
      <Pagination current={page} total={total} pageSize={7} onChange={handlePageChange} />
    </div>
  );
};

export default Garage;
