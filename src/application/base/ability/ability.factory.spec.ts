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
    testDataService = module.get<TestDataService>(TestDataService);

    await testDataService.seedTestData(); 

  })


  describe('AbilityFactory basic usage', () => {
    it('should be defined', () => {
      expect(abilityFactory).toBeDefined();
    });

    it('should return true', () => {
      const ability = defineAbility( (can) => {
        can(Action.Create,'all');
      })
      expect(ability.can(Action.Create,'User')).toBe(true);
    })

    it('should return false', () => {
      const ability = defineAbility( (can) => {
        can(Action.Create,'Vast');
      })
      expect(ability.can(Action.Create,'User')).toBe(false);
    })

    it('should return true', () => {
      const ability = defineAbility( (can,cannot) => {
        can(Action.Create,'Vast');
        cannot(Action.Create,'all');
      })
      expect(ability.can(Action.Create,'Vast')).toBe(false);
    })


  });

  describe('check attribute', () => {
    let ability : Ability;
    let currentUser : User; 

    beforeAll(()=> { 
      currentUser = new  User();
      ability = defineAbility( (can) => {
        can(Action.Create,'Invoices',{ user : currentUser });
        can(Action.Create,'ServiceInstances', 'index',{ userId : 1});
      })
    })

    it('should return true', () => {
      const invoice = new Invoices();
      invoice.user = currentUser;
      expect(ability.can(Action.Create,invoice)).toBeTruthy();
    })

    it('should return false', () => {
      const invoice = new Invoices();
      const anotherUser = new User();
      invoice.user = anotherUser;
      expect(ability.can(Action.Create,invoice)).toBeFalsy();
    })

    it('should return true', () => {
      const instance = new ServiceInstances();
      instance.index = 1; 
      instance.userId = 1; 
      expect(ability.can(Action.Create,instance,'index')).toBeTruthy();
    })
    
    it('should return true', () => {
      const instance = new ServiceInstances();
      instance.index = 2; 
      instance.userId = 1; 
      expect(ability.can(Action.Create,instance,'index')).toBeTruthy();
    })

    it('should return false', () => {
      const instance = new ServiceInstances();
      instance.index = 2; 
      instance.userId = 2; 
      expect(ability.can(Action.Create,instance,'index')).toBeFalsy();
    })
  })

  describe('check based on Acl table', () => {
    let acl : Acl[] = [];
    let ability : Ability;
    let user1,user2: User; 

    beforeAll( () => {
      let acl1 = new Acl(); 
      let acl2 = new Acl();
      let acl3 = new Acl();
      let acl4 = new Acl();

      acl1.model = 'ServiceInstances';
      acl1.accessType = Action.Create;
      acl1.principalType = 'userId';
      acl1.principalId = '597';
      acl1.property = 'index';
      acl1.permission = 'can';

      acl2.model = 'ServiceInstances';
      acl2.accessType = Action.Create;
      acl2.principalType = 'userId';
      acl2.principalId = '518';
      acl2.property = 'index';
      acl2.permission = 'cannot';

      acl3.model = 'Invoices';
      acl3.accessType = Action.Create;
      acl3.principalType = 'userId';
      acl3.principalId = '597';
      acl3.property = 'index';
      acl3.permission = 'can';

      acl4.model = 'Invoices';
      acl4.accessType = Action.Create;
      acl4.principalType = 'userId';
      acl4.principalId = '518'
      acl4.property = 'index';
      acl4.permission = 'cannot';

      acl.push(acl1);
      acl.push(acl2);
      acl.push(acl3);
      acl.push(acl4);


      ability = defineAbility( (can,cannot) => {
        acl.forEach(acl => {
          const principalObject = { [acl.principalType]: JSON.parse(acl.principalId) };
          if (acl.permission == 'can'){
            can(acl.accessType, acl.model, acl.property, principalObject);
          }else{
            cannot(acl.accessType, acl.model, acl.property, principalObject);
          }
        });
      })

    })

    it('should be true', ()=>{
      const instance = new ServiceInstances();
      instance.userId = 1;
      expect(ability.can(Action.Create,instance, 'index')).toBeTruthy();
    })

    it('should be false', ()=>{
      const instance = new ServiceInstances();
      instance.userId = 2;
      expect(ability.can(Action.Create,instance, 'index')).toBeFalsy();
    })

    it('should be true', async ()=>{
      const invoice = new Invoices();
      const currentUser = await userService.findById(518);
      invoice.user = currentUser; 
      expect(ability.can(Action.Create,invoice, 'index')).toBeTruthy();
    })

    it('should be false', async ()=>{
      const invoice = new Invoices();
      const currentUser = await userService.findById(518); 
      invoice.user = currentUser;
      expect(ability.can(Action.Create,invoice, 'index')).toBeFalsy();
    })

  })

  describe("getModel",()=>{
    it("should return Acl", () => {
      const result = abilityFactory.getModel('Acl');
      console.log(result);
      expect(result).toBe(Acl);
    })
  })

  describe("createForUser", () => { 

    it("should find the user", async () => {
      const user = await userService.findById(597);
      expect(user.id).toBe(597);
    })

    it("should return create", () => {
      console.log(Action.Create);
      console.log(Action['create']);
      expect(abilityFactory.actionLookup['create']).toBe(Action.Create);
    })

    it("should return true", async () => {
      const user = await userService.findById(597);
      const ability = await abilityFactory.createForUser(user);
      const invoice = new Invoices();
      invoice.user = user; 
      expect(ability.can(Action.Create,invoice,'index')).toBeTruthy(); 
    })

  })

})
