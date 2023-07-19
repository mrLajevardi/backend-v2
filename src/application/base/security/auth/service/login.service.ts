import { Injectable, UnauthorizedException } from "@nestjs/common";
import { DisabledUserException } from "src/infrastructure/exceptions/disabled-user.exception";
import { ForbiddenException } from "src/infrastructure/exceptions/forbidden.exception";
import { InvalidEmailTokenException } from "src/infrastructure/exceptions/invalid-email-token.exception";
import { InvalidPhoneNumberException } from "src/infrastructure/exceptions/invalid-phone-number.exception";
import { InvalidPhoneTokenException } from "src/infrastructure/exceptions/invalid-phone-token.exception";
import jwt from "jsonwebtoken";
import { UserTableService } from "src/application/base/crud/user-table/user-table.service";
import * as util from 'util';
import { OtpService } from "./otp.service";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { OauthService } from "./oauth.service";

@Injectable()
export class LoginService {
  constructor(
    private readonly userTable : UserTableService,
    private readonly otpService : OtpService,
    private readonly logger: LoggerService,
    private readonly oauthService: OauthService,
  ) {}

//   async loginAsUser(options, data) {
//     const user = await this.userTable.findById(data.userId);
//     if (!user) {
//       return Promise.reject(new ForbiddenException());
//     }
//     const ttl = process.env.USER_OPTIONS_TTL;
//     //const ttl = modelConfig.Users.options.ttl;
//     const accessToken = await AccessToken.create({ ttl, userId: user.id });
//     return Promise.resolve(accessToken);
//   }

//   async loginByOtp(options, data) {
//     const phoneRegex = new RegExp("^(\\+98|0)?9\\d{9}$");
//     const phone = data.phoneNumber;
//     const user = await this.userTable.findOne({
//       where: {
//         phoneNumber: data.phoneNumber,
//       },
//     });
//     if (
//       !data.phoneNumber ||
//       !phoneRegex.test(phone) ||
//       !data.otp ||
//       !data.hash ||
//       !user
//     ) {
//       return Promise.reject(new ForbiddenException());
//     }
//     const codeVerified = this.otpService.otpVerifier(data.phoneNumber, data.otp, data.hash);
//     if (!codeVerified) {
//       return Promise.reject(new ForbiddenException());
//     }
//     const ttl = process.env.USER_OPTIONS_TTL;
//     const accessToken = await AccessToken.create({ ttl, userId: user.id });
//     return Promise.resolve(accessToken);
//   }

//   async beforeLogin(Users, ctx, output, next) {
//     const data = ctx.args.credentials;
//     // TODO: for admin
//     if (
//       data.email != "admin1@aradpanel.com" &&
//       data.email != "admin2@aradpanel.com"
//     ) {
//       if (!data.phoneNumber) {
//         return Promise.reject(new InvalidPhoneNumberException());
//       }
//       const phoneRegex = new RegExp("^(\\+98|0)?9\\d{9}$");
//       if (!phoneRegex.test(data.phoneNumber)) {
//         return Promise.reject(new InvalidPhoneNumberException());
//       }
//       if (data.phoneNumber) {
//         const phone = data.phoneNumber;
//         ctx.args.credentials.username = `U-${phone}`;
//         const userExists = await Users.findOne({
//           where: { phone },
//         });
//         if (userExists) {
//           const user = await Users.findOne({
//             where: {
//               and: [
//                 { username: `U-${data.phoneNumber}` },
//                 // {phoneVerified: true},
//               ],
//             },
//           });
//           if (!user) {
//             const err = new InvalidPhoneNumberException();
//             return Promise.reject(err);
//           }
//           if (!user.active) {
//             return Promise.reject(new DisabledUserException());
//           }
//           if (user.deleted) {
//             return Promise.reject(new UnauthorizedException());
//           }
//         }
//       }
//     }
//   }

//   async afterLogout(ctx, output, next) {
//     const user = await this.userTable.findOne({
//       where: {
//         id: ctx.res.locals.userId,
//       },
//     });
//     await this.logger.info(
//       "user",
//       "logout",
//       {
//         username: user.username,
//         _object: user.id,
//       },
//       {
//         ...ctx.res.locals,
//       }
//     );
//     return;
//   }

//   async verifyEmail(Users, token, options) {
//     const verifyToken = util.promisify(jwt.verify);
//     let parsedToken = null;
//     try {
//       parsedToken = await verifyToken(token, jwtSecret, {
//         subject: "emailVerification",
//       });
//     } catch (err) {
//       console.log(err);
//       return Promise.reject(new InvalidEmailTokenException());
//     }
//     const user = await Users.findById(parsedToken.id);
//     await Users.updateAll({ id: parsedToken.id }, { emailVerified: true });
//     await this.logger.info(
//       "user",
//       "verifyEmail",
//       {
//         username: user.username,
//         _object: user.id,
//       },
//       { ...options.locals }
//     );
//   }

//   async verifyGithubOauth(options, data) {
//     const check = await new OauthService().githubOauth(data.code);
//     const { email, verified, error } = check;
//     if (error) {
//       return Promise.reject(error);
//     }
//     const user = await this.userTable.findOne({
//       where: {
//         and: [{ email }],
//       },
//     });
//     if (!user) {
//       const payload = {
//         email,
//       };
//       const token = jwt.sign(payload, JWT_SECRET_KEY, {
//         expiresIn: 60 * 2, // 2 min
//       });
//       return Promise.resolve({
//         userExists: false,
//         emailToken: token,
//       });
//     }
//     if (!user.active) {
//       return Promise.reject(new DisabledUserException());
//     }
//     const ttl = process.env.USER_OPTIONS_TTL;
//     const accessToken = await AccessToken.create({ ttl, userId: user.id });
//     return accessToken;
//   }

//   async verifyGoogleOauth(options, data) {
//     const check = await new OauthService().googleOauth(data.token);
//     const { email, verified, error } = check;
//     console.log(email, "😉");
//     if (error) {
//       return Promise.reject(error);
//     }
//     const user = await this.userTable.findOne({
//       where: {
//         and: [{ email }],
//       },
//     });
//     if (!user) {
//       const payload = {
//         email,
//       };
//       const token = jwt.sign(payload, JWT_SECRET_KEY, {
//         expiresIn: 60 * 2, // 2 min
//       });
//       return Promise.resolve({
//         userExists: false,
//         emailToken: token,
//       });
//     }
//     if (!user.active) {
//       return Promise.reject(new DisabledUserException());
//     }
//     const ttl = process.env.USER_OPTIONS_TTL;
//     const accessToken = await AccessToken.create({ ttl, userId: user.id });
//     return accessToken;
//   }

//   async verifyLinkedinOauth(options, data) {
//     const check = await new OauthService().linkedinOauth(data.code);
//     const { email, verified, error } = check;
//     if (error) {
//       return Promise.reject(error);
//     }
//     const user = await this.userTable.findOne({
//       where: {
//         and: [{ email }],
//       },
//     });
//     if (!user) {
//       const payload = {
//         email,
//       };
//       const token = jwt.sign(payload, JWT_SECRET_KEY, {
//         expiresIn: 60 * 2, // 2 min
//       });
//       return Promise.resolve({
//         userExists: false,
//         emailToken: token,
//       });
//     }
//     if (!user.active) {
//       return Promise.reject(new DisabledUserException());
//     }
//     const ttl = process.env.USER_OPTIONS_TTL;
//     const accessToken = await AccessToken.create({ ttl, userId: user.id });
//     return accessToken;
//   }

//   async verifyOTP(options, data) {
//     const phoneRegex = new RegExp("^(\\+98|0)?9\\d{9}$");
//     const phone = data.phoneNumber;
//     if (!phoneRegex.test(phone)) {
//       return Promise.reject(new InvalidPhoneNumberException());
//     }
//     if (!data.otp || !data.hash) {
//       return Promise.reject(new InvalidPhoneTokenException());
//     }

//     const codeVerified = otpVerifier(data.phoneNumber, data.otp, data.hash);
//     let phoneJWT = null;
//     if (codeVerified) {
//       phoneJWT = jwt.sign(data.phoneNumber, otpConfig.secretKey);
//     }

//     return Promise.resolve({ codeVerified, phoneJWT });
//   }
}
