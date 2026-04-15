import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';

const DevicesPlaceholder = () => (
  <div className="flex items-center justify-center h-screen text-xl text-gray-500">
    Устройства — скоро будет
  </div>
);

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
        element: <DevicesPlaceholder />,
      },
    ],
  },
]);