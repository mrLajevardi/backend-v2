import { Injectable } from '@nestjs/common';
import { CompanyTableService } from '../../crud/company-table/company-table.service';
import { ProvinceTableService } from '../../crud/province-table/province-table.service';
import { Province } from '../../../../infrastructure/database/entities/Province';
import {
  ProvinceResultDto,
  ProvinceResultDtoFormat,
} from '../dto/province.result.dto';
import { UpdateCompanyDto } from '../../crud/company-table/dto/update-company.dto';
import { CompanyUpdatePhoneNumberDto } from '../dto/company-update-phone-number.dto';
import { CompanyUpdateAddressDto } from '../dto/company-update-address.dto';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { Connection } from 'typeorm';
import { Company } from '../../../../infrastructure/database/entities/Company';
import { CompanyResultDto } from '../dto/company.result.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyTable: CompanyTableService,
    private readonly provinceTable: ProvinceTableService,
    private readonly connection: Connection,
  ) {}

  async getProvinces(): Promise<ProvinceResultDtoFormat[]> {
    const provinces: Province[] = await this.provinceTable.find({
      relations: ['cities'],
    });

    return new ProvinceResultDto().collection(provinces);
  }

  async getSubPhones(): Promise<ProvinceResultDtoFormat[]> {
    const provinces: Province[] = await this.provinceTable.find();

    return new ProvinceResultDto().collection(provinces);
  }

  async updatePhoneNumber(
    companyId: number,
    data: CompanyUpdatePhoneNumberDto,
  ) {
    const companyData: UpdateCompanyDto = {
      companyPhoneNumber: data.phoneNumber,
    };

    const updatingCompany = await this.companyTable.update(
      companyId,
      companyData,
    );

    return await this.companyTable.findOne({
      where: { id: companyId },
      relations: ['province', 'city', 'companyLogo'],
    });
  }

  async updateAddress(companyId: number, data: CompanyUpdateAddressDto) {
    const companyData: UpdateCompanyDto = {
      companyPostalCode: data.companyPostalCode,
      companyAddress: data.companyAddress,
      provinceId: data.provinceId,
      cityId: data.cityId,
    };

    const updatingCompany = await this.companyTable.update(
      companyId,
      companyData,
    );

    return await this.companyTable.findOne({
      where: { id: companyId },
      relations: ['province', 'city', 'companyLogo'],
    });
  }

  async uploadLogo(
    options: SessionRequest,
    companyId: number,
    file: Express.Multer.File,
  ): Promise<any> {
    const fileStream = file.buffer;
    const fileName = Date.now().toString() + file.originalname;

    const logo = await this.connection
      .createQueryBuilder()
      .insert()
      .into('FileUpload')
      .values({ fileStream: fileStream, name: fileName })
      .returning('Inserted.stream_id')
      .execute();

    const updateCompanyData: UpdateCompanyDto = {
      LogoId: logo.raw[0].stream_id,
    };

    const updatedCompany: Company = await this.companyTable.update(
      companyId,
      updateCompanyData,
    );

    const company: Company = await this.companyTable.findOne({
      where: { id: companyId },
      relations: ['companyLogo', 'province', 'city'],
    });

    return new CompanyResultDto().toArray(company);
  }
}
