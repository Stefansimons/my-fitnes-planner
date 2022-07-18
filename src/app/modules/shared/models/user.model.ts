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
  updatedAt: Date;
  role?: ROLE;
  isActive: boolean;
}
export interface IToken {
  accessToken: string;
  tokenExpirationDate: Date;
  refreshToken: string;
}
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}
export enum ROLE {
  Bodybuilder = 'BODYBUILDER',
  Admin = 'ADMIN',
}
export interface IAuthUserData {
  id: string;
  token: IToken;
}
