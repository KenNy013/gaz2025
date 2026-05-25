import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Result
        status="500"
        title="500"
        subTitle="Проблема с сервером"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Перезагрузите
          </Button>
        }
      />
    </div>
  );
};
