import { Test, TestingModule } from '@nestjs/testing';
import { AclService } from './acl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/db/entities/Acl';
import { ormconfig } from 'src/infrastructure/configs/ormconfig';

describe('AclService', () => {
  let service: AclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormconfig.test),
        TypeOrmModule.forFeature([Acl])
      ],
      providers: [
        AclService,
        
      ],
    }).compile();

    service = module.get<AclService>(AclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
