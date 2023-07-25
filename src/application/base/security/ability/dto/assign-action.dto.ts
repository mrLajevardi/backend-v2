import { ApiProperty } from '@nestjs/swagger';
import { Action } from '../enum/action.enum';

export class AssignActionDto {
  @ApiProperty({ enum: Action, enumName: 'Action' })
  action: Action;

  @ApiProperty()
  on: string;

  @ApiProperty()
  userId: number;
}
