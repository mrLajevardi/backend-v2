import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getAuthToken } from '../test.helper';
import { AppModule } from '../../app.module';

describe('AradAiController CreateOrGetDemoToken (e2e)', () => {
  let app: INestApplication;
  let mockToken;
  const mockCheckTokenDto = {
    demoToken: 'true',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    mockToken = await getAuthToken();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ai/createOrGetDemoToken/:token (GET)', () => {
    it('should check a validation token', async () => {
      return request(app.getHttpServer())
        .get(`/ai/createOrGetDemoToken`)
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
      // .then((response) => {
      //   expect(response.body).toEqual(mockCheckTokenDto);
      // });
    });
  });
});
