import { ApiProperty } from '@nestjs/swagger';

export class TaskReturnDto {
  id?: string;

  @ApiProperty({ type: String, required: true })
  taskId: string;

  token?: string;
}
