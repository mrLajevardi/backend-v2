import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HookTypeEnum } from '../enum/hook-type.enum';
import { AccessType } from '../enum/access-type.enum';

export class CreateACLDto {
  model: string | null;

  property: string | null;

  accessType: AccessType;

  can: boolean;

  roleId: string;

  hookType: HookTypeEnum;
}
