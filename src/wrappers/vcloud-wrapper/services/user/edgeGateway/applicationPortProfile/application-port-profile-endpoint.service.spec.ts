import { ApplicationPortProfileEndpointService } from './application-port-profile-endpoint.service';
import { TestBed } from '@automock/jest';

describe('ApplicationPortProfileEndpointService', () => {
  let service: ApplicationPortProfileEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(
      ApplicationPortProfileEndpointService,
    ).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
