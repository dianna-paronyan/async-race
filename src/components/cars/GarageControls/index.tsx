import { useRef } from 'react';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { finishRace, resetRace } from '../../../app/features/carSlice.ts';
import { addWinner } from '../../../app/features/winnerSlice.ts';
import type { FC } from 'react';
import type { CarRowHandle } from '../CarRow';
import type { AppDispatch, RootState } from '../../../app/store.tsx';
import './style.scss';

interface ControlProps {
  carRefs: (CarRowHandle | null)[];
  onAddCars: () => void;
}

const GarageControls: FC<ControlProps> = ({ carRefs, onAddCars }) => {
  const { cars, racing } = useSelector((state: RootState) => state.cars);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const [successMessage, messageHolder] = message.useMessage();
  const raceCanceled = useRef(false);

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
    raceCanceled.current = false;
    const promises = cars.map((_, idx) => carRefs[idx]?.start() ?? Promise.resolve(null));

    const results = (await Promise.all(promises)).filter(Boolean) as {
      id: number;
      time: number;
      name: string;
      wins: number;
    }[];

    if (results.length) {
      const winner = results.reduce((a, b) => (a.time < b.time ? a : b));
      dispatch(addWinner({ id: winner.id, time: winner.time, wins: winner.wins + 1 }));
      showSuccessMessage(`🏆 Winner: ${winner.name} (${winner.time.toFixed(2)}s)`);
    }

    dispatch(finishRace());
  };

  const resetCarRace = () => {
    raceCanceled.current = true;
    carRefs.forEach((ref) => ref?.stop());
    dispatch(resetRace());
    dispatch(finishRace());
  };

  return (
    <div className="garage-controls">
      {messageHolder}
      <Button type="primary" onClick={startCarRace} disabled={racing}>
        Start Race
      </Button>
      <Button onClick={resetCarRace}>Reset Race</Button>
      <Button type="dashed" onClick={onAddCars} disabled={racing}>
        Add Cars
      </Button>
    </div>
  );
};

export default GarageControls;
