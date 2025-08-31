import React from 'react';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { resetRace } from '../../app/features/carSlice';
import type { CarRowHandle } from '../CarRow';
import type { AppDispatch, RootState } from '../../app/store';
import './style.scss';

interface ControlProps {
  carRefs: (CarRowHandle | null)[];
  onAddCars: () => void;
}

const GarageControls: React.FC<ControlProps> = ({ carRefs, onAddCars }) => {
  const { cars } = useSelector((state: RootState) => state.cars);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const [successMessage, messageHolder] = message.useMessage();
  const showSuccessMessage = (msg: string) => {
    successMessage.open({
      type: 'success',
      content: msg,
      duration: 3000,
    });
    setTimeout(successMessage.destroy, 3000);
  };

  const startCarRace = async () => {
    if (!carRefs.length) return;

    const promises = cars.map((_, idx) => carRefs[idx]?.start() ?? Promise.resolve(null));
    const results = (await Promise.all(promises)).filter(Boolean) as {
      id: number;
      time: number;
      name: string;
    }[];

    if (results.length) {
      const winner = results.reduce((a, b) => (a.time < b.time ? a : b));
      showSuccessMessage(`🏆 Winner: ${winner.name} (${winner.time.toFixed(2)}s)`);
    }
  };

  const resetCarRace = () => {
    carRefs.forEach((ref) => ref?.stop());
    dispatch(resetRace());
  };

  return (
    <div className="garage-controls">
      {messageHolder}
      <Button type="primary" onClick={startCarRace}>
        Start Race
      </Button>
      <Button onClick={resetCarRace}>Reset Race</Button>
      <Button type="dashed" onClick={onAddCars}>
        Add Cars
      </Button>
    </div>
  );
};

export default GarageControls;
