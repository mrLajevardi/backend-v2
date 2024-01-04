import { Request } from 'express';
import { UserPayload } from 'src/application/base/security/auth/dto/user-payload.dto';

export type SessionRequest = Request & { user: UserPayload };
