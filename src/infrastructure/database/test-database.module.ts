import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbTestEntities } from './entityImporter/orm-test-entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        type: "sqlite",
        database: ":memory:",
        autoLoadEntities : true,
        entities: dbTestEntities,
        synchronize: true,
    } as TypeOrmModuleOptions ),
  ],
})
export class TestDatabaseModule {}
