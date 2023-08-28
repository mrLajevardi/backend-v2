import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { isEmpty } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from '../service/login.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userTable : UserTableService,
    private readonly loginService: LoginService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    // You can access the user's Google profile information here
    // Call done() with the user or false if authentication fails
    const email = profile.emails[0].value; 
    const user = await this.userTable.findOne({
      where: {
        email: email,
      },
    });

    let firstname : string = profile.name.givenName;
    let lastname : string = profile.name.familyName; 
    if (!isEmpty(profile.displayName)) {
      const nameParts = profile.displayName.split(" ");
      firstname = nameParts[0] || "";
      lastname = nameParts.slice(1).join(" ");
    }

    if (!user) {
      const payload = {
        email,
        firstname,
        lastname,
      };

      const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
      const token = jwtService.sign(payload);
      done(null,{
        userExists: false,
        token: token,
      });
    }
    const loginToken =  this.loginService.getLoginToken(user.id);
    done(null, loginToken);
  }
}
