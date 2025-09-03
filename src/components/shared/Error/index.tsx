import { Alert } from 'antd';
import type { FC } from 'react';

interface ErrorProps {
  message: string;
}

const Error: FC<ErrorProps> = ({ message }) => {
  return (
    <div>
      <Alert message="Error" description={message} type="error" showIcon />
    </div>
  );
};

export default Error;
