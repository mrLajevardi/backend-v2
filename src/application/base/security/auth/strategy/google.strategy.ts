import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
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
    console.log('validating');
    console.log(profile);
    const user = {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      // ...other fields you might need
    };
    done(null, user);
  }
}
