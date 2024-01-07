import { CreateServiceService } from '../services/create-service.service';
import { TestBed } from '@automock/jest';

describe('CreateServiceService', () => {
  let service: CreateServiceService;

  beforeAll(async () => {
    const { unit } = TestBed.create(CreateServiceService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
