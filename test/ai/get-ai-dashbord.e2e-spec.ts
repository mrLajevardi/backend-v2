import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

describe('Get Arad AI Dashboard API', () => {
  let app;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the dashboard data for the given service instance id', () => {
    return request(app.getHttpServer())
      .get('/ai/aradAiDashoard/7F56235C-BFA9-4C30-BA5A-9EA551B0A579')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
