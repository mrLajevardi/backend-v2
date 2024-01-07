import { VitrificationServiceService } from './vitrification.service.service';
import { TestBed } from '@automock/jest';

describe('VitrificationServiceService', () => {
  let service: VitrificationServiceService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VitrificationServiceService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
