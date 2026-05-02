import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../api';
import { setCredentials } from '../authSlice';
import { useAppDispatch } from '../../../hooks/redux';
import { getUsernameFromJwt } from '../../../utils/jwt';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const isLoading = isLoginLoading || isRegisterLoading;

  const validate = (): string | null => {
    if (username.length < 3 || username.length > 32) {
      return 'Имя пользователя: от 3 до 32 символов';
    }
    if (password.length < 6 || password.length > 32) {
      return 'Пароль: от 6 до 32 символов';
    }
    return null;
  };

  const performLogin = async () => {
    const tokenData = await login({ username, password }).unwrap();
    const usernameFromToken =
      getUsernameFromJwt(tokenData.access_token) ?? username;

    dispatch(
      setCredentials({
        token: tokenData.access_token,
        username: usernameFromToken,
      }),
    );
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (!isLogin) {
        await register({ username, password }).unwrap();
      }
      await performLogin();
    } catch (err: unknown) {
      const e = err as { data?: { detail?: unknown; message?: unknown } };
      const message = e?.data?.detail ?? e?.data?.message ?? 'Произошла ошибка';
      setError(typeof message === 'string' ? message : JSON.stringify(message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-600">
            М.О.П.С.
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Система управления устройствами TEDIX
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isLogin
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                !isLogin
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Регистрация
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="login-username"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Имя пользователя <span className="text-red-500">*</span>
              </label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="От 3 до 32 символов"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           placeholder:text-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Пароль <span className="text-red-500">*</span>
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="От 6 до 32 символов"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           placeholder:text-gray-400"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg
                         hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Подождите...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
