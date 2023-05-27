import { Ability, MongoQuery, defineAbility, ɵvalue } from '@casl/ability';
import { AbilityFactory, Action } from './ability.factory';
import { User } from 'src/infrastructure/database/entities/User';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { Acl } from 'src/infrastructure/database/entities/Acl';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { AclService } from '../acl/acl.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';


describe('AbilityFactory', () => {
  let abilityFactory : AbilityFactory;
  let userService : UserService; 
  let testDataService : TestDataService; 
  let aclService : AclService; 

  beforeAll( async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule
      ],
      providers: [
        AclService,
        AbilityFactory,
        UserService,
        TestDataService
      ],
    }).compile();

    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
    userService = module.get<UserService>(UserService); 
    aclService = module.get<AclService>(AclService); 
    testDataService = module.get<TestDataService>(TestDataService);

    //await testDataService.seedTestData(); 

  })


  describe("Ability Factory tests" , () => {
    beforeAll( async () => {
      await userService.create({
        id:1,
        name:"majid1",
        family:"a",
        username:"majid1",
        password:"123",
        createDate: new Date(),
        updateDate: new Date(),
      });

      await userService.create({
        id:2,
        name:"majid2",
        family:"a",
        username:"majid2",
        password:"123",
        createDate: new Date(),
        updateDate: new Date(),
      });

      await aclService.create({
          "model": "Acl",
          "accessType": "read",
          "principalType": "",
          "principalId": "",
          "property": "",
          "permission": "can"
      })

      await aclService.create({
        "model": "Acl",
        "accessType": "read",
        "principalType": "",
        "principalId": "",
        "property": "",
        "permission": "cannot"
      })

    })

    it("should return 2 for users.getAll" , async () => {
      const users  = await userService.findAll(); 
      expect(users.length).toBe(2);
    })


    it("should return 2 for acl.getAll" , async () => {
      const acls = await aclService.findAll(); 
      console.log(acls);
      expect(acls.length).toBe(2); 
    })

    it("should return true", async () => {
      const user1 = await userService.findById(1); 
      const ability = await abilityFactory.createForUser(user1); 
      const result = ability.can(Action.Read,Acl);
      expect(result).toBeTruthy(); 
    })

  })

})
