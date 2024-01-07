import { NatWrapperService } from './nat-wrapper.service';
import { TestBed } from '@automock/jest';

describe('NatWrapperService', () => {
  let service: NatWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(NatWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
