import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ImpersonateAs } from '../dto/impersonate-as.interface';

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
  async validate(payload: any) {
    if (!payload.sub){
      throw new ForbiddenException('error in jwt')
    }
    let retVal = {};
    let originalData =  { userId: payload.sub.toString(), username: payload.username };
    const impersonateAs = payload['impersonateAs'] as ImpersonateAs;
    if (impersonateAs){
      retVal = { 
        userId: impersonateAs.userId , 
        username: impersonateAs.username , 
        originalUser: originalData
      }
    }else{
      retVal = originalData;
    }
    return retVal;
  }
}
