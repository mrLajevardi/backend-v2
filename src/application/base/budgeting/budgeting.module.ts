import {forwardRef, Module} from '@nestjs/common';
import {BudgetingService} from './service/budgeting.service';
import {BudgetingController} from './controller/budgeting.controller';
import {DatabaseModule} from '../../../infrastructure/database/database.module';
import {CrudModule} from '../crud/crud.module';
import {UserInfoService} from '../user/service/user-info.service';
import {InvoicesModule} from '../invoice/invoices.module';
import {VdcModule} from '../../vdc/vdc.module';
import {AuthModule} from "../security/auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        DatabaseModule,
        CrudModule,
        AuthModule,
        forwardRef(() => UserModule),
        // InvoicesModule,
        forwardRef(() => InvoicesModule),
        forwardRef(() => VdcModule),
    ],
    controllers: [BudgetingController],
    providers: [BudgetingService],
    exports: [BudgetingService],
})
export class BudgetingModule {
}
