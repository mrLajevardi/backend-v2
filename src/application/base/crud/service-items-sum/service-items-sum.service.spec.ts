import { Test, TestingModule } from '@nestjs/testing';
import { ServiceItemsSumService } from './service-items-sum.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ServiceItemsSumService', () => {
  let service: ServiceItemsSumService;
  let module : TestingModule; 

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServiceItemsSumService],
    }).compile();

    service = module.get<ServiceItemsSumService>(ServiceItemsSumService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
