import { User } from '../types';

export type AuthState = {
  accessToken: { token: string; user: User };
};
