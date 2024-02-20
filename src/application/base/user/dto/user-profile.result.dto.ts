import { User } from '../../../../infrastructure/database/entities/User';
import {
  CompanyResultDto,
  CompanyResultDtoFormat,
} from '../../company/dto/company.result.dto';
import { isNil } from 'lodash';
import { ApiResponseProperty } from '@nestjs/swagger';
import { CompanyLetterStatusEnum } from '../enum/company-letter-status.enum';

export class UserProfileResultDtoFormat {
  @ApiResponseProperty({
    type: String,
    example: 'user name',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'user family',
  })
  family: string;

  @ApiResponseProperty({
    type: Date,
    example: new Date(),
  })
  birthDate: Date;

  @ApiResponseProperty({
    type: String,
    example: '09124567890',
  })
  phoneNumber: string;

  @ApiResponseProperty({
    type: String,
    example: 'info@aradcloud.com',
  })
  email: string;

  @ApiResponseProperty({
    type: Boolean,
    example: false,
  })
  emailVerified: boolean;

  @ApiResponseProperty({
    type: String,
    example: '0372337031',
  })
  personalCode: string;

  @ApiResponseProperty({
    type: Array(Number),
    example: [2, 3],
  })
  twoFactorAuthenticate: number[];

  @ApiResponseProperty({
    type: Boolean,
    example: false,
  })
  personalVerification: boolean;

  @ApiResponseProperty({
    type: Boolean,
    example: false,
  })
  companyOwner: boolean;

  @ApiResponseProperty({
    type: String,
    example: '2F0F379A-92A8-EE11-A56C-005056A89991',
  })
  avatar: string;

  @ApiResponseProperty({
    type: String,
    example: '2F0F379A-92A8-EE11-A56C-005056A89991',
  })
  companyLetter: string;

  @ApiResponseProperty({
    type: CompanyLetterStatusEnum,
    example: CompanyLetterStatusEnum.None,
    enum: CompanyLetterStatusEnum,
  })
  companyLetterStatus: CompanyLetterStatusEnum;

  @ApiResponseProperty({
    type: CompanyResultDtoFormat,
  })
  company: CompanyResultDtoFormat | null;
}

export class UserProfileResultDto {
  collection(data: User[]): UserProfileResultDtoFormat[] {
    return data.map((item: User) => {
      return this.toArray(item);
    });
  }

  toArray(item: User): UserProfileResultDtoFormat {
    return {
      // id: item.id,
      name: item.name,
      family: item.family,
      birthDate: item.birthDate,
      phoneNumber: item.phoneNumber,
      email: item.email,
      emailVerified: item.emailVerified,
      personalCode: item.personalCode,
      personalVerification: item.personalVerification,
      companyOwner: item.companyOwner,
      twoFactorAuthenticate: this.parseTwoFactorTypes(item.twoFactorAuth),
      avatar: !isNil(item.avatar) ? item.avatar.guid : null,
      companyLetter: !isNil(item.companyLetter)
        ? item.companyLetter.guid
        : null,
      companyLetterStatus: item.companyLetterStatus,
      company: !isNil(item.company)
        ? new CompanyResultDto().toArray(item.company)
        : null,
    };
  }

  parseTwoFactorTypes(twoFactorTypes: string): number[] {
    return String(twoFactorTypes)
      .split(',')
      .map((item) => Number(item));
  }
}
