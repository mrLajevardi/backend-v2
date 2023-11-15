import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ImpersonateAs } from '../dto/impersonate-as.interface';
import { UserPayload } from '../dto/user-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // The validation that will be take place before any
  // endpoint protected using Jwt-auth.guard
  async validate(payload: UserPayload): Promise<UserPayload> {
    console.log(payload);
    if (payload.isRobot) {
      throw new UnauthorizedException('Access denied for robots');
    }

    if (!payload.userId) {
      throw new ForbiddenException('error in jwt');
    }
    let retVal = {};

    const originalData = {
      userId: payload.userId.toString(),
      username: payload.username,
      personalVerification: payload.personalVerification,
    };
    const impersonateAs = payload['impersonateAs'] as ImpersonateAs;
    if (impersonateAs) {
      retVal = {
        userId: impersonateAs.userId,
        username: impersonateAs.username,
        originalUser: originalData,
      };
    } else {
      retVal = originalData;
    }
    return retVal;
  }
}
