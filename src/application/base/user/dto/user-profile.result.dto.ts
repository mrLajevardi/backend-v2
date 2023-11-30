import { User } from '../../../../infrastructure/database/entities/User';
import {
  CompanyResultDto,
  CompanyResultDtoFormat,
} from '../../company/dto/company.result.dto';
import { isNil } from 'lodash';

export class UserProfileResultDtoFormat {
  name: string;
  family: string;
  birthDate: Date;
  phoneNumber: string;
  email: string;
  emailVerified: boolean;
  personalCode: string;
  personalVerification: boolean;
  companyOwner: boolean;
  avatar: string;
  companyLetter: string;
  companyLetterStatus: number;
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
      avatar: !isNil(item.avatar) ? item.avatar.streamId : null,
      companyLetter: !isNil(item.companyLetter)
        ? item.companyLetter.streamId
        : null,
      companyLetterStatus: item.companyLetterStatus,
      company: !isNil(item.company)
        ? new CompanyResultDto().toArray(item.company)
        : null,
    };
  }
}
