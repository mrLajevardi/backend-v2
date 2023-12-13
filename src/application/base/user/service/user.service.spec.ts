import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { encryptPassword } from 'src/infrastructure/helpers/helpers';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from 'src/application/payment/payment.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { NotificationModule } from '../../notification/notification.module';
import { SecurityToolsModule } from '../../security/security-tools/security-tools.module';
import { UserAdminService } from './user-admin.service';
import { User } from '../../../../infrastructure/database/entities/User';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { fa } from '@faker-js/faker';
import { UserProfileDto } from '../dto/user-profile.dto';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { CompanyTableService } from '../../crud/company-table/company-table.service';
import { isNull } from 'lodash';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';
import { EmailService } from '../../notification/email.service';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { OtpService } from '../../security/security-tools/otp.service';
import { OtpHashDto } from '../../security/security-tools/dto/otp-hash.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { RedisCacheService } from '../../../../infrastructure/utils/services/redis-cache.service';

describe('UserService', () => {
  let table: UserTableService;
  let service: UserService;
  let testDataService: TestDataService;
  const userDataValid: UserProfileDto = {
    personalVerification: true,
    phoneNumber: '09128524065',
    name: 'mmwdali',
    family: 'hosseini',
    personalCode: '03825893147',
    birthDate: new Date('2002-02-02'),
    email: 'test@test.com',
  };

  const userDataInValid: UserProfileDto = {
    personalVerification: true,
    phoneNumber: '09128524065',
    name: 'mmwdali',
    family: 'hosseini',
    personalCode: '03825893147',
    birthDate: new Date('2002-02-02'),
    email: 'test@test.com',
  };

  const companyData = {
    companyName: 'test',
    companyCode: '15975325841',
    economyCode: '15816515114',
    submittedCode: '565515515115',
  };

  // const mockUserTableService = {
  //     updateWithOptions: jest.fn((data, saveOption, option) => {
  //         return {
  //             ...userData,
  //             company: companyData
  //         }
  //     })
  // };
  const mockCompanyTableService = {
    create: jest.fn((id, dto) => {
      return {
        id: Math.floor(new Date().getTime() / 1000),
        ...dto,
      };
    }),
  };

  const mockEmailService = {
    sendMail: jest.fn((): void => {
      const a = 'as';
    }),
  };

  const mockOtpService = {
    otpGenerator: jest.fn((phoneNumber: string): OtpHashDto => {
      return {
        otp: randomInt(100000, 999999).toString(),
        hash: 'fdcf10ded8e80b753e6add8c36b3ebf5e63b6e0f298dae9781ed9649d47ce1e9.1700292574735',
      };
    }),
    otpVerifier: jest.fn(
      (phoneNumber: string, otp: string, hash: string): boolean => {
        return true;
      },
    ),
  };

  const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        LoggerModule,
        PaymentModule,
        JwtModule,
        NotificationModule,
        SecurityToolsModule,
      ],
      providers: [
        UserService,
        UserAdminService,
        UserTableService,
        CompanyTableService,
        OtpService,
        RedisCacheService,
      ],
    })
      // .overrideProvider(UserTableService)
      // .useValue(mockUserTableService)
      .overrideProvider(CompanyTableService)
      .useValue(mockCompanyTableService)
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .overrideProvider(OtpService)
      .useValue(mockOtpService)
      .compile();

    table = module.get<UserTableService>(UserTableService);
    service = module.get<UserService>(UserService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByPhoneNumber', () => {
    it('should return my user data', async () => {
      const user = await service.findByPhoneNumber('09133089726');
      expect(user).toBeDefined();
    });
  });

  describe('getUsers', () => {
    it('should return some users', async () => {
      const users = await table.find({});
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should be null if user not found', async () => {
      const user = await table.findOne({
        where: { username: 'back2-test1111' },
      });
      expect(user).toBeNull();
    });

    it('should return user if user exists', async () => {
      const user = await table.findOne({ where: { username: 'back2-test' } });
      expect(user.username).toBeDefined();
      expect(user.username).toBe('back2-test');
    });
  });

  describe('hashing', () => {
    it('should be return non equal hashes', async () => {
      const hash1 = await encryptPassword('abc123');
      const hash2 = await encryptPassword('abc123');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('createProfile', () => {
    it('should be return user profile  without company if valid data  ', async () => {
      const data: CreateProfileDto = {
        personality: true,
        name: 'mmwdali',
        family: 'hosseini',
        personalCode: '03825893147',
        birthDate: new Date('2002-02-02'),
      };

      jest
        .spyOn(service, 'createProfile')
        .mockImplementation((options, data): Promise<any> => {
          if (
            isNull(data.name) ||
            isNull(data.family) ||
            isNull(data.personalCode)
          ) {
            return Promise.reject(BadRequestException);
          } else {
            return Promise.resolve(userDataValid);
          }
        });

      const resFunction = await service.createProfile(
        {} as SessionRequest,
        data,
      );

      expect(resFunction).toEqual(userDataValid);
    });

    it('should be return user profile data with company if valid data', async () => {
      const data: CreateProfileDto = {
        personality: false,
        name: 'mmwdali',
        family: 'hosseini',
        personalCode: '03825893147',
        birthDate: new Date('2001-02-02'),
        companyOwner: false,
        ...companyData,
      };

      jest
        .spyOn(service, 'createProfile')
        .mockImplementation((options, data): Promise<any> => {
          if (
            isNull(data.name) ||
            isNull(data.family) ||
            isNull(data.personalCode)
          ) {
            return Promise.reject(BadRequestException);
          } else {
            return Promise.resolve({
              ...userDataValid,
              company: companyData,
            });
          }
        });

      const resFunction = await service.createProfile(
        {} as SessionRequest,
        data,
      );

      expect(resFunction).toEqual({
        ...userDataValid,
        company: companyData,
      });
    });
  });

  describe('email verifying', () => {
    it('should be return email and hash profile if valid data', async () => {
      const data: ChangeEmailDto = {
        email: 'mmmwdali@test.com',
      };

      const resFunction = await service.sendOtpToEmail(
        {} as SessionRequest,
        data,
      );

      expect(resFunction).toEqual({
        email: expect.any(String),
        hash: expect.any(String),
      });
    });
    it('should be return true if valid email , otp , hash for verifying email otp', async () => {
      const data: VerifyEmailDto = {
        email: 'seyed.mmwdali@gmail.com',
        otp: '123456',
        hash: 'sdsdsddsdsdsdssd',
      };

      jest
        .spyOn(service, 'verifyEmailOtp')
        .mockImplementation(
          async (
            options: SessionRequest,
            data: VerifyEmailDto,
          ): Promise<boolean> => {
            return Promise.resolve(true);
          },
        );

      const resFunction = await service.verifyEmailOtp(
        { user: { userId: 1060 } } as SessionRequest,
        data,
      );

      expect(resFunction).toBeTruthy();
    });
  });
});
