import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { getAuthToken } from '../test.helper';
// import { type } from '@nestjs/microservices';

describe('AiController AiPlans (e2e)', () => {
  let app: INestApplication;
  let mockToken;

  const mockGetPlanItemsDto = {
    Code: 'plan1',
    AdditionRatio: 0.5,
    Description: 'description for plan1',
    Condition: 'some condition',
    AdditionAmount: 100,
    CostPerRequest: 50,
    Items: [],
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

  describe('/aiPlans (GET)', () => {
    it('should get AI plans', async () => {
      return request(app.getHttpServer())
        .get(`/ai/aiPlans`)
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
      // .then((response) => {
      //   expect(response.body).toEqual([mockGetPlanItemsDto]);
      // });
    });
  });
});
