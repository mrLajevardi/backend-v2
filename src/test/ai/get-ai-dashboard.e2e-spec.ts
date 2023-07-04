import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import { getAuthToken } from '../test.helper';

describe('Get Arad AI Dashboard API ', () => {
  let app;
  let mockToken;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    mockToken = await getAuthToken();
  });

  afterAll(async () => {
    await app.close();
  });
  it('should return the dashboard data for the given service instance id', () => {
    return request(app.getHttpServer())
      .get('/ai/aradAiDashoard/7F56235C-BFA9-4C30-BA5A-9EA551B0A579')
      .set('Authorization', `Bearer ${mockToken}`)
      .expect(200);
  });
});
