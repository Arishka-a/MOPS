import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import DevicesPage from '../features/devices/pages/DevicesPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DevicesPage />,
      },
    ],
  },
]);