import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbEntities } from './orm-entities';
import { dbTestEntities } from './orm-test-entities';



export const ormconfig = {
    primary: 
    {
      "type": "mssql",
      "host": "172.20.34.34",
      "port": 1433,
      "username": "dev",
      "password": "U5h]J7Aj$AY-",
      "database": "Arad3",
      "autoLoadEntities" : true,
      "entities": dbEntities,
      "synchronize": false,
      "extra":{
        "trustServerCertificate": true,
      }
    } as TypeOrmModuleOptions,
    test: 
    {
      "type": "sqlite",
      "database": ":memory:",
      "autoLoadEntities" : true,
      "entities": dbTestEntities,
      "synchronize": true,
    } as TypeOrmModuleOptions
  }
