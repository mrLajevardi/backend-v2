import { Ability, MongoQuery, defineAbility, ɵvalue } from '@casl/ability';
import { AbilityFactory, Action } from './ability.factory';
import { User } from 'src/infrastructure/database/entities/User';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { Acl } from 'src/infrastructure/database/entities/Acl';
import { AclService } from '../acl/acl.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { InvoiceService } from 'src/application/core/invoices/services/invoice.service';


describe('AbilityFactory', () => {
  let abilityFactory : AbilityFactory;
  let userService : UserService; 
  let testDataService : TestDataService; 
  let aclService : AclService; 
  let invoiceService : InvoiceService; 

  beforeAll( async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule
      ],
      providers: [
        AclService,
        AbilityFactory,
        UserService,
        InvoiceService,
        TestDataService
      ],
    }).compile();

    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
    userService = module.get<UserService>(UserService); 
    aclService = module.get<AclService>(AclService); 
    testDataService = module.get<TestDataService>(TestDataService);
    invoiceService = module.get<InvoiceService>(InvoiceService);
    //await testDataService.seedTestData(); 

  })


  describe("Generic Access Tests, that are not based on specific user " , () => {
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
        "model": "User",
        "accessType": "read",
        "principalType": "",
        "principalId": "",
        "property": "issueId",
        "permission": "cannot"
      })

      await aclService.create({
        "model": "User",
        "accessType": "read",
        "principalType": "",
        "principalId": "",
        "property": "name",
        "permission": "can"
      })

    })

    afterAll(()=>{
      userService.deleteAll();
      aclService.deleteAll(); 
    })

    it("should return 2 for users.getAll" , async () => {
      const users  = await userService.findAll(); 
      expect(users.length).toBe(2);
    })


    it("should return 2 for acl.getAll" , async () => {
      const acls = await aclService.findAll(); 
      console.log(acls);
      expect(acls.length).toBe(3); 
    })

    // Generic Access: check single read permission on all of Acl table 
    it("should return true", async () => {
      const user1 = await userService.findById(1); 
      const ability = await abilityFactory.createForUser(user1); 
      const result = ability.can(Action.Read,'Acl');
      expect(result).toBeTruthy(); 
    })

    // Generic Access:  check access to one field of Acl 
    it("should return false", async () => {
      const user1 = await userService.findById(1); 
      const ability = await abilityFactory.createForUser(user1); 
      const result = ability.can(Action.Read,'User',"issueId");
      expect(result).toBeFalsy(); 
    })

    // Generic Access:  check access to one field of User 
    it("should return true", async () => {
      const user1 = await userService.findById(1); 
      const ability = await abilityFactory.createForUser(user1); 
      const result = ability.can(Action.Read,'User',"name");
      expect(result).toBeTruthy(); 
    })


  })



  describe("User specific access " , () => {
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
        "principalType": "User",
        "principalId": "1",
        "property": "",
        "permission": "can"
      })

      await aclService.create({
        "model": "User",
        "accessType": "read",
        "principalType": "User",
        "principalId": "1",
        "property": "",
        "permission": "cannot"
      })

      await aclService.create({
        "model": "User",
        "accessType": "read",
        "principalType": "User",
        "principalId": "2",
        "property": "",
        "permission": "can"
      })

    })


    afterAll(()=>{
      userService.deleteAll();
      aclService.deleteAll(); 
    })


    it("should return 2 for users.getAll" , async () => {
      const users  = await userService.findAll(); 
      expect(users.length).toBe(2);
    })


    it("should return 3 for acl.getAll" , async () => {
      const acls = await aclService.findAll(); 
      console.log(acls);
      expect(acls.length).toBe(3); 
    })

    // access of user 1 to read the Acl  
    it("should return true", async () => {
      const user1 = await userService.findById(1); 
      const ability = await abilityFactory.createForUser(user1); 
      const result = ability.can(Action.Read,'Acl');
      expect(result).toBeTruthy(); 
    })

    // access of user 2 to read the Acl  
    it("should return false", async () => {
      const user2 = await userService.findById(2); 
      const ability = await abilityFactory.createForUser(user2); 
      const result = ability.can(Action.Read,'Acl');
      expect(result).toBeFalsy(); 
    })

    // access of user 2 to read the User  
    it("should return true", async () => {
      const user2 = await userService.findById(2); 
      const ability = await abilityFactory.createForUser(user2); 
      const result = ability.can(Action.Read,user2);
      expect(result).toBeTruthy(); 
    })
  })



  describe("User specific access with Query  " , () => {
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
        "model": "Invoices",
        "accessType": "read",
        "principalType": "User",
        "principalId": "1",
        "property": "{ user : user }",
        "permission": "can"
      })

    })


    afterAll(()=>{
      userService.deleteAll();
      aclService.deleteAll(); 
    })


    // user 1 access to invoice of user 1 
    it("should return true", async () => {
      const user1 = await userService.findById(1); 
      const ability = await abilityFactory.createForUser(user1); 
      let invoice =  new Invoices();
      invoice.id=1; 
      invoice.user = user1; 
      const result = ability.can(Action.Read,invoice);
      expect(result).toBeTruthy(); 
    })

    // user 1 access to invoice of user 2 
    it("should return false", async () => {
      const user1 = await userService.findById(1); 
      const user2 = await userService.findById(2); 
      const ability = await abilityFactory.createForUser(user1); 
      let invoice = new Invoices(); 
      invoice.user = user1; 
      invoice.id = 1; 
      invoice.name = 'test';
      const result = ability.can(Action.Read,user2);
      expect(result).toBeFalsy(); 
    })

  })

})
