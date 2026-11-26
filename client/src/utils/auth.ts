import type {
  AuthResponse,
  CurrentUser,
  LoginCredentials,
  RegisterData,
} from '../interfaces';
import { requestJson } from './http';

function signUp(data: RegisterData): Promise<CurrentUser> {
  return requestJson<CurrentUser>('/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

function signIn(credentials: LoginCredentials): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export { signIn, signUp };
