import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { getAuthToken } from '../test.helper';

describe('AradAiController getAradAiDashboard(e2e)', () => {
  let app: INestApplication;
  let mockToken;
  const mockServiceInstanceId = '7F56235C-BFA9-4C30-BA5A-9EA551B0A579';
  const mockStartDate = '2023-06-01';
  const mockEndDate = '2023-07-31';
  const mockGetAradAiDashoardChartDto = [
    {
      Date: '2023-06-01',
      numberOfUses: 10,
    },
    {
      Date: '2023-06-02',
      numberOfUses: 20,
    },
  ];

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

  describe('/aradAiDashoardChart/:serviceInstanceId/:startDate/:endDate (GET)', () => {
    it('should get dashboard chart', async () => {
      return request(app.getHttpServer())
        .get(
          `/ai/aradAiDashoardChart/${mockServiceInstanceId}/${mockStartDate}/${mockEndDate}`,
        )
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
      // .then((response) => {
      //   expect(response.body).toEqual(mockGetAradAiDashoardChartDto);
      // });
    });
  });
});
