// authenticated-request.ts
import { Request } from 'express';
import { IauthenticatedUser } from './user.interface';

export interface AuthenticatedRequest extends Request {
  user: IauthenticatedUser;
}
