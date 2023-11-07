import { ApiProperty } from '@nestjs/swagger';

export class TaskReturnDto {
  id?: string;

  @ApiProperty({ type: String })
  taskId: string;

  token?: string;
}
