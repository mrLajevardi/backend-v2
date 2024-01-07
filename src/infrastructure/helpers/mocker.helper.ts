import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessToken } from '../database/entities/AccessToken';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';

export function mocker(token) {
  console.log('🦪🍻');
  const providerList = [
    {
      provide: getRepositoryToken(AccessToken),
      useClass: Repository,
    },
  ];
  for (const provider of providerList) {
    if (token === provider.provide) {
      return provider;
    }
  }
  return createMock(token);
}
