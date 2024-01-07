import { ApplicationPortProfileWrapperService } from './application-port-profile-wrapper.service';
import { TestBed } from '@automock/jest';

describe('ApplicationPortProfileWrapperService', () => {
  let service: ApplicationPortProfileWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(
      ApplicationPortProfileWrapperService,
    ).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
