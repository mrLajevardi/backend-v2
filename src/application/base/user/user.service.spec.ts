import { Test, TestingModule } from '@nestjs/testing';
import { TestDBProviders } from 'src/infrastructure/test-utils/providers';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        TestDBProviders.userProvider,
    ]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('findByPhoneNumber', () => {
    it('should return my user data', async () => {
      const user = await service.findByPhoneNumber('09133089726')
      expect(user).toBeDefined() 
    })
  })

  describe('getUsers', () => {
    it('should return some users', async ()=> {
      const users = await service.getUsers();
      expect(users.length).toBeGreaterThan(0)
    })
  })

  describe('findOne', () => {
    it('should be null if user not found', async () => {
      const user = await service.findOne({username: "back2-test1111"});
      expect(user).toBeNull();
    });

    it("should return user if user exists", async () => {
      const user = await service.findOne({username: "back2-test"});
      expect(user.username).toBeDefined();
      expect(user.username).toBe("back2-test");
    });
  })

  describe('hashing', ()=> {
    it("should be return non equal hashes", async () => {
      const hash1 = await service.getPasswordHash('abc123');
      const hash2 = await service.getPasswordHash('abc123');
      expect(hash1).not.toBe(hash2);
    })

    it("should return true in comparison", async () => {
      const hash1 = await service.getPasswordHash('abc123');
      const result = await service.comparePassword(hash1,'abc123');
      expect(result).toBeTruthy();
    })
  })
});
