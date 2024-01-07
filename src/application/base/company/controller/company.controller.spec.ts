import { TestBed } from '@automock/jest';
import { CompanyController } from './company.controller';

describe('CompanyController', () => {
  let controller: CompanyController;
  beforeEach(async () => {
    const { unit } = TestBed.create(CompanyController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
