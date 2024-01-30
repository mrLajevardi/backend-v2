import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LoginService } from './login.service';
import { OauthService } from './oauth.service';

@Injectable()
export class AuthService {
  constructor(
    public readonly oath: OauthService,
    @Inject(forwardRef(() => LoginService))
    public readonly login: LoginService,
  ) {}
}
