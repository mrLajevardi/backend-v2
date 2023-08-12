import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { UserPayload } from '../dto/user-payload.dto';

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
  async validate(payload: UserPayload): Promise<UserPayload> {
    console.log(payload);
    if (payload.isPublic) {
      throw new UnauthorizedException('No public access permited');
    }

    if (!payload.isRobot) {
      throw new UnauthorizedException('Only robots can access this endpoint');
    }

    if (!payload.robotToken) {
      throw new ForbiddenException('error in jwt');
    }

    return payload;
  }
}
