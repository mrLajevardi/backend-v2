import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    console.log("validating google ")
    // Validate and process the user profile data
    // This function is called after the user authorizes the app
    // You can extract relevant information from the 'profile' parameter
    // and return the user data or fetch additional information from your database
    console.log(profile);
    return profile;
  }
}
