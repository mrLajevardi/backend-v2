import { Test, TestingModule } from '@nestjs/testing';
import { VmFactoryService } from './vm-factory.service';
import { TestBed } from '@automock/jest';

describe('VmFactoryService', () => {
  let service: VmFactoryService;

  beforeEach(async () => {
    const { unit } = TestBed.create(VmFactoryService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
