import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { clearCredentials } from './authSlice';
import { useLogoutMutation } from './api';
import { api } from '../../app/api';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // 
    }
    dispatch(clearCredentials());
    dispatch(api.util.resetApiState());
    navigate('/login', { replace: true });
  }, [logoutMutation, dispatch, navigate]);

  return { logout, isLoading };
};
