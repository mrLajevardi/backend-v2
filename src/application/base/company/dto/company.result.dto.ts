import {Company} from "../../../../infrastructure/database/entities/Company";
import {CityResultDto, ProvinceResultDto} from "./province.result.dto";

export class CompanyResultDto {

    collection(data: Company[]){
        return data.map((item : Company) => {
            return this.toArray(item)
        })
    }

    toArray(item: Company){
        return {
            id: item.id ,
            companyName: item.companyName ,
            companyPhoneNumber: item.companyPhoneNumber ,
            companyPostalCode: item.companyPostalCode ,
            companyAddress: item.companyAddress ,
            companyCode: item.companyCode ,
            economyCode: item.economyCode ,
            submittedCode: item.submittedCode ,
            province: item.province !== undefined ? (new ProvinceResultDto).toArray(item.province) : null,
            city: item.city !== undefined ? (new CityResultDto).toArray(item.city) : null,
        }
    }
}