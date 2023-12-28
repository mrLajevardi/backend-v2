import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class ChangeAutoPaidStateDto {
  @ApiProperty()
  @IsBoolean()
  autoPaid: boolean;
}
