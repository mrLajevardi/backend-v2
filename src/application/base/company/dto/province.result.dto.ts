import { Province } from '../../../../infrastructure/database/entities/Province';
import { isArray } from 'class-validator';
import { City } from '../../../../infrastructure/database/entities/City';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CityResultDtoFormat {
  @ApiResponseProperty({
    type: Number,
    example: 25,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'qom',
  })
  cityName: string;
}

export class ProvinceResultDtoFormat {
  @ApiResponseProperty({
    type: Number,
    example: 15,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'qom',
  })
  provinceName: string | null;

  @ApiResponseProperty({
    type: String,
    example: '025',
  })
  phoneCode: string | null;

  @ApiResponseProperty({
    type: Array(CityResultDtoFormat),
  })
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
