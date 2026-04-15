import { UserRole } from '../../types/enums';

export interface UserSchema {
  username: string;
  id: string;
  role: UserRole;
  is_active?: boolean;
}

export interface TokenSchema {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthState {
  user: UserSchema | null;
  token: string | null;
  isAuthenticated: boolean;
}