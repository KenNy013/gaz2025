import { LoginForm } from '@/features/auth-by-login/ui/LoginForm';
import { Card, Typography } from 'antd';

const { Title} = Typography;

export const LoginPage = () => {


   return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Вход в систему
        </Title>
        <LoginForm />
      </Card>
    </div>
  );
};
