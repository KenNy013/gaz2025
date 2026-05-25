import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/shares/api/base';
import { API_ROUTES } from '@/shares/constants/api';
import { userStore } from '@/entities/user/model/store';
import type { LoginRequest } from '@/shares/types/api';


export const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (values: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(API_ROUTES.ADMIN.LOGIN, values);
      userStore.setAuth(true);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
