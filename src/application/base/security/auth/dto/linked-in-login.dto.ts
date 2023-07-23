import { ApiProperty } from '@nestjs/swagger';

export class LinkedInLoginDto {
  @ApiProperty()
  code: string;
}
