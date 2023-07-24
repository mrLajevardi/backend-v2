import { Module } from '@nestjs/common';
import { VmService } from './service/vm.service';

@Module({
    imports: [],
    controllers: [],
    providers: [VmService],
    exports: []
})
export class VmModule {}
