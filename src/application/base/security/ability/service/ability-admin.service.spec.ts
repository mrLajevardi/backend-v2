import { Test, TestingModule } from '@nestjs/testing';
import { AbilityAdminService } from './ability-admin.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { AbilityFactory, Action, ability } from '../ability.factory';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { Invoices } from 'src/infrastructure/database/test-entities/Invoices';

describe('AbilityAdminService', () => {
  let service: AbilityAdminService;
  let testDataService : TestDataService;
  let userTable : UserTableService;
  let abilityFactory: AbilityFactory;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AbilityAdminService,AbilityFactory],
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
      console.log(user);
      await service.permitAccessToUser(Action.Create,'Invoice',user);
      const factory = await  abilityFactory.createForUser(user);
      const can = factory.can(Action.Create, "Invoice");
      expect(can).toBe(true);
    });

    it('should return true', async () => {
      const user = await userTable.findById(597);
      console.log(user);
      await service.permitAccessToUser(Action.Create,'Invoices',user);
      const factory = await  abilityFactory.createForUser(user);
      const invoice = new Invoices()
      const can = factory.can(Action.Create, invoice );
      expect(can).toBe(true);
    });

    it('should return false', async () => {
      const user = await userTable.findById(597);
      console.log(user);
      await service.permitAccessToUser(Action.Create,'InvoiceItems',user);
      const factory = await  abilityFactory.createForUser(user);
      const can = factory.cannot(Action.Create, "InvoiceItems");
      expect(can).toBe(false);
    });


  })
});
