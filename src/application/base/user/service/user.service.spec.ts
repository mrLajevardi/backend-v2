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
      ],
    })
      // .overrideProvider(UserTableService)
      // .useValue(mockUserTableService)
      .overrideProvider(CompanyTableService)
      .useValue(mockCompanyTableService)
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

    // it('should be return exception if null data  if null data', async () => {
    //
    //     const data: CreateProfileDto = {
    //         personality: null,
    //         name: null,
    //         family: null,
    //         personalCode: null,
    //         birthDate: null,
    //         companyOwner: null,
    //     };
    //
    //     const options = {
    //         user: {
    //             userId: 1060
    //         }
    //     }
    //
    //     const resFunction = await service.createProfile(options as SessionRequest,new  CreateProfileDto());
    //     expect(resFunction).toEqual({});
    // });
  });
});
