import { NotificationService } from './notification.service';
import { TestBed } from '@automock/jest';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeAll(async () => {
    const { unit } = TestBed.create(NotificationService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
