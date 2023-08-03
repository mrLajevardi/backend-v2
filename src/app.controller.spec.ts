import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './application/base/security/auth/service/auth.service';
import { UserService } from './application/base/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './application/base/security/auth/dto/login.dto';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/security/auth/guard/jwt-auth.guard';
import { TestDataService } from './infrastructure/database/test-data.service';
import { UserTableService } from './application/base/crud/user-table/user-table.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CrudModule } from './application/base/crud/crud.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { PaymentModule } from './application/payment/payment.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './application/ai/ai.module';
import { GroupModule } from './application/base/group/group.module';
import { NotificationModule } from './application/base/notification/notification.module';
import { OrganizationModule } from './application/base/organization/organization.module';
import { AbilityModule } from './application/base/security/ability/ability.module';
import { AuthModule } from './application/base/security/auth/auth.module';
import { SecurityToolsModule } from './application/base/security/security-tools/security-tools.module';
import { ServiceModule } from './application/base/service/service.module';
import { SessionsModule } from './application/base/sessions/sessions.module';
import { TasksModule } from './application/base/tasks/tasks.module';
import { TicketModule } from './application/base/ticket/ticket.module';
import { TransactionsModule } from './application/base/transactions/transactions.module';
import { UserModule } from './application/base/user/user.module';
import { EdgeGatewayModule } from './application/edge-gateway/edge-gateway.module';
import { NatModule } from './application/nat/nat.module';
import { NetworksModule } from './application/networks/networks.module';
import { VastModule } from './application/vast/vast.module';
import { VdcModule } from './application/vdc/vdc.module';
import { VgpuModule } from './application/vgpu/vgpu.module';
import { VmModule } from './application/vm/vm.module';
import { OauthService } from './application/base/security/auth/service/oauth.service';

describe('AppController', () => {
  let controller: AppController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    controller = module.get<AppController>(AppController);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Hello World!');
    });
  });
});
