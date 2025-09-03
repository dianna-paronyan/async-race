import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Button } from 'antd';
import { useCarForm } from '../../hooks/useCarForm.ts';
import { addRandomCars, getCars, removeCar } from '../../app/features/carSlice.ts';
import CarForm from '../../components/cars/CarForm';
import GarageControls from '../../components/cars/GarageControls';
import CarRow from '../../components/cars/CarRow';
import { removeWinner } from '../../app/features/winnerSlice.ts';
import EmptyPage from '../../components/shared/EmptyPage';
import type { CarRowHandle } from '../../components/cars/CarRow';
import type { AppDispatch, RootState } from '../../app/store.tsx';
import Spinner from '../../components/shared/Spinner';
import Error from '../../components/shared/Error';
import TotalBadge from '../../components/shared/TotalBadge';
import './style.scss';

const Garage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, page, total, racing, loading, error } = useSelector(
    (state: RootState) => state.cars,
  );
  const { winners } = useSelector((state: RootState) => state.winners);
  const carRefs = useRef<(CarRowHandle | null)[]>([]);
  const { car, editCarForm, handleChange, handleSubmit, isDisabled, errorMessageHolder } =
    useCarForm(page);

  useEffect(() => {
    dispatch(getCars({ page, limit: 7 }));
  }, [dispatch, page]);

  const handleDelete = (id: number) => {
    dispatch(removeCar(id));

    const winnerExists = winners.some((w) => w.id === id);
    if (winnerExists) {
      dispatch(removeWinner(id));
    }
  };

  const generateRandomCars = () => {
    dispatch(addRandomCars(5));
  };

  const handlePageChange = (newPage: number) => dispatch(getCars({ page: newPage, limit: 7 }));

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div className="garage">
      {errorMessageHolder}
      <CarForm
        car={car}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isDisabled={isDisabled}
      />

      <GarageControls carRefs={carRefs.current} onAddCars={generateRandomCars} />
      {!total ? (
        <EmptyPage message="No cars in the garage yet." />
      ) : (
        <>
          {cars.map((car, idx) => (
            <div key={car.id} className="garage-row">
              <Button onClick={() => editCarForm(car)} disabled={racing}>
                Edit
              </Button>
              <Button danger onClick={() => handleDelete(car.id)} disabled={racing}>
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

          <Pagination
            current={page}
            total={total}
            pageSize={7}
            onChange={handlePageChange}
            disabled={racing}
          />
          <TotalBadge label="Total cars" value={total} />
        </>
      )}
    </div>
  );
};

export default Garage;
