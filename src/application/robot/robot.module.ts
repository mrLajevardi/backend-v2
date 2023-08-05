import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';

@Module({
  providers: [RobotService],
  controllers: [RobotController],
})
export class RobotModule {}
