import { Injectable, Logger } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { OauthService } from '../service/oauth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, "linkedIn") {
  constructor(
    private readonly oauthService: OauthService,
  ) {
    super();
  }

  // The validation that will be checked before
  // any endpoint protected with jwt-auth guard
  async authenticate(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, options?: any): Promise<void> {
    try {
      if (!req || !req.body) {
        this.error(new ForbiddenException());
      }

      if (!req.body.code) {
        this.error(new ForbiddenException("no code provided"));
      }

      this.success(this.oauthService.verifyLinkedinOauth(req.body.code));
    } catch (error) {
      this.error(error);
    }
  }
}

