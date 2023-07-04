import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function getAuthToken(): Promise<string> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  await app.init();
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ username: 'back2-test', password: 'abc123' });
  const token = response.body.access_token;

  await app.close();
  return token;
}
