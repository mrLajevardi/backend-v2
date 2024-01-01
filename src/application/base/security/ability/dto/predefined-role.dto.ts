import { ApiProperty } from '@nestjs/swagger';

export class PredefinedRoleDto {
  @ApiProperty()
  name: string;
}
