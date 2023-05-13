import { Test } from '@nestjs/testing';
import { AclController } from './acl.controller';
import { AclService } from './acl.service';
import { TestDBProviders } from 'src/infrastructure/test-utils/providers';


describe('AclController', () => {
  let controller: AclController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AclController],
      providers: [
        AclService,
        TestDBProviders.aclProvider,
       
      ],
    }).compile();

    controller = moduleRef.get<AclController>(AclController);
  });


  describe('findAll', () => {
    it('should return an array of ACL records', async () => {
      const response = await controller.findAll();
      expect(response).toBeInstanceOf(Array);
    });
  });

});
