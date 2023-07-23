import { Injectable, Logger } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { OauthService } from '../service/oauth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly oauthService: OauthService,
  ) {
    super();
  }

  // The validation that will be checked before
  // any endpoint protected with jwt-auth guard
  async authenticate(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, options?: any): Promise<void> {
    console.log("im in google auth");
    try {
      if (!req || !req.body) {
        this.error(new ForbiddenException());
      }

      if (!req.body.token) {
        this.error(new ForbiddenException("no token provided"));
      }

      this.success(this.oauthService.verifyGoogleOauth(req.body.token));
    } catch (error) {
      console.log("found error")
      this.error(error);
    }
  }
}
