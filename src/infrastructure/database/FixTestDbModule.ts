/*
This module is responsible for proper loading of main database of application
Importing this module in the app.module.ts is sufficient for loading the databse. 

*/

import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Acl } from './entities/Acl';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      isGlobal: true,
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      entities: [Acl],
      synchronize: true,
    } as TypeOrmModuleOptions),
    TypeOrmModule.forFeature([Acl]),
  ],
  exports: [TypeOrmModule],
})
export class FixTestDbModule {}
