import { Module } from '@nestjs/common';
import { BaseException } from './base-exception';
import { BaseFactoryException } from './base-factory.exception';

@Module({
  providers: [BaseException, BaseFactoryException],
  exports: [BaseFactoryException, BaseException],
})
export class BaseExceptionModule {}
