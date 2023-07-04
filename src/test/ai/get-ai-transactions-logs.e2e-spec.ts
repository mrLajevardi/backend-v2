import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { getAuthToken } from '../test.helper';
// import { type } from '@nestjs/microservices';

describe('AiController AiTransactionsLog (e2e)', () => {
  let app: INestApplication;
  let mockToken;
  const serviceInstanceId = `7F56235C-BFA9-4C30-BA5A-9EA551B0A579`;
  const mockGetPlanItemsDto = {
    aiTransactionsLogs: [
      {
        id: '1',
        serviceInstanceId: '1',
        dateTime: new Date(),
        description: 'test',
        request: 'test',
        body: 'test',
        response: 'test',
        method: 'test',
        codeStatus: 200,
        methodName: 'test',
        ip: '127.0.0.1',
      },
    ],
    countAll: 1,
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

  describe('/aiTransactionsLogs (GET)', () => {
    it('should get AI TransactionsLogs', async () => {
      return request(app.getHttpServer())
        .get(`/ai/aiTransactionsLogs/${serviceInstanceId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
      // .then((response) => {
      //   expect(response.body).toEqual([mockGetPlanItemsDto]);
      // });
    });
  });
});
