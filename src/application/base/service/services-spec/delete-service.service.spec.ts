import { DeleteServiceService } from '../services/delete-service.service';
import { TestBed } from '@automock/jest';

describe('DeleteServiceService', () => {
  let service: DeleteServiceService;

  beforeAll(async () => {
    const { unit } = TestBed.create(DeleteServiceService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
