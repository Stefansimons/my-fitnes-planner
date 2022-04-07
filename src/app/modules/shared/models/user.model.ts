import { Training } from '../../training/models/training.model';
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  code: string;
  trainings: Training[];
  token?: IToken;
  updatedAt: number;
  role?: ROLE;
}
export interface IToken {
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
}
export enum ROLE {
  Bodybuilder = 'BODYBUILDER',
  Admin = 'ADMIN',
}
