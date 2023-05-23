import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbTestEntities } from './entityImporter/orm-test-entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: "sqlite",
        database: ":memory:",
        autoLoadEntities : true,
        entities: dbTestEntities,
        synchronize: true,
    } as TypeOrmModuleOptions ),
  ],
})
export class TestDatabaseModule {}
