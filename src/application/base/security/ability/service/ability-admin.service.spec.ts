import { Test, TestingModule } from '@nestjs/testing';
import { AbilityAdminService } from './ability-admin.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { AbilityFactory, ability } from '../ability.factory';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { Invoices } from 'src/infrastructure/database/test-entities/Invoices';
import { Action } from '../enum/action.enum';
import { User } from 'src/infrastructure/database/test-entities/User';
import { PredefinedRoles } from '../enum/predefined-enum.type';
import exp from 'constants';
import { stringToEnum } from 'src/infrastructure/helpers/helpers';

describe('AbilityAdminService', () => {
  let service: AbilityAdminService;
  let testDataService: TestDataService;
  let userTable: UserTableService;
  let abilityFactory: AbilityFactory;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AbilityAdminService, AbilityFactory],
    }).compile();

    testDataService = module.get<TestDataService>(TestDataService);
    service = module.get<AbilityAdminService>(AbilityAdminService);
    userTable = module.get<UserTableService>(UserTableService);
    abilityFactory = module.get<AbilityFactory>(AbilityFactory);

    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('add and remove permission', () => {

    it('should return true', async () => {
      const user = await userTable.findById(597);
      // console.log(user);
      await service.permitAccessToUser(Action.Create, 'Invoice', user.id);
      const factory = await abilityFactory.createForUser(user);
      const can = factory.can(Action.Create, "Invoice");
      expect(can).toBe(true);
    });

    it('should return true', async () => {
      const user = await userTable.findById(597);
      // console.log(user);
      await service.permitAccessToUser(Action.Create, 'Invoices', user.id);
      const factory = await abilityFactory.createForUser(user);
      const invoice = new Invoices()
      const can = factory.can(Action.Create, invoice);
      expect(can).toBe(true);
    });

    it('should return false', async () => {
      const user = await userTable.findById(597);
      // console.log(user);
      await service.permitAccessToUser(Action.Create, 'InvoiceItems', user.id);
      const factory = await abilityFactory.createForUser(user);
      const can = factory.cannot(Action.Create, "InvoiceItems");
      expect(can).toBe(false);
    });

  })


  describe('using predefined roles ', () => {

    beforeAll(async () => {
      const user = new User();
      user.id = 1001;
      user.name = 'majid1';
      user.family = 'ziaei';
      user.username = 'majid1';
      user.password = '123';
      user.createDate = new Date();
      user.updateDate = new Date();
      await userTable.create(user);

      const user2 = new User();
      user.id = 1002;
      user.name = 'majid2';
      user.family = 'ziaei';
      user.username = 'majid1';
      user.password = '123';
      user.createDate = new Date();
      user.updateDate = new Date();
      await userTable.create(user);

      await service.assignPredefinedRole(1001, PredefinedRoles.AdminRole);
      await service.assignPredefinedRole(1001, PredefinedRoles.UserRole);
      await service.assignPredefinedRole(1002, PredefinedRoles.SuperAdminRole);

    })

    it('should permit user 1 to admin ', async () => {
      const user = await userTable.findById(1001);
      const user2 = await userTable.findById(1002);
      const access = (await abilityFactory.createForUser(user)).
                    can(Action.Manage, PredefinedRoles.AdminRole);
      const access2 = (await abilityFactory.createForUser(user2)).
                    can(Action.Manage, PredefinedRoles.AdminRole);
      expect(access).toBeTruthy();
      expect(access2).toBeFalsy();
    })

    it('should return Manage Action', () => {
      const manage = 'manage'; 
      const enumVal = stringToEnum(manage,Action);
      expect(enumVal).toBe(Action.Manage);
    })

    it('should return 2 roles for user 1001 and 1 for 1002', async () => {
      const rules1 = await service.getAllPredefinedRoles(1001);
      const rules2 = await service.getAllPredefinedRoles(1002);
      // console.log(rules1);
      // console.log(rules2);
      expect(rules1.length).toBe(2);
      expect(rules2.length).toBe(1);
      expect(rules1[0].action).toBe(Action.Manage);
      expect(rules1[0].model).toBe(PredefinedRoles.AdminRole);
      expect(rules2[0].action).toBe(Action.Manage);
      expect(rules2[0].permission).toBe('can');
    })
  })
});
