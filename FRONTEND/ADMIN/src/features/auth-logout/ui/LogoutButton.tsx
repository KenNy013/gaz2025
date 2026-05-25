import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { logoutUser } from '@/features/auth-logout/lib';

interface Props {
  collapsed: boolean;
}

export const LogoutButton = observer(({ collapsed }: Props) => {
  return (
    <Button
      danger
      type="primary"
      icon={<LogoutOutlined />}
      block
      size="large"
      onClick={logoutUser}
      style={{
        height: collapsed ? '48px' : '54px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: '8px',
        fontSize: '16px'
      }}
    >
      {!collapsed && (
        <span style={{ marginLeft: 8 }}>Выйти из системы</span>
      )}
    </Button>
  );
});
