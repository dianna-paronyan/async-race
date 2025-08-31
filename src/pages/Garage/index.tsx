import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Spin, Button } from 'antd';
import { useCarForm } from '../../hooks/useCarForm.ts';
import type { CarRowHandle } from '../../components/CarRow';
import type { AppDispatch, RootState } from '../../app/store.tsx';
import { addRandomCars, getCars, removeCar } from '../../app/features/carSlice.ts';
import CarForm from '../../components/CarForm';
import GarageControls from '../../components/GarageControls';
import CarRow from '../../components/CarRow';
import { removeWinner } from '../../app/features/winnerSlice.ts';
import './style.scss';

const Garage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, page, total, loading, error } = useSelector((state: RootState) => state.cars);
  const carRefs = useRef<(CarRowHandle | null)[]>([]);
  const { car, editCarForm, handleChange, handleSubmit, isDisabled } = useCarForm(page);

  useEffect(() => {
    dispatch(getCars({ page, limit: 7 }));
  }, [dispatch, page]);

  const handleDelete = (id: number) => {
    dispatch(removeCar(id));
    dispatch(removeWinner(id));
  };

  const generateRandomCars = () => {
    dispatch(addRandomCars(5));
    dispatch(getCars({ page, limit: 7 }));
  };

  const handlePageChange = (newPage: number) => dispatch(getCars({ page: newPage, limit: 7 }));

  if (loading) return <Spin />;
  if (error) return <p>{error}</p>;

  return (
    <div className="garage">
      <CarForm
        car={car}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isDisabled={isDisabled}
      />

      <GarageControls carRefs={carRefs.current} onAddCars={generateRandomCars} />

      {cars.map((car, idx) => (
        <div key={car.id} className="garage-row">
          <Button onClick={() => editCarForm(car)}>Edit</Button>
          <Button danger onClick={() => handleDelete(car.id)}>
            Delete
          </Button>
          <CarRow
            ref={(el) => {
              carRefs.current[idx] = el;
            }}
            car={car}
          />
        </div>
      ))}

      <Pagination current={page} total={total} pageSize={7} onChange={handlePageChange} />
      <div className="garage-total">Total Cars: {total}</div>
    </div>
  );
};

export default Garage;
