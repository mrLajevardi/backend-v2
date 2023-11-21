import {Module} from '@nestjs/common';
import {ProvinceTableService} from './province-table.service';
import {DatabaseModule} from "../../../../infrastructure/database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [ProvinceTableService],
    exports: [ProvinceTableService]
})
export class ProvinceTableModule {
}
