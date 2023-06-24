import { IsDate, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupMappingsDto {
  @IsDate()
  createDate: Date;

  @IsInt({ message: 'GroupID must be an integer' })
  @IsPositive({ message: 'GroupID must be a positive number' })
  @IsNotEmpty({ message: 'GroupID is required' })
  groupId: number;

  @IsInt({ message: 'UserID must be an integer' })
  @IsPositive({ message: 'UserID must be a positive number' })
  @IsNotEmpty({ message: 'UserID is required' })
  userId: number;
}
