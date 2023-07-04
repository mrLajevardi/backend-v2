import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('AradAiController CheckToken (e2e)', () => {
  let app: INestApplication;
  const mockAiToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA2LTI2VDA4OjI3OjAwLjk4M1oiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MzAsImV4cGlyZURhdGUiOiIyMDIzLTA3LTI2VDA4OjI3OjAwLjk4M1oiLCJjb3N0UGVyUmVxdWVzdCI6NTAsImNvc3RQZXJNb250aCI6MCwiaWF0IjoxNjg3NzY4MDIxfQ.pyG4zAWjDV1MsBi67-I_x0C-w_7Gm0JzKb0HUsFPs-c';
  const mockCheckTokenDto = {
    tokenValidity: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('CheckToken/:token (GET)', () => {
    it('should check a validation token', async () => {
      return request(app.getHttpServer())
        .get(`/ai/CheckToken/${mockAiToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(mockCheckTokenDto);
        });
    });
  });
});
