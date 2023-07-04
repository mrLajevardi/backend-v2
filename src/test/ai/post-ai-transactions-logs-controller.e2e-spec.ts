import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('AradAiController AiTransactionsLogs (e2e)', () => {
  let app: INestApplication;
  const mockCreateAiTransactionsLogsDto = {
    description: 'emotionRecognition',
    request: 'http://0.0.0.0:3000/emotionRecognition',
    itemType: 'emotionRecognition',
    body: '{"text": ""}',
    response: '{some thing}',
    method: 'POST',
    codeStatus: 200,
    methodName: 'emotionRecognition',
    ip: '127.0.0.1',
    dateTime: new Date(),
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA2LTI2VDA4OjI3OjAwLjk4M1oiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MzAsImV4cGlyZURhdGUiOiIyMDIzLTA3LTI2VDA4OjI3OjAwLjk4M1oiLCJjb3N0UGVyUmVxdWVzdCI6NTAsImNvc3RQZXJNb250aCI6MCwiaWF0IjoxNjg3NzY4MDIxfQ.pyG4zAWjDV1MsBi67-I_x0C-w_7Gm0JzKb0HUsFPs-c',
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

  describe('/aiTransactionsLogs (POST)', () => {
    it('should create a new transaction log', async () => {
      return request(app.getHttpServer())
        .post('/ai/aiTransactionsLogs')
        .send(mockCreateAiTransactionsLogsDto)
        .expect(201);
    });
  });
});
