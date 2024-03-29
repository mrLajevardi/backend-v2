import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ImpersonateAs } from '../dto/impersonate-as.interface';
import { UserPayload } from '../dto/user-payload.dto';
import { ClsService } from 'nestjs-cls';
import * as Sentry from '@sentry/node';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly cls: ClsService) {
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

    this.cls.set('userId', payload.userId.toString());

    const originalData = {
      userId: payload.userId.toString(),
      guid: payload.guid,
      username: payload.username,
      personalVerification: payload.personalVerification,
    };
    const impersonateAs = payload['impersonateAs'] as ImpersonateAs;
    if (impersonateAs) {
      retVal = {
        userId: impersonateAs.userId,
        username: impersonateAs.username,
        guid: impersonateAs.guid,
        personalVerification: impersonateAs.personalVerification,
        originalUser: originalData,
      };
    } else {
      retVal = originalData;
    }
    return retVal;
  }
}
