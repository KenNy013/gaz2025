import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { userStore } from '@/entities/user/model/store';
import { Spin } from 'antd';


export const ProtectedRoute = observer(() => {
  const { isInit, isAuthenticated, isServerError } = userStore;




  if (!isInit) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large"/>
      </div>
    );
  }

  if (isServerError) {
    return <Navigate to="/server" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
});
