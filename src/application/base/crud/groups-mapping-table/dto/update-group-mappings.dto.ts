import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateGroupMappingsDto {
  @IsOptional()
  @IsDate()
  createDate?: Date;

  @IsOptional()
  @IsInt({ message: 'GroupID must be an integer' })
  @IsPositive({ message: 'GroupID must be a positive number' })
  groupId?: number;

  @IsOptional()
  @IsInt({ message: 'UserID must be an integer' })
  @IsPositive({ message: 'UserID must be a positive number' })
  userId?: number;
}
