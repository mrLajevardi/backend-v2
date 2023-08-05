import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { IsRobot } from '../base/security/auth/decorators/is-robot.decorator';
import { Public } from '../base/security/auth/decorators/ispublic.decorator';
import { RobotAuthGuard } from '../base/security/auth/guard/robot-auth.guard';

@Controller('robot')
@ApiTags('Robot')
@ApiBearerAuth()
@IsRobot()
@UseGuards(RobotAuthGuard)
export class RobotController {
  @Get('test')
  test() {
    return 'this is for test';
  }
}
