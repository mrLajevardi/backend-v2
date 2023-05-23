import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbEntities } from './entityImporter/orm-entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/infrastructure/configs/database.json', 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use the ConfigService
      useFactory: (configService: ConfigService) => ({
        "type": configService.get<string>('DB_TYPE'),
        "host": configService.get<string>('DB_HOST'),
        "port": configService.get<number>('DB_PORT'),
        "username": configService.get<string>('DB_USERNAME'),
        "password": configService.get<string>('DB_PASSWORD'),
        "database": configService.get<string>('DB_NAME'),
        entities: dbEntities,
        extra: {
          trustServerCertificate: true,
        },
      } as TypeOrmModuleOptions ),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
