import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { OauthService } from '../service/oauth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly oauthService: OauthService) {
    super();
  }

  // The validation that will be checked before
  // any endpoint protected with jwt-auth guard
  async authenticate(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ): Promise<void> {
    try {
      if (!req || !req.query) {
        this.error(new ForbiddenException());
      }

      if (!req.query.code) {
        this.error(new ForbiddenException('Github: no code provided'));
      }

      this.success(
        this.oauthService.verifyGithubOauth(req.query.code.toString()),
      );
    } catch (error) {
      this.error(error);
    }
  }
}
