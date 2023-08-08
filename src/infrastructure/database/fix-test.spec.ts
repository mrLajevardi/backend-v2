import { Test, TestingModule } from '@nestjs/testing';
import { ACLTableService } from 'src/application/base/crud/acl-table/acl-table.service';
import { FixTestDbModule } from './FixTestDbModule';

describe('ACLTableService', () => {
  let service: ACLTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [FixTestDbModule],
      providers: [ACLTableService],
    }).compile();

    service = module.get<ACLTableService>(ACLTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(service).toBeDefined();
  });
});
