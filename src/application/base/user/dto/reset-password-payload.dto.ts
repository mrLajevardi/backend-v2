import { JwtPayload } from 'jsonwebtoken';

export class ResetPasswordPayloadDto implements JwtPayload {
  id: number;
  sub: string;
}
