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

    // it("should return true", async () => {
    //   const user = await userService.findById(597);
    //   const ability = await abilityFactory.createForUser(user);
    //   const invoice = new Invoices();
    //   invoice.user = user; 
    //   expect(ability.can(Action.Create,invoice,'index')).toBeTruthy(); 
    // })

  })

})
