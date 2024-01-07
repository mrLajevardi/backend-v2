import { NatEndpointService } from './nat-endpoint.service';
import { TestBed } from '@automock/jest';

describe('NatEndpointService', () => {
  let service: NatEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(NatEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
