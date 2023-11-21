import { Company } from '../../../../infrastructure/database/entities/Company';
import {
  CityResultDto,
  CityResultDtoFormat,
  ProvinceResultDto,
  ProvinceResultDtoFormat,
} from './province.result.dto';

export class CompanyResultDtoFormat {
  id: number;
  companyName: string | null;
  companyPhoneNumber: string | null;
  companyPostalCode: string | null;
  companyAddress: string | null;
  companyCode: string | null;
  economyCode: string | null;
  submittedCode: string | null;
  province: ProvinceResultDtoFormat | null;
  city: CityResultDtoFormat | null;
}

export class CompanyResultDto {
  collection(data: Company[]) {
    return data.map((item: Company) => {
      return this.toArray(item);
    });
  }

  collection(data: Company[]): CompanyResultDtoFormat[] {
    return data.map((item: Company) => {
      return this.toArray(item);
    });
  }

  toArray(item: Company): CompanyResultDtoFormat {
    return {
      id: item.id,
      companyName: item.companyName,
      companyPhoneNumber: item.companyPhoneNumber,
      companyPostalCode: item.companyPostalCode,
      companyAddress: item.companyAddress,
      companyCode: item.companyCode,
      economyCode: item.economyCode,
      submittedCode: item.submittedCode,
      province:
        item.province !== undefined
          ? new ProvinceResultDto().toArray(item.province)
          : null,
      city:
        item.city !== undefined ? new CityResultDto().toArray(item.city) : null,
    };
  }
}
