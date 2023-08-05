import { Module } from "@nestjs/common";
import { RobotService } from "./service/robot.service";
import { RobotController } from "./controller/robot.controller";
import { CheckServiceService } from "./service/check-service.service";
import { PaygInvoiceService } from "./service/payg-invoice.service";
import { VgpuPayAsYouGoService } from "./service/vgpu-pay-as-you-go.service";

@Module({
  providers: [
    RobotService,
    CheckServiceService,
    PaygInvoiceService,
    VgpuPayAsYouGoService,
  ],
  controllers: [
    RobotController,
  ],
})
export class RobotModule {}
