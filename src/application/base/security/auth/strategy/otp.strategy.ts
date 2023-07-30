import { Injectable, Logger } from "@nestjs/common";
import { ForbiddenException } from "src/infrastructure/exceptions/forbidden.exception";
import { UserTableService } from "src/application/base/crud/user-table/user-table.service";
import { InvalidPhoneNumberException } from "src/infrastructure/exceptions/invalid-phone-number.exception";
import { NotificationService } from "src/application/base/notification/notification.service";
import { OtpService } from "../../security-tools/otp.service";
import { AuthService } from "../service/auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-strategy";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { UserService } from "src/application/base/user/service/user.service";
import { OtpErrorException } from "src/infrastructure/exceptions/otp-error-exception";
import { InvalidTokenException } from "src/infrastructure/exceptions/invalid-token.exception";

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, "otp") {
  constructor(
    private readonly authService: AuthService,
    private readonly userTable: UserTableService,
    private readonly otpService: OtpService,
    private readonly userService: UserService
  ) {
    super();
  }

  async authenticate(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    options?: any
  ): Promise<void> {
    try {
      if (!req || !req.body) {
        this.error(new ForbiddenException());
        return;
      }

      console.log("otp validator");
      if (!req.body.phoneNumber) {
        this.error(new InvalidPhoneNumberException());
        return;
      }

      const phoneNumber = req.body.phoneNumber;
      let user = await this.userTable.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      const userExist = user ? true : false;

      if (!userExist) {
        if (!req.body.addUser || (req.body.addUser == false )){
          this.success({ userExist: userExist });
        }else{
          const otp = req.body.otp;
          const hash = req.body.hash;
          const verify = this.otpService.otpVerifier(phoneNumber,otp,hash);
          if (!verify){
            this.error(new InvalidTokenException());
          }
          if (req.body.password){
              user = await this.userService.createUserByPhoneNumber(phoneNumber, req.body.password);
              const token = this.authService.login.getLoginToken(user.id);
              this.success(token);
              return;
          }else{
              this.success({userExist: userExist, otpVerify: verify, hash: hash});
              return;
          }
        }
        return;
      } else {
        if (!req.body.hash || !req.body.otp) {
          let hash = await this.authService.login.generateOtp(phoneNumber);
          if (!hash) {
            this.error(new OtpErrorException());
          }
          this.success({ userExist: userExist, hash: hash });
        } else {
          if (!req.body.hash) {
            this.error(new ForbiddenException("no hash provided"));
            const otp = req.body.otp;
            const hash = req.body.hash;
            const token = this.authService.login.getLoginToken(user.id);
            this.success(token);
            return;
          }
        }
      }
    }catch(error){
      console.log(error);
      console.log("error in otp strategy");
    }
  }
}
