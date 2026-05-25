import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useEffect } from 'react';
import { userStore } from '@/entities/user/model/store';


export const AppRouter = () => {
  useEffect(() => {
    userStore.checkAuth();
  }, []);

  return <RouterProvider router={router} />;
};
