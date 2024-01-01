import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserGroupsDto {
  @ApiProperty({ type: [Number] })
  groups: number[];
}
