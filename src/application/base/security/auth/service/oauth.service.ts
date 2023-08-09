import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import jwt from 'jsonwebtoken';
import { DisabledUserException } from 'src/infrastructure/exceptions/disabled-user.exception';
import { InvalidPhoneTokenException } from 'src/infrastructure/exceptions/invalid-phone-token.exception';
import { generatePassword } from 'src/infrastructure/helpers/helpers';
import { RoleMappingTableService } from 'src/application/base/crud/role-mapping-table/role-mapping-table.service';
import { RegisterByOauthDto } from '../dto/register-by-oauth.dto';
import { LoginService } from './login.service';
import { OauthResponseDto } from '../dto/oauth-response.dto';
import { VerifyOauthDto } from '../dto/verify-oauth.dto';
import { AccessTokenDto } from '../dto/access-token.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvalidEmailTokenException } from 'src/infrastructure/exceptions/invalid-email-token.exception';
import { DecodedPhone } from '../dto/decoded-phone.dto';

@Injectable()
export class OauthService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly roleMappingTable: RoleMappingTableService,
    private readonly loginService: LoginService,
  ) {}

  async googleOauth(token: string): Promise<OauthResponseDto> {
    let email;
    let error;
    let verified = false;
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    try {
      const checkEmail = await axios.post(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
        {
          httpsAgent,
        },
      );
      if (!checkEmail.data.verified_email) {
        error = new BadRequestException();
      }
      email = checkEmail.data.email;
      verified = true;
    } catch (err) {
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
      const accessToken = checkCode.data.access_token;
      const checkEmail = await axios.get(`https://api.github.com/user`, {
        httpsAgent,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!checkEmail.data.email) {
        error = new BadRequestException();
        error.message = 'NO_EMAIL_REGISTERED';
      }
      email = checkEmail.data.email;
      verified = true;
    } catch (err) {
      console.log(err);
      error = new BadRequestException();
    }
    return {
      error,
      verified,
      email,
    };
  }

  async linkedinOauth(code: string): Promise<OauthResponseDto> {
    let email: string;
    let error: Error;
    let verified = false;
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
            client_id: '861dzg8q5lonwt',
            client_secret: 'SQbP2qqMyGbNQVJL',
            code: code,
            redirect_uri: 'https://panel.aradcloud.ir/authentication/login',
          },
        },
      );
      const accessToken = checkCode.data.access_token;
      const checkEmail = await axios.get(
        `https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))`,
        {
          httpsAgent,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(checkEmail.data);

      if (!(checkEmail.data?.elements.length === 0)) {
        error = new BadRequestException();
        error.message = 'NO_EMAIL_REGISTERED';
      }

      const primaryEmail = checkEmail.data?.elements.filter(
        (elem) => elem.primary,
      );
      email = primaryEmail['handle~']?.emailAddress;
      verified = true;
    } catch (err) {
      console.log(err);
      error = new BadRequestException();
    }
    return {
      error,
      verified,
      email,
    };
  }

  async verifyGoogleOauth(
    token: string,
  ): Promise<VerifyOauthDto | AccessTokenDto> {
    const check = await this.googleOauth(token);
    const email = check.email;
    const error = check.error;
    console.log(email, '😉');
    if (error) {
      throw new UnauthorizedException();
    }
    const user = await this.userTable.findOne({
      where: {
        and: [{ email }],
      },
    });
    if (!user) {
      const payload = {
        email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 2, // 2 min
      });
      return Promise.resolve({
        userExists: false,
        emailToken: token,
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
    const { email, error } = check;
    if (error) {
      return Promise.reject(error);
    }
    const user = await this.userTable.findOne({
      where: {
        and: [{ email }],
      },
    });
    if (!user) {
      const payload = {
        email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 2, // 2 min
      });
      return Promise.resolve({
        userExists: false,
        emailToken: token,
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
        and: [{ email }],
      },
    });
    if (!user) {
      const payload = {
        email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 2, // 2 min
      });
      return Promise.resolve({
        userExists: false,
        emailToken: token,
      });
    }
    if (!user.active) {
      return Promise.reject(new DisabledUserException());
    }
    return this.loginService.getLoginToken(user.id);
  }

  async registerByOauth(
    options: SessionRequest,
    data: RegisterByOauthDto,
  ): Promise<AccessTokenDto> {
    const decodedPhone: DecodedPhone = jwt.decode(data.pjwt) as DecodedPhone;

    const pjwtVerified = jwt.verify(data.pjwt, process.env.OTP_SECRET_KEY);
    if (!pjwtVerified) {
      return Promise.reject(new InvalidPhoneTokenException());
    }
    const user = await this.userTable.findOne({
      where: {
        phoneNumber: decodedPhone.phoneNumber,
      },
    });
    if (!data.emailToken) {
      return Promise.reject(new BadRequestException());
    }
    const encodedData = jwt.decode(data.emailToken);
    const email = encodedData['email'];
    try {
      const emailVerified = jwt.verify(
        data.emailToken,
        process.env.JWT_SECRET_KEY,
      );

      if (!emailVerified) {
        throw new InvalidEmailTokenException();
      }
    } catch (err) {
      return Promise.reject(new BadRequestException());
    }
    const findEmail = await this.userTable.findOne({
      where: {
        email,
      },
    });
    // email already in use
    if (findEmail) {
      return Promise.reject(new BadRequestException());
    }
    if (user) {
      await this.userTable.updateAll(
        {
          id: user.id,
        },
        {
          email,
        },
      );
      if (!user.active) {
        return Promise.reject(new ForbiddenException());
      }

      return this.loginService.getLoginToken(user.id);
    }

    data.username = `U-${decodedPhone.phoneNumber}`;
    const password = generatePassword();
    console.log(generatePassword());
    data.password = password;
    data.vdcPassword = generatePassword();
    data.name = 'کاربر';
    data.family = 'گرامی';
    data.phoneNumber = decodedPhone.phoneNumber;
    data.active = true;
    data.phoneVerified = true;
    const filteredContext = {
      ...data,
      code: null,
      realm: null,
      hasVdc: false,
      emailToken: null,
      credit: 0,
      emailVerified: false,
      deleted: false,
      email: null,
      phoneVerified: false,
    };
    filteredContext.email = email;
    if (Object.keys(data).includes('id')) {
      delete data.id;
    }
    const createdUser = await this.userTable.create(filteredContext);
    await this.roleMappingTable.create({
      principalType: 'USER',
      principalId: createdUser.id.toString(),
      roleId: 'user',
    });
    if (!createdUser.active) {
      return Promise.reject(new ForbiddenException());
    }
    return this.loginService.getLoginToken(createdUser.id);
  }
}
