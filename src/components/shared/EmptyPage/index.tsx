import { CarOutlined } from '@ant-design/icons';

type EmptyStateProps = {
  message: string;
};

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div
      className="empty-state"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        border: '1px dashed #ccc',
        borderRadius: '12px',
        marginTop: '2rem',
        backgroundColor: '#fafafa',
      }}
    >
      <CarOutlined style={{ fontSize: '3rem', color: '#999', marginBottom: '1rem' }} />
      <h2 style={{ marginBottom: '0.5rem' }}>{message}</h2>
    </div>
  );
};

export default EmptyState;
