import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ImpersonateAs } from '../dto/impersonate-as.interface';

@Injectable()
export class RobotStrategy extends PassportStrategy(Strategy, 'robot') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // The validation that will be take place before any
  // endpoint protected using Jwt-auth.guard
  async validate(payload: any) {
    console.log(payload);
    if (payload.ispublic) {
      throw new UnauthorizedException('No public access permited');
    }

    if (!payload.isRobot) {
      throw new UnauthorizedException('Only robots can access this endpoint');
    }

    if (!payload.sub) {
      throw new ForbiddenException('error in jwt');
    }

    return payload;
  }
}
