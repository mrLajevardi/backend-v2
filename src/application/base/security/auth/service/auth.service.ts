import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../../../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserTableService } from "../../../crud/user-table/user-table.service";
import { InvalidPhoneNumberException } from "src/infrastructure/exceptions/invalid-phone-number.exception";
import { ForbiddenException } from "src/infrastructure/exceptions/forbidden.exception";
import { SmsService } from "src/application/base/notification/sms.service";
import { OtpService } from "./otp.service";

@Injectable()
export class AuthService {
  constructor(
    private userTable: UserTableService,
    private userService: UserService,
    private jwtService: JwtService,
    private smsService: SmsService,
    private otpService: OtpService
  ) {}

  // Validate user performs using Local.strategy
  async validateUser(username: string, pass: string): Promise<any> {
    console.log("validate user");
    if (!username) {
      throw new UnauthorizedException("No username provided");
    }

    if (!pass) {
      throw new UnauthorizedException("No password provided");
    }

    const user = await this.userTable.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException("Wrong username or password");
    }

    // checking the availablity of the user and
    const isValid = await this.userService.comparePassword(user.password, pass);
    if (user && isValid) {
      // eslint-disable-next-line
      const { password, ...result } = user;

      //console.log(result);
      return result;
    }
    return null;
  }

  // This function will be called in AuthController.login after
  // the success of local strategy
  // it will return the JWT token
  async login(user: any) {
    // console.log("auth service login", dto)
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async checkPhoneNumber(options, data) {
    let check;
    const user = await this.userTable.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });
    if (!data.phoneNumber) {
      return Promise.reject(new InvalidPhoneNumberException());
    }
    const phoneRegex = new RegExp("^(\\+98|0)?9\\d{9}$");
    if (!phoneRegex.test(data.phoneNumber)) {
      return Promise.reject(new InvalidPhoneNumberException());
    }
    let hash = null;
    const userExist = user ? true : false;
    if (data.loginByOtp) {
      if (!userExist) {
        return Promise.reject(new ForbiddenException());
      }
      const otpGenerated = this.otpService.otpGenerator(data.phoneNumber);
      await this.smsService.sendSMS(data.phoneNumber, otpGenerated.otp);
      hash = otpGenerated.hash;
      return Promise.resolve({ userExist, hash });
    }
    if (data.isOauth || !userExist) {
      const smsService = new SmsService();
      const otpGenerated = this.otpService.otpGenerator(data.phoneNumber);
      await smsService.sendSMS(data.phoneNumber, otpGenerated.otp);
      hash = otpGenerated.hash;
    }
    return Promise.resolve({ userExist, hash });
  }

  checkToken(options) {
    return Promise.resolve(true);
  };

  



  


}
