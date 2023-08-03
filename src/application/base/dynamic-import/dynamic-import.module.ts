import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { initServices } from '../task-manager/taskFactory';

@Global()
@Module({})
export class DynamicImportModule {
  static async registerAsync(providers: string[]): Promise<DynamicModule> {
    console.log(providers[0])
    const dependencies = await initServices()
    return {
      module: DynamicImportModule,
      providers: dependencies,
      exports: dependencies,
    };
  }
}
