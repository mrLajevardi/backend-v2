import { Request } from 'express';

export interface ExtendedOptionsDto extends Request {
  user: OptionsUserInterface;
}

export interface OptionsUserInterface {
  userId: number;
}
