import { Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { IsRobot } from "../../base/security/auth/decorators/is-robot.decorator";
import { Public } from "../../base/security/auth/decorators/ispublic.decorator";
import { RobotAuthGuard } from "../../base/security/auth/guard/robot-auth.guard";
import { RobotService } from "../service/robot.service";

@Controller("robot")
@ApiTags("Robot")
@ApiBearerAuth()
@IsRobot()
@UseGuards(RobotAuthGuard)
export class RobotController {
  constructor(private readonly service: RobotService) {}

  @Get("test")
  test() {
    return "this is for test";
  }

  @Put("sendEmailToExpiredServices")
  async sendEmailToExpiredServices() {
    await this.service.checkService.sendEmailToExpiredServices();
    await this.service.checkService.disableAndDeleteService();
  }

  @Get("paygInvoiceRobot")
  async paygInvoiceRobot() {
    await this.service.paygInvoice.paygInvoiceRobot();
  }

  @Get("vgpuPayAsYouGoRobot")
  async vgpuPayAsYouGoRobot(){
    await this.service.vgpuPayAsYouGo.vgpuPayAsYouGoRobot();
  }
}
