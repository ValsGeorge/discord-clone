import { User } from './users.interface';
import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
    user: User;
}
