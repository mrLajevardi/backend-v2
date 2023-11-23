import { Province } from '../../../../infrastructure/database/entities/Province';
import { isArray } from 'class-validator';
import { City } from '../../../../infrastructure/database/entities/City';

export class ProvinceResultDtoFormat {
  id: number;
  provinceName: string | null;
  phoneCode: string | null;
  cities: CityResultDtoFormat[] | null;
}
export class ProvinceResultDto {
  collection(data: Province[]): ProvinceResultDtoFormat[] {
    return data.map((item: Province) => {
      return this.toArray(item);
    });
  }

  toArray(item: Province): ProvinceResultDtoFormat {
    return {
      id: item.id,
      provinceName: item.provinceName,
      phoneCode: item.phoneCode,
      cities:
        isArray(item.cities) && item.cities.length > 0
          ? new CityResultDto().collection(item.cities)
          : null,
    };
  }
}

export class CityResultDtoFormat {
  id: number;
  cityName: string;
}

export class CityResultDto {
  collection(data: any[]): CityResultDtoFormat[] {
    return data.map((item) => {
      return this.toArray(item);
    });
  }

  toArray(item: City): CityResultDtoFormat {
    return {
      id: item.id,
      cityName: item.cityName,
    };
  }
}
