import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class TaskReturnDto {
  id?: string;

  @ApiResponseProperty({
    type: String,
  })
  @ApiProperty({ type: String })
  taskId: string;

  token?: string;
}
