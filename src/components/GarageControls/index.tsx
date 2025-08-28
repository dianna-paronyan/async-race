import { Button, Space } from 'antd';

interface GarageControlsProps {
  onAddCars: () => void;
}

const GarageControls = ({ onAddCars }: GarageControlsProps) => (
  <Space style={{ marginBottom: 20 }}>
    <Button onClick={onAddCars}>Generate Random Cars</Button>
    <Button>Race All</Button>
    <Button>Reset</Button>
  </Space>
);

export default GarageControls;
