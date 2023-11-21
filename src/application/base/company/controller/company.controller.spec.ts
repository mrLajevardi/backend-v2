import { Test, TestingModule } from '@nestjs/testing';
import {CompanyController} from './company.controller';
import {CompanyService} from "../service/company.service";
import {DatabaseModule} from "../../../../infrastructure/database/database.module";
import {CrudModule} from "../../crud/crud.module";
import {LoggerModule} from "../../../../infrastructure/logger/logger.module";
import {PaymentModule} from "../../../payment/payment.module";
import {JwtModule} from "@nestjs/jwt";
import {NotificationModule} from "../../notification/notification.module";
import {SecurityToolsModule} from "../../security/security-tools/security-tools.module";

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      imports: [
        DatabaseModule,
        CrudModule,
      ],
      providers: [CompanyService],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
