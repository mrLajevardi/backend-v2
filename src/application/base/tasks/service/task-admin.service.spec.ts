import { TaskAdminService } from './task-admin.service';
import { TestBed } from '@automock/jest';

describe('TaskAdminService', () => {
  let service: TaskAdminService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TaskAdminService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
