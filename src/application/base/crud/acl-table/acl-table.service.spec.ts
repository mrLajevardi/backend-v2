import { Test, TestingModule } from '@nestjs/testing';
import { ACLTableService } from './acl-table.service';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ACLTableService', () => {
  let service: ACLTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ACLTableService],
    }).compile();

    service = module.get<ACLTableService>(ACLTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(process.env.NODE_ENV).toBe('test');

    expect(service).toBeDefined();
  });
});
