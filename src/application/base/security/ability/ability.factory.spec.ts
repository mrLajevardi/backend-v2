import { AbilityFactory, Action } from './ability.factory';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { InvoicesService } from '../../invoice/service/invoices.service';
import { User } from 'src/infrastructure/database/test-entities/User';
import { InvoicesChecksService } from 'src/application/base/invoice/service/invoices-checks.service';
import { CostCalculationService } from 'src/application/base/invoice/service/cost-calculation.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ServiceChecksService } from '../../service/services/service-checks/service-checks.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { DiscountsService } from 'src/application/base/service/services/discounts.service';
import { OrganizationService } from 'src/application/base/organization/organization.service';
import { ACLTableService } from '../../crud/acl-table/acl-table.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../../crud/invoice-properties-table/invoice-properties-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { UserService } from '../../user/service/user.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';

describe('AbilityFactory', () => {
  let abilityFactory: AbilityFactory;
  let userTable: UserTableService;
  let testDataService: TestDataService;
  let aclTable: ACLTableService;
  let invoiceService: InvoicesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AbilityFactory],
    }).compile();

    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
    userTable = module.get<UserTableService>(UserTableService);
    aclTable = module.get<ACLTableService>(ACLTableService);
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
      await userTable.create(user);

      user.id = 2;
      await userTable.create(user);

      await aclTable.create({
        model: 'Acl',
        accessType: 'read',
        principalType: '',
        principalId: '',
        property: '',
        permission: 'can',
      });

      await aclTable.create({
        model: 'User',
        accessType: 'read',
        principalType: '',
        principalId: '',
        property: 'id',
        permission: 'cannot',
      });

      await aclTable.create({
        model: 'User',
        accessType: 'read',
        principalType: '',
        principalId: '',
        property: "'name'",
        permission: 'can',
      });
    });

    afterAll(() => {
      userTable.deleteAll();
      aclTable.deleteAll();
    });

    it('should return 2 for users.getAll', async () => {
      const users = await userTable.find();
      expect(users.length).toBe(2);
    });

    it('should return 2 for acl.getAll', async () => {
      const acls = await aclTable.find();
      console.log(acls);
      expect(acls.length).toBe(3);
    });

    // Generic Access: check single read permission on all of Acl table
    it('should return true', async () => {
      const user1 = await userTable.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const result = ability.can(Action.Read, 'Acl');
      expect(result).toBeTruthy();
    });

    // Generic Access:  check access to one field of Acl
    it('should return false', async () => {
      const user1 = await userTable.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const result = ability.can(Action.Read, 'User', 'id');
      expect(result).toBeFalsy();
    });

    // Generic Access:  check access to one field of User
    it('should return true', async () => {
      const user1 = await userTable.findById(1);
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
      await userTable.create(user);

      user.id = 2;
      await userTable.create(user);

      await aclTable.create({
        model: 'Acl',
        accessType: 'read',
        principalType: 'User',
        principalId: '1',
        property: '',
        permission: 'can',
      });

      await aclTable.create({
        model: 'User',
        accessType: 'read',
        principalType: 'User',
        principalId: '1',
        property: '',
        permission: 'cannot',
      });

      await aclTable.create({
        model: 'User',
        accessType: 'read',
        principalType: 'User',
        principalId: '2',
        property: '',
        permission: 'can',
      });
    });

    afterAll(async () => {
      await userTable.deleteAll();
      await aclTable.deleteAll();
    });

    it('should return 2 for users.getAll', async () => {
      const users = await userTable.find();
      expect(users.length).toBe(2);
    });

    it('should return 3 for acl.getAll', async () => {
      const acls = await aclTable.find();
      console.log(acls);
      expect(acls.length).toBe(3);
    });

    // access of user 1 to read the Acl
    it('should return true', async () => {
      const user1 = await userTable.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const result = ability.can(Action.Read, 'Acl');
      expect(result).toBeTruthy();
    });

    // access of user 2 to read the Acl
    it('should return false', async () => {
      const user2 = await userTable.findById(2);
      const ability = await abilityFactory.createForUser(user2);
      const result = ability.can(Action.Read, 'Acl');
      expect(result).toBeFalsy();
    });

    // access of user 2 to read the User
    it('should return true', async () => {
      const user2 = await userTable.findById(2);
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
      await userTable.create(user);

      user.id = 2;
      await userTable.create(user);

      await aclTable.create({
        model: 'Invoices',
        accessType: 'read',
        principalType: 'User',
        principalId: '1',
        property: "{ 'user' : user }",
        permission: 'can',
      });
    });

    afterAll(async () => {
      await userTable.deleteAll();
      await aclTable.deleteAll();
    });

    // user 1 access to invoice of user 1
    it('should return true', async () => {
      const user1 = await userTable.findById(1);
      const ability = await abilityFactory.createForUser(user1);
      const invoice = new Invoices();
      invoice.id = 1;
      invoice.user = user1;
      const result = ability.can(Action.Read, invoice);
      expect(result).toBeTruthy();
    });

    // user 1 access to invoice of user 2
    it('should return false', async () => {
      const user1 = await userTable.findById(1);
      const user2 = await userTable.findById(2);
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
      const result = await aclTable.find();
      expect(result.length).toBe(0);
    });

    // no user defined
    it('should return 0', async () => {
      const result = await userTable.find();
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
        await aclTable.create({
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
