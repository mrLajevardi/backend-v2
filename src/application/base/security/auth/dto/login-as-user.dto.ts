import { ApiProperty } from '@nestjs/swagger';

export class LoginAsUserDto {

  @ApiProperty()
  userId: number;
}
