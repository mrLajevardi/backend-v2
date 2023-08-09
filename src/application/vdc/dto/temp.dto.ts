import { ApiProperty } from '@nestjs/swagger';

export class TempDto {
  @ApiProperty()
  name: string;
}
