import { Input, Button, ColorPicker, Space } from 'antd';
import type { NewCarModel } from '../../core/models/car.model.ts';

interface CarFormProps {
  car: NewCarModel;
  handleChange: (field: keyof NewCarModel, value: string) => void;
  handleSubmit: () => void;
  isDisabled: boolean;
}

const CarForm = ({ car, handleChange, handleSubmit, isDisabled }: CarFormProps) => {
  return (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder="Car name"
        value={car.name}
        onChange={(e) => handleChange('name', e.target.value)}
        style={{ width: 200 }}
      />
      <ColorPicker
        value={car.color}
        onChange={(color) => handleChange('color', color.toHexString())}
      />
      <Button type="primary" onClick={handleSubmit} disabled={isDisabled}>
        {car.name && !isDisabled ? 'Save Car' : 'Add Car'}
      </Button>
    </Space>
  );
};

export default CarForm;
