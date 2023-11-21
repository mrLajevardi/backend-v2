import {Province} from "../../../../infrastructure/database/entities/Province";
import {isArray} from "class-validator";
import {City} from "../../../../infrastructure/database/entities/City";

export class ProvinceResultDto {
    collection(data: Province[]){
        return data.map((item : Province) => {
            return this.toArray(item)
        })
    }
    toArray(item: Province){
        return {
            id: item.id ,
            provinceName : item.provineName ,
            phoneCode: item.phoneCode,
            cities: isArray(item.cities) && item.cities.length > 0 ? (new CityResultDto).collection(item.cities) : null
        }
    }

}

export class CityResultDto {
    collection(data: any[]){
        return data.map((item) => {
            return this.toArray(item)
        })
    }

    toArray(item: City){
        return {
            id: item.id ,
            cityName : item.cityName
        }
    }
}