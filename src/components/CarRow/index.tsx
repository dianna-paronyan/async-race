import { Button } from 'antd';
import type { FC } from 'react';
import type { CarModel } from '../../core/models/car.model.ts';
import './style.css';

interface CarRowProps {
  car: CarModel;
}

const CarRow: FC<CarRowProps> = ({ car }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <Button>Start</Button>
      <Button>Stop</Button>
      <div
        className="car"
        style={{
          maskImage: 'url(/car.svg)',
          WebkitMaskImage: 'url(/car.svg)',
          maskRepeat: 'no-repeat',
          maskSize: 'contain',
          background: car.color,
        }}
      ></div>
      <span>{car.name}</span>
    </div>
  );
};

export default CarRow;
