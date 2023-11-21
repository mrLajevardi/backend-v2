import { User } from '../../../../infrastructure/database/entities/User';
import { CompanyResultDto } from '../../company/dto/company.result.dto';

export class UserProfileResultDto {
  collection(data: User[]) {
    return data.map((item: User) => {
      return this.toArray(item);
    });
  }
  toArray(item: User) {
    return {
      // id: item.id,
      name: item.name,
      family: item.family,
      birthDate: item.birthDate,
      phoneNumber: item.phoneNumber,
      personalCode: item.personalCode,
      personalVerification: item.personalVerification,
      companyOwner: item.companyOwner,
      company:
        item.company !== undefined && item.company !== null
          ? new CompanyResultDto().toArray(item.company)
          : null,
    };
  }
}
