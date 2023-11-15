import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { SessionRequest } from '../types/session-request.type';

@Injectable()
export class CheckUserProfileMiddleware implements NestMiddleware {
  use(req: SessionRequest, res: Response, next: NextFunction) {
    if (req.hasOwnProperty('user')) {
      console.log("it's user: \n", req.user);
    }
    console.log('Request...');
    next();
  }
}
