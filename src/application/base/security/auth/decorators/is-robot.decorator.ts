import { SetMetadata } from '@nestjs/common';

export const IS_ROBOT_KEY = 'isRobot';
export const IsRobot = () => SetMetadata(IS_ROBOT_KEY, true);
