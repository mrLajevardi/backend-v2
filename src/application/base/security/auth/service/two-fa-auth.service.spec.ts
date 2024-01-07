import { TwoFaAuthService } from './two-fa-auth.service';
import { TwoFaAuthStrategy } from '../classes/two-fa-auth.strategy';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { UserPayload } from '../dto/user-payload.dto';
import { TwoFaAuthInterface } from '../classes/interface/two-fa-auth.interface';
import { SendOtpTwoFactorAuthDto } from '../dto/send-otp-two-factor-auth.dto';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';
import { TestBed } from '@automock/jest';

describe('TwoFaAuthService', () => {
  let service: TwoFaAuthService;
  const mockTwoFaAuthStrategy = {
    setStrategy: jest.fn((strategy: TwoFaAuthInterface) => {
      console.log(strategy);
    }),
    sendOtp: jest.fn(
      async (user: UserPayload): Promise<SendOtpTwoFactorAuthDto> => {
        return {
          hash: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        } as SendOtpTwoFactorAuthDto;
      },
    ),
    verifyOtp: jest.fn(
      async (
        user: UserPayload,
        otp: string,
        hash: string,
      ): Promise<boolean> => {
        return Promise.resolve(true);
      },
    ),
  };
  const mockUserTableService = {
    update: jest.fn((userId: number, dto: any): Promise<any> => {
      return Promise.resolve({});
    }),
    findById: jest.fn((userId: number) => {
      if (userId == 1060) {
        return {
          id: userId,
          twoFactorAuth: '1',
        };
      } else {
        return {
          id: userId,
          twoFactorAuth: '0',
        };
      }
    }),
  };
  beforeEach(async () => {
    const { unit } = TestBed.create(TwoFaAuthService)
      .mock(TwoFaAuthStrategy)
      .using(mockTwoFaAuthStrategy)
      .mock(UserTableService)
      .using(mockUserTableService)
      .compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enable two factor authenticate', () => {
    it('should be return true if valid data enable ', async () => {
      const user: UserPayload = {
        userId: 1060,
        personalVerification: true,
      };
      /*
       *** type can be sms or email
       */
      const type = TwoFaAuthTypeEnum.Sms;
      const data = await service.enable(user, type);

      expect(data).not.toBeNull();
      expect(data).toEqual({
        hash: expect.any(String),
      });
    });
    it('should be return true if valid data enableVerification', async () => {
      const user: UserPayload = {
        userId: 1060,
        personalVerification: true,
      };
      /*
       *** type can be sms or email
       */

      const type = TwoFaAuthTypeEnum.Sms;
      const data = await service.enableVerification(
        user,
        type,
        '123456',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      );

      expect(data).not.toBeNull();
      expect(data).toBeTruthy();
    });
  });
});
