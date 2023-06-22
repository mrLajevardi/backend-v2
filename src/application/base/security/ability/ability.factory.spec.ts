import { AbilityFactory, Action } from './ability.factory';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { AclService } from 'src/application/base/security/acl/acl.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { InvoicesService } from '../../invoice/service/invoices.service';
import { User } from 'src/infrastructure/database/test-entities/User';
import { PlansService } from 'src/application/base/plans/plans.service';
import { ItemTypesService } from 'src/application/base/service/item-types/item-types.service';
import { ServiceTypesService } from 'src/application/base/service/service-types/service-types.service';
import { InvoicesChecksService } from 'src/application/base/invoice/service/invoices-checks.service';
import { CostCalculationService } from 'src/application/base/invoice/service/cost-calculation.service';
import { InvoiceItemsService } from 'src/application/base/invoice/invoice-items/invoice-items.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { InvoicePlansService } from 'src/application/base/invoice/invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from 'src/application/base/invoice/invoice-properties/invoice-properties.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ServiceChecksService } from '../../service/services/service-checks/service-checks.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { DiscountsService } from 'src/application/base/service/services/discounts.service';
import { ServiceInstancesService } from 'src/application/base/service/services/payg.service';
import { OrganizationService } from 'src/application/base/organization/organization.service';
import { ConfigsService } from '../../service/configs/configs.service';

describe('AbilityFactory', () => {
  let abilityFactory: AbilityFactory;
  let userService: UserService;
  let testDataService: TestDataService;
  let aclService: AclService;
  let invoiceService: InvoicesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        AclService,
        AbilityFactory,
        UserService,
        InvoicesService,
        TestDataService,
        PlansService,
        ItemTypesService,
        ServiceTypesService,
        InvoicesChecksService,
        CostCalculationService,
        InvoiceItemsService,
        TransactionsService,
        InvoicePlansService,
        InvoicePropertiesService,
        VgpuService,
        ServiceChecksService,
        ConfigsService,
        SessionsService,
        DiscountsService,
        ServiceInstancesService,
        OrganizationService,
      ],
    }).compile();

    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
    userService = module.get<UserService>(UserService);
    aclService = module.get<AclService>(AclService);
    testDataService = module.get<TestDataService>(TestDataService);
    invoiceService = module.get<InvoicesService>(InvoicesService);
    //await testDataService.seedTestData();
  });

  describe('Generic Access Tests, that are not based on specific user ', () => {
    beforeAll(async () => {
      const user = new User();
      user.id = 1;
      user.name = 'majid1';
      user.family = 'ziaei';
      user.username = 'majid1';
      user.password = '123';
      user.createDate = new Date();
      user.updateDate = new Date();
      await userService.create(user);

      user.id = 2;
      await userService.create(user);

      await aclService.create({
        model: 'Acl',
        accessType: 'read',
        principalType: '',
        principalId: '',
        property: '',
        permission: 'can',
      });

      await aclService.create({
        model: 'User',
        accessType: 'read',
        principalType: '',
        principalId: '',
        property: 'issueId',
        permission: 'cannot',
      });

      await aclService.create({
        model: 'User',
        accessType: 'read',
        principalType: '',
        principalId: '',
        property: "'name'",
        permission: 'can',
      });
    });

    afterAll(() => {
      userService.deleteAll();
      aclService.deleteAll();
    });

    it('should return 2 for users.getAll', async () => {
      const users = await userService.find();
      expect(users.length).toBe(2);
    });

    it('should return 2 for acl.getAll', async () => {
      const acls = await aclService.find();
      console.log(acls);
      expect(acls.length).toBe(3);
    });

    // Generic Access: check single read permission on all of Acl table
    it('should return true', async () => {
      const user1 = await userService.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const result = ability.can(Action.Read, 'Acl');
      expect(result).toBeTruthy();
    });

    // Generic Access:  check access to one field of Acl
    it('should return false', async () => {
      const user1 = await userService.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const result = ability.can(Action.Read, 'User', 'issueId');
      expect(result).toBeFalsy();
    });

    // Generic Access:  check access to one field of User
    it('should return true', async () => {
      const user1 = await userService.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const result = ability.can(Action.Read, 'User', 'name');
      expect(result).toBeTruthy();
    });
  });

  describe('User specific access ', () => {
    beforeAll(async () => {
      const user = new User();
      user.id = 1;
      user.name = 'majid1';
      user.family = 'ziaei';
      user.username = 'majid1';
      user.password = '123';
      user.createDate = new Date();
      user.updateDate = new Date();
      await userService.create(user);

      user.id = 2;
      await userService.create(user);

      await aclService.create({
        model: 'Acl',
        accessType: 'read',
        principalType: 'User',
        principalId: '1',
        property: '',
        permission: 'can',
      });

      await aclService.create({
        model: 'User',
        accessType: 'read',
        principalType: 'User',
        principalId: '1',
        property: '',
        permission: 'cannot',
      });

      await aclService.create({
        model: 'User',
        accessType: 'read',
        principalType: 'User',
        principalId: '2',
        property: '',
        permission: 'can',
      });
    });

    afterAll(async () => {
      await userService.deleteAll();
      await aclService.deleteAll();
    });

    it('should return 2 for users.getAll', async () => {
      const users = await userService.find();
      expect(users.length).toBe(2);
    });

    it('should return 3 for acl.getAll', async () => {
      const acls = await aclService.find();
      console.log(acls);
      expect(acls.length).toBe(3);
    });

    // access of user 1 to read the Acl
    it('should return true', async () => {
      const user1 = await userService.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const result = ability.can(Action.Read, 'Acl');
      expect(result).toBeTruthy();
    });

    // access of user 2 to read the Acl
    it('should return false', async () => {
      const user2 = await userService.findById(2);
      const ability = await abilityFactory.createForUser(user2);
      const result = ability.can(Action.Read, 'Acl');
      expect(result).toBeFalsy();
    });

    // access of user 2 to read the User
    it('should return true', async () => {
      const user2 = await userService.findById(2);
      const ability = await abilityFactory.createForUser(user2);
      const result = ability.can(Action.Read, user2);
      expect(result).toBeTruthy();
    });
  });

  describe('User specific access with Query  ', () => {
    beforeAll(async () => {
      const user = new User();
      user.id = 1;
      user.name = 'majid1';
      user.family = 'ziaei';
      user.username = 'majid1';
      user.password = '123';
      user.createDate = new Date();
      user.updateDate = new Date();
      await userService.create(user);

      user.id = 2;
      await userService.create(user);

      await aclService.create({
        model: 'Invoices',
        accessType: 'read',
        principalType: 'User',
        principalId: '1',
        property: "{ 'user' : user }",
        permission: 'can',
      });
    });

    afterAll(async () => {
      await userService.deleteAll();
      await aclService.deleteAll();
    });

    // user 1 access to invoice of user 1
    it('should return true', async () => {
      const user1 = await userService.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const invoice = new Invoices();
      invoice.id = 1;
      invoice.user = user1;
      const result = ability.can(Action.Read, invoice);
      expect(result).toBeTruthy();
    });

    // user 1 access to invoice of user 2
    it('should return false', async () => {
      const user1 = await userService.findById(1);
      const user2 = await userService.findById(2);
      const ability = await abilityFactory.createForUser(user1);
      const invoice = new Invoices();
      invoice.user = user1;
      invoice.id = 1;
      invoice.name = 'test';
      const result = ability.can(Action.Read, user2);
      expect(result).toBeFalsy();
    });
  });

  describe('checking error states', () => {
    // no rules in acl table
    it('should return 0 ', async () => {
      const result = await aclService.find();
      expect(result.length).toBe(0);
    });

    // no user defined
    it('should return 0', async () => {
      const result = await userService.find();
      expect(result.length).toBe(0);
    });

    // If user is null
    it('should not throw exceptions', async () => {
      let err = undefined;
      try {
        const ability = await abilityFactory.createForUser(null);
        ability.can(Action.Create, 'Acl');
      } catch (error) {
        err = error;
      }
      expect(err).toBeUndefined();
    });

    // If user has no ID
    it('should not throw exceptions', async () => {
      let err = undefined;
      try {
        const user = new User();
        user.name = 'test';
        const ability = await abilityFactory.createForUser(user);
        ability.can(Action.Create, 'Acl');
      } catch (error) {
        err = error;
      }
      expect(err).toBeUndefined();
    });

    // If acl is null
    it('should not throw exceptions', async () => {
      let err = undefined;
      try {
        const ability = await abilityFactory.createForUser(null);
        ability.can(Action.Create, null);
      } catch (error) {
        err = error;
      }
      expect(err).toBeUndefined();
    });
  });

  describe('Some complicated scenarios', () => {
    let inv1: Invoices;
    let inv2: Invoices;
    let user: User;
    beforeAll(async () => {
      user = new User();
      user.id = 1;
      user.name = 'majid';

      inv1 = new Invoices();
      inv2 = new Invoices();

      inv1.user = user;
      inv2.user = user;

      inv1.name = 'test1';
      inv2.name = 'test2';

      inv1.payed = false;
      inv2.payed = true;
    });

    describe('User can see only his not payed invoices, so ', () => {
      beforeAll(async () => {
        await aclService.create({
          model: 'Invoices',
          accessType: 'read',
          principalType: '',
          principalId: '',
          property: '{ "payed" : false , "user": user } ',
          permission: 'can',
        });
      });

      it('should return true for inv1', async () => {
        const ability = await abilityFactory.createForUser(user);
        expect(ability.can(Action.Read, inv1)).toBeTruthy();
      });

      it('should return false for inv2', async () => {
        const ability = await abilityFactory.createForUser(user);
        expect(ability.can(Action.Read, inv2)).toBeFalsy();
      });
    });
  });
});
