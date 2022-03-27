import { Training } from '../../training/models/training.model';
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  code: string;
  trainings: Training[];
  token?: IToken;
}
export interface IToken {
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
}
