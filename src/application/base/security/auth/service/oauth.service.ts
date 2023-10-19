import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { DisabledUserException } from 'src/infrastructure/exceptions/disabled-user.exception';
import { InvalidPhoneTokenException } from 'src/infrastructure/exceptions/invalid-phone-token.exception';
import {
  encryptPassword,
  generatePassword,
} from 'src/infrastructure/helpers/helpers';
import { RoleMappingTableService } from 'src/application/base/crud/role-mapping-table/role-mapping-table.service';
import { RegisterByOauthDto } from '../dto/register-by-oauth.dto';
import { LoginService } from './login.service';
import { OauthResponseDto } from '../dto/oauth-response.dto';
import { VerifyOauthDto } from '../dto/verify-oauth.dto';
import { AccessTokenDto } from '../dto/access-token.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvalidEmailTokenException } from 'src/infrastructure/exceptions/invalid-email-token.exception';
import { OtpService } from '../../security-tools/otp.service';
import { isEmpty } from 'lodash';
import { CreateUserDto } from 'src/application/base/crud/user-table/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/infrastructure/database/entities/User';
import { stringify } from 'querystring';

@Injectable()
export class OauthService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly loginService: LoginService,
    private readonly otpService: OtpService,
    private readonly emailJwtService: JwtService,
  ) {}

  getGoogleConsentURL() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const redirectURI = process.env.GOOGLE_REDIRECT_URI;
    const scope = 'profile email';
    const state = '123'; // You can generate and manage this value

    return `https://accounts.google.com/o/oauth2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=code&state=${state}`;
  }

  getLinkedInUrl() {
    const clientID = process.env.LINKEDIN_CLIENT_ID;
    const redirectURI = process.env.LINKEDIN_REDIRECT_URI;
    const scope = 'r_liteprofile r_emailaddress';
    return `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=code`;
  }

  getGitHubUrl() {
    const clientID = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    // const redirectURI = process.env.LINKEDIN_REDIRECT_URI;
    // const scope = 'r_liteprofile r_emailaddress';
    // `https://github.com/login/oauth/authorize?client_id=${clientID}&client_secret=${clientSecret}`;

    return `https://github.com/login/oauth/authorize?client_id=${clientID}&client_secret=${clientSecret}`;
  }
  async googleOauth(code: string): Promise<OauthResponseDto> {
    let email: string;
    let error: Error;
    const verified = false;
    try {
      const postData = stringify({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        postData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const accessToken = response.data.access_token;
      console.log('Access token:', accessToken);

      // const httpsAgent = new https.Agent({
      //   rejectUnauthorized: false,
      // });
      //   console.log( `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`)
      //   const checkEmail = await axios.get(
      //     `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
      //     {
      //       httpsAgent,
      //     }
      //   );
      //   console.log('checkmail data', checkEmail.data);
      //   if (!checkEmail.data.verified_email) {
      //     error = new BadRequestException();
      //   }
      //   email = checkEmail.data.email;
      //   verified = true;
    } catch (err) {
      console.log(err.message);
      error = new BadRequestException('bad request', err);
    }
    return {
      error,
      verified,
      email,
    };
  }

  async githubOauth(code: string): Promise<OauthResponseDto> {
    let email: string;
    let error: Error;
    let firstname: string;
    let lastname: string;
    let verified = false;
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    try {
      const checkCode = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        },
        {
          httpsAgent,
          headers: {
            Accept: 'application/json',
          },
        },
      );
      if (checkCode.data.error) {
        error = new BadRequestException();
      }
      //console.log(checkCode.data);
      const accessToken = checkCode.data.access_token;

      const checkEmail = await axios.get(`https://api.github.com/user`, {
        httpsAgent,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(checkEmail.data);
      if (!checkEmail.data.email) {
        error = new BadRequestException();
        error.message = 'NO_EMAIL_REGISTERED';
      }
      email = checkEmail.data.email;
      verified = true;

      if (!isEmpty(checkEmail.data.name)) {
        const nameParts = checkEmail.data.name.split(' ');
        firstname = nameParts[0] || '';
        lastname = nameParts.slice(1).join(' ');
      }
    } catch (err) {
      console.log(err.message);
      error = new BadRequestException();
    }
    return {
      error,
      verified,
      email,
      firstname: firstname,
      lastname: lastname,
    };
  }

  async linkedinOauth(code: string): Promise<OauthResponseDto> {
    let userEmail: string;
    let error: Error;
    let verified = false;
    let firstName: string;
    let lastName: string;
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    try {
      const checkCode = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        null,
        {
          httpsAgent,
          headers: {
            Accept: 'application/json',
          },
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            code: code,
            redirect_uri: 'https://panel.aradcloud.ir/authentication/login',
          },
        },
      );
      console.log(checkCode.data);
      const accessToken = checkCode.data.access_token;
      const profileResponse = await axios.get(
        'https://api.linkedin.com/v2/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const userProfile = profileResponse.data;
      firstName = userProfile.localizedFirstName;
      lastName = userProfile.localizedLastName;

      const emailResponse = await axios.get(
        'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      userEmail = emailResponse.data.elements[0]['handle~'].emailAddress;
      if (!userEmail) {
        error = new BadRequestException();
        error.message = 'NO_EMAIL_REGISTERED';
      }
      verified = true;
    } catch (err) {
      console.log(err.message);
      error = new BadRequestException();
    }
    return {
      error,
      verified,
      email: userEmail,
      firstname: firstName,
      lastname: lastName,
    };
  }

  async verifyGoogleOauth(
    token: string,
  ): Promise<VerifyOauthDto | AccessTokenDto> {
    const check = await this.googleOauth(token);
    const { email, firstname, lastname, error } = check;

    console.log(email, '😉');
    if (error) {
      throw new UnauthorizedException();
    }
    const user = await this.userTable.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      const payload = {
        email,
        firstname,
        lastname,
      };
      const token = this.emailJwtService.sign(payload);
      return Promise.resolve({
        userExists: false,
        token: token,
      });
    }
    if (!user.active) {
      return Promise.reject(new DisabledUserException());
    }
    //const ttl = process.env.USER_OPTIONS_TTL;

    return this.loginService.getLoginToken(user.id);
  }

  async verifyLinkedinOauth(
    code: string,
  ): Promise<VerifyOauthDto | AccessTokenDto> {
    const check = await this.linkedinOauth(code);
    const { email, firstname, lastname, error } = check;
    if (error) {
      return Promise.reject(error);
    }
    const user = await this.userTable.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      const payload = {
        email,
        firstname,
        lastname,
      };

      const token = this.emailJwtService.sign(payload);
      return Promise.resolve({
        userExists: false,
        token: token,
      });
    }
    if (!user.active) {
      return Promise.reject(new DisabledUserException());
    }

    return this.loginService.getLoginToken(user.id);
  }

  async verifyGithubOauth(
    code: string,
  ): Promise<VerifyOauthDto | AccessTokenDto> {
    const check = await this.githubOauth(code);
    const { email, error } = check;
    if (error) {
      return Promise.reject(error);
    }
    const user = await this.userTable.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      const payload = {
        email,
      };
      const token = this.emailJwtService.sign(payload);
      return Promise.resolve({
        userExists: false,
        token: token,
      });
    }
    if (!user.active) {
      return Promise.reject(new DisabledUserException());
    }
    return this.loginService.getLoginToken(user.id);
  }

  decodeEmailToken(emailToken: string): {
    email: string;
    firstname: string;
    lastname: string;
    emailVerified: boolean;
  } {
    const encodedData = this.emailJwtService.decode(emailToken);
    const email = encodedData['email'] as string;
    const firstname = encodedData['firstname'] as string;
    const lastname = encodedData['lastname'] as string;
    const emailVerified = this.emailJwtService.verify(emailToken);
    return {
      email,
      firstname,
      lastname,
      emailVerified,
    };
  }

  async registerByOauth(
    options: SessionRequest,
    data: RegisterByOauthDto,
  ): Promise<AccessTokenDto> {
    const phoneNumber = data.phoneNumber;
    const phoneHash = data.otpHash;
    const otpCode = data.otpCode;
    const phoneVerified = this.otpService.otpVerifier(
      phoneNumber,
      otpCode,
      phoneHash,
    );

    if (!phoneVerified) {
      return Promise.reject(new InvalidPhoneTokenException());
    }
    const user = await this.userTable.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });
    if (!data.emailToken) {
      return Promise.reject(new BadRequestException('no email token'));
    }

    const { email, firstname, lastname, emailVerified } = this.decodeEmailToken(
      data.emailToken,
    );

    if (!emailVerified) {
      throw new InvalidEmailTokenException();
    }

    const findEmail = await this.userTable.findOne({
      where: {
        email,
      },
    });

    // email already in use
    if (findEmail) {
      return Promise.reject(new BadRequestException('email already in use'));
    }

    if (user) {
      await this.userTable.updateAll(
        {
          id: user.id,
        },
        {
          email,
          name: firstname,
          family: lastname,
          phoneNumber: phoneNumber,
        },
      );
      if (!user.active) {
        return Promise.reject(new ForbiddenException());
      }

      return this.loginService.getLoginToken(user.id);
    }

    const newUser: CreateUserDto = new User();
    newUser.username = `U-${phoneNumber}`;
    const password = data.password
      ? encryptPassword(data.password)
      : generatePassword();
    newUser.password = await encryptPassword(data.password);
    newUser.vdcPassword = data.password;
    newUser.name = firstname || 'کاربر';
    newUser.family = lastname || 'گرامی';
    newUser.phoneNumber = phoneNumber;
    newUser.email = email;
    newUser.active = data.active;
    newUser.phoneVerified = true;
    newUser.acceptTermsOfService = data.acceptTermsOfService;
    newUser.code = null;
    newUser.realm = null;
    newUser.hasVdc = null;
    newUser.emailToken = null;
    newUser.credit = 0;
    newUser.emailVerified = false;
    newUser.deleted = false;

    const createdUser = await this.userTable.create(newUser);

    if (!createdUser.active) {
      return Promise.reject(new ForbiddenException());
    }
    return this.loginService.getLoginToken(createdUser.id);
  }
}
