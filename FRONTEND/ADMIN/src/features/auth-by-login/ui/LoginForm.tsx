import { Form, Input, Button, Alert} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '../lib/useLogin';
import type { LoginRequest } from '@/shares/types/api';


export const LoginForm = () => {
  const { login, loading, error } = useLogin();

  const onFinish = (values: LoginRequest) => {
    login(values);
  };

  return (
    <>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Form
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="login"
          label="Логин"
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="admin"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="••••••••"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
