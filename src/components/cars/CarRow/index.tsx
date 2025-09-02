import { forwardRef, useImperativeHandle } from 'react';
import { useCarAnimation } from '../../../hooks/useCarAnimation.ts';
import type { CarModel } from '../../../core/models/car.model.ts';
import './style.scss';

export interface CarRowHandle {
  start: () => Promise<{ id: number; time: number; name: string } | null>;
  stop: () => void;
}

interface CarRowProps {
  car: CarModel;
}

const CarRow = forwardRef<CarRowHandle, CarRowProps>(({ car }, ref) => {
  const { carRef, trackRef, start, stop } = useCarAnimation(car);
  useImperativeHandle(ref, () => ({ start, stop }));

  return (
    <>
      <div className="car-row-controls">
        <button onClick={start} disabled={car.racing}>
          Start
        </button>
        <button onClick={stop} disabled={car.position === 0 && !car.racing}>
          Stop
        </button>
      </div>

      <div className="car-row-track" ref={trackRef}>
        <div className="car-row-car" ref={carRef} style={{ backgroundColor: car.color }} />
        <div className="car-row-finish" />
        <span className="car-row-name">{car.name}</span>
      </div>
    </>
  );
});
export default CarRow;
