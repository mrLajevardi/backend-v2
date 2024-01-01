import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_ROBOT_KEY = 'isRobot';
export const IsRobot = (): CustomDecorator<string> =>
  SetMetadata(IS_ROBOT_KEY, true);
