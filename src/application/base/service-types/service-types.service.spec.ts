import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypesService } from './service-types.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { CreateServiceTypeDto } from 'src/infrastructure/dto/create/create-service-types.dto';

describe('ServiceTypesService', () => {
  let service: ServiceTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceTypesService],
    }).compile();

    service = module.get<ServiceTypesService>(ServiceTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("Check parameter validation", () =>{
    beforeAll( ()=>{

    })

    it( "should not throw" , async () => {
        const dto  = new CreateServiceTypeDto()
        dto.id = "1";
        dto.title = "Majid";
        dto.baseFee = 1;
        dto.createInstanceScript="";
        dto.verifyInstance = true;
        dto.maxAvailable = 100;
        dto.isPayg = false ;
        let err;
        try{
          await service.create(dto);
        }catch(error){
          console.log(error);
          err = error;
        }
        expect(err).toBeUndefined();
    })



  })
});
