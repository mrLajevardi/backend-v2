import { ApplicationPortProfileService } from './application-port-profile.service';
import { TestBed } from '@automock/jest';

describe('ApplicationPortProfileService', () => {
  let service: ApplicationPortProfileService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ApplicationPortProfileService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
