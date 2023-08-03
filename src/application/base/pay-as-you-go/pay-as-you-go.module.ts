import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { PayAsYouGoService } from './pay-as-you-go.service';

@Module({
    imports: [
        DatabaseModule,
        CrudModule,
    ],
    providers: [
        PayAsYouGoService
    ],
    exports: [
        PayAsYouGoService
    ]
})
export class PayAsYouGoModule {}
