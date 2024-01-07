import { ServiceInstancesStoredProcedureService } from './service-instances-stored-procedure.service';
import { TestBed } from '@automock/jest';

describe('ServiceInstancesStoredProcedureService', () => {
  let service: ServiceInstancesStoredProcedureService;
  beforeAll(async () => {
    const { unit } = TestBed.create(
      ServiceInstancesStoredProcedureService,
    ).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
