import { Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { IsRobot } from '../../base/security/auth/decorators/is-robot.decorator';
import { Public } from '../../base/security/auth/decorators/ispublic.decorator';
import { RobotAuthGuard } from '../../base/security/auth/guard/robot-auth.guard';
import { RobotService } from '../service/robot.service';

@Controller('robot')
@ApiTags('Robot')
@ApiBearerAuth()
@IsRobot()
@Public()
@UseGuards(RobotAuthGuard)
export class RobotController {
  constructor(private readonly service: RobotService) {}

  @Put('sendEmailToExpiredServices')
  async sendEmailToExpiredServices() {
    try {
      await this.service.checkService.sendEmailToExpiredServices();
    } catch (err) {
      console.log(err);
    }
    await this.service.checkService.disableAndDeleteService();
  }

  @Put('paygInvoiceRobot')
  async paygInvoiceRobot() {
    await this.service.paygInvoice.paygInvoiceRobot();
  }

  @Put('vgpuPayAsYouGoRobot')
  async vgpuPayAsYouGoRobot() {
    await this.service.vgpuPayAsYouGo.vgpuPayAsYouGoRobot;
  }

  @Post('checkPaygServices')
  async paygRobot(): Promise<void> {
    return this.service.paygRobotService.checkVmEvents();
  }
}
