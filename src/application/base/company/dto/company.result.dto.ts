import { Company } from '../../../../infrastructure/database/entities/Company';
import {
  CityResultDto,
  CityResultDtoFormat,
  ProvinceResultDto,
  ProvinceResultDtoFormat,
} from './province.result.dto';
import { isNil } from 'lodash';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CompanyResultDtoFormat {
  @ApiResponseProperty({
    type: Number,
    example: 12,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'testName',
  })
  companyName: string | null;

  @ApiResponseProperty({
    type: String,
    example: '02132659874',
  })
  companyPhoneNumber: string | null;

  @ApiResponseProperty({
    type: String,
    example: '134679852',
  })
  companyPostalCode: string | null;

  @ApiResponseProperty({
    type: String,
    example: 'test Address',
  })
  companyAddress: string | null;

  @ApiResponseProperty({
    type: String,
    example: '134679852',
  })
  companyCode: string | null;

  @ApiResponseProperty({
    type: String,
    example: '134679852',
  })
  economyCode: string | null;

  @ApiResponseProperty({
    type: String,
    example: '134679852',
  })
  submittedCode: string | null;

  @ApiResponseProperty({
    type: String,
    example: 'hugdf-dgfgdfgd-dfgdfgdfg-dfgdfg',
  })
  companyLogo: string | null;

  @ApiResponseProperty({
    type: ProvinceResultDtoFormat,
  })
  province: ProvinceResultDtoFormat | null;

  @ApiResponseProperty({
    type: CityResultDtoFormat,
  })
  city: CityResultDtoFormat | null;
}

export class CompanyResultDto {
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
      companyLogo:
        item.companyLogo !== undefined && item.companyLogo !== null
          ? item.companyLogo.guid
          : null,
      province: !isNil(item.province)
        ? new ProvinceResultDto().toArray(item.province)
        : null,
      city: !isNil(item.city) ? new CityResultDto().toArray(item.city) : null,
    };
  }
}
