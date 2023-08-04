import { Test, TestingModule } from '@nestjs/testing';
import { NatService } from './nat.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../base/crud/crud.module';
import { ServiceModule } from '../base/service/service.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { ServiceProperties } from 'src/infrastructure/database/entities/ServiceProperties';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';

describe('NatService', () => {
  let service: NatService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        LoggerModule,
        ServicePropertiesModule,
        SessionsModule,
        CrudModule,
      ],
      providers: [NatService],
    }).compile();

    service = module.get<NatService>(NatService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
