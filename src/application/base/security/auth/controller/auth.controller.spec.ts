import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../service/auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../../../user/service/user.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "src/infrastructure/database/database.module";
import { TestDataService } from "src/infrastructure/database/test-data.service";
import { UserTableService } from "../../../crud/user-table/user-table.service";
import { PassportModule } from "@nestjs/passport";
import { CrudModule } from "src/application/base/crud/crud.module";
import { UserTableModule } from "src/application/base/crud/user-table/user-table.module";
import { NotificationModule } from "src/application/base/notification/notification.module";
import { UserModule } from "src/application/base/user/user.module";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { SecurityToolsModule } from "../../security-tools/security-tools.module";
import { OauthService } from "../service/oauth.service";
import { OtpService } from "../../security-tools/otp.service";
import { LoginService } from "../service/login.service";
import { PaymentModule } from "src/application/payment/payment.module";
import { RegisterByOauthDto } from "../dto/register-by-oauth.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;
  let testDataService: TestDataService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        PassportModule,
        CrudModule,
        UserTableModule,
        UserModule,
        NotificationModule,
        PaymentModule,
        LoggerModule,
        SecurityToolsModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: "1800s" },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        UserTableService,
        OauthService,
        OtpService,
        LoginService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    testDataService = module.get<TestDataService>(TestDataService);

    await testDataService.seedTestData();
  });

  afterAll(async () => {
    await module.close();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("googleLogin", () => {
    it("should return user payload from request", async () => {
      const userPayload = { googleId: "123", email: "test@example.com" };
      const req = { user: userPayload } as any;

      const result = await controller.googleLogin(req);

      expect(result).toEqual(userPayload);
    });
  });

  describe("getGoogleUrl", () => {
    it("should return the Google consent URL", () => {
      const clientID = process.env.GOOGLE_CLIENT_ID;
      const redirectURI = process.env.GOOGLE_REDIRECT_URI;
      const scope = "profile email";
      const state = "123"; // You can generate and manage this value

      const consentUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=code&state=${state}`;
      const result = controller.getGoogleUrl();
      expect(result).toEqual({ consentUrl });
    });
  });

  describe("register by oauth for google ", () => {
    beforeAll(async () => {

    });

    it("", async () => {
      //given
      service.oath.decodeEmailToken = jest.fn().mockReturnValue({
        email: "ziaee.majid2@gmail.com",
        firstname: "majid",
        lastname: "ziaei",
        emailVerified: true,
      });

      console.log(service.oath.decodeEmailToken(null));

      const phoneNumber = "07921121213";
      const { otp, hash } = await service.login.generateOtp(phoneNumber, false);
      let dto: RegisterByOauthDto = new RegisterByOauthDto();
      dto.acceptTermsOfService = true;
      dto.active = true;
      dto.otpHash = hash;
      dto.otpCode = otp;
      dto.password = "abcd1234";
      dto.phoneNumber = phoneNumber;
      dto.emailToken = 'test';
      
      //when

      await controller.registerByOauth(dto, null);


      //then

    });
  });
});
