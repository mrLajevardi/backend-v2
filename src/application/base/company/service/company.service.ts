import {Injectable} from '@nestjs/common';
import {CompanyTableService} from "../../crud/company-table/company-table.service";
import {ProvinceTableService} from "../../crud/province-table/province-table.service";
import {Province} from "../../../../infrastructure/database/entities/Province";
import {ProvinceResultDto} from "../dto/province.result.dto";
import {UpdateCompanyDto} from "../../crud/company-table/dto/update-company.dto";
import {CompanyUpdatePhoneNumberDto} from "../dto/company-update-phone-number.dto";
import {CompanyUpdateAddressDto} from "../dto/company-update-address.dto";

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyTable: CompanyTableService,
        private readonly provinceTable: ProvinceTableService
    ) {
    }

    async getProvinces(): Promise<{}> {
        const provinces: Province[] = await this.provinceTable.find({relations: ['cities']})

        return (new ProvinceResultDto).collection(provinces);
    }

    async getSubPhones(): Promise<{}> {
        const provinces: Province[] = await this.provinceTable.find()

        return (new ProvinceResultDto).collection(provinces);
    }

    async updatePhoneNumber(companyId: number, data: CompanyUpdatePhoneNumberDto) {

        const companyData: UpdateCompanyDto = {
            companyPhoneNumber: data.phoneNumber
        };

        return await this.companyTable.updateWithOptions(companyData, {reload: true} , {where: {id: companyId} , relations:['province' , 'city']})
    }

    async updateAddress(companyId: number, data: CompanyUpdateAddressDto) {

        const companyData: UpdateCompanyDto = {
            companyPostalCode: data.companyPostalCode,
            companyAddress: data.companyAddress,
            provinceId: data.provinceId,
            cityId: data.cityId,
        };

        return await this.companyTable.updateWithOptions(companyData, {reload: true} , {where: {id: companyId} , relations:['province' , 'city']})
    }

}
