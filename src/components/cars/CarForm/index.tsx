import { Input, Button, ColorPicker, Space } from 'antd';
import type { NewCarModel } from '../../../core/models/car.model.ts';
import './style.scss';

interface CarFormProps {
  car: NewCarModel;
  handleChange: (field: keyof NewCarModel, value: string) => void;
  handleSubmit: () => void;
  isDisabled: boolean;
}

const CarForm = ({ car, handleChange, handleSubmit, isDisabled }: CarFormProps) => {
  return (
    <Space className="car-form">
      <Input
        placeholder="Car name"
        value={car.name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="car-form-input"
      />
      <ColorPicker
        value={car.color}
        onChange={(color) => handleChange('color', color.toHexString())}
        className="car-form-color"
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={isDisabled}
        className="car-form-button"
      >
        {car.name && !isDisabled ? 'Save Car' : 'Add Car'}
      </Button>
    </Space>
  );
};

export default CarForm;
