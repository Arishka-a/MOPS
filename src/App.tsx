import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { store, persistor } from './app/store';
import { router } from './router/router';
import { useAppSelector } from './hooks/redux';
import { selectAuthToken } from './features/auth/selectors';
import { clearCredentials } from './features/auth/authSlice';
import { isJwtExpired } from './utils/jwt';

const ExpiredTokenGuard = () => {
  const dispatch = useDispatch();
  const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    if (token && isJwtExpired(token)) {
      dispatch(clearCredentials());
    }
  }, [token, dispatch]);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ExpiredTokenGuard />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
