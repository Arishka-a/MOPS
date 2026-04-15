import { api } from '../../app/api';
import type {
  LoginRequest,
  RegisterRequest,
  TokenSchema,
  UserSchema,
  LogoutResponse,
} from './types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenSchema, LoginRequest>({
      query: (credentials) => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        if (credentials.grant_type) formData.append('grant_type', credentials.grant_type);
        if (credentials.scope) formData.append('scope', credentials.scope);

        return {
          url: '/auth/token',
          method: 'POST',
          body: formData.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
    }),

    register: builder.mutation<UserSchema, RegisterRequest>({
      query: (data) => {
        const formData = new URLSearchParams();
        formData.append('username', data.username);
        formData.append('password', data.password);

        return {
          url: '/auth/register',
          method: 'POST',
          body: formData.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;