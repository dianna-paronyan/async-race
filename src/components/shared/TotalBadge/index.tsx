import type { FC } from 'react';
import './style.css';

interface TotalBadgeProps {
  label: string;
  value: number;
}

const TotalBadge: FC<TotalBadgeProps> = ({ label, value }) => {
  return (
    <div className="total-badge">
      {label}: {value}
    </div>
  );
};

export default TotalBadge;
