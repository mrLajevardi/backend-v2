import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyTableService } from '../../crud/company-table/company-table.service';
import { ProvinceTableService } from '../../crud/province-table/province-table.service';
import { ProvinceResultDtoFormat } from '../dto/province.result.dto';
import { isNil } from 'lodash';
import { UpdateCompanyDto } from '../../crud/company-table/dto/update-company.dto';
import { CompanyUpdatePhoneNumberDto } from '../dto/company-update-phone-number.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CompanyUpdateAddressDto } from '../dto/company-update-address.dto';
import { TestBed } from '@automock/jest';
// import { Connection } from 'typeorm';

describe('CompanyService', () => {
  const ExpectedFormat = {
    id: expect.any(Number),
    companyName: expect.any(String),
    companyPhoneNumber: expect.any(String),
    companyPostalCode: expect.any(String),
    companyAddress: expect.any(String),
    companyCode: expect.any(String),
    economyCode: expect.any(String),
    submittedCode: expect.any(String),
    companyLogo: expect.any(String),
    province: expect.any(Object),
    city: expect.any(Object),
  };
  let service: CompanyService;
  const mockCityItem = {
    id: 267,
    cityName: 'قم',
  };
  const mockProvinceItem = {
    id: 19,
    provinceName: 'قم',
    phoneCode: '025',
    guid: '2D9E8529-F485-EE11-A56A-005056A89991',
    cities: null,
  };
  const mockCompanyData = {
    id: 122,
    companyName: 'test name',
    companyCode: '123123123',
    submittedCode: '123123123',
    economyCode: '123123123',
    companyPhoneNumber: '021-37748547',
    companyPostalCode: '21123121121',
    companyAddress: 'tehran test',
    LogoId: '1231-554544-54454-544545',
    companyLogo: '1231-554544-54454-544545',
    cityId: mockCityItem.id,
    provinceId: mockProvinceItem.id,
    city: mockCityItem,
    province: mockProvinceItem,
  };
  const mockProvinceListWithCity = [
    {
      id: 19,
      provinceName: 'قم',
      phoneCode: '025',
      guid: '2D9E8529-F485-EE11-A56A-005056A89991',
      cities: [mockCityItem],
    },
  ];

  const mockProvinceList = [
    {
      id: 19,
      provinceName: 'قم',
      phoneCode: '025',
      guid: '2D9E8529-F485-EE11-A56A-005056A89991',
      cities: null,
    },
  ];
  const mockProvinceServiceTable = {
    find: jest.fn((options?) => {
      if (
        !isNil(options) &&
        !isNil(options.relations) &&
        options.relations.includes('cities')
      ) {
        return mockProvinceListWithCity;
      } else {
        return mockProvinceList;
      }
    }),
  };

  const mockCompanyTableService = {
    update: jest.fn((companyId, data: UpdateCompanyDto) => {
      return Object.assign(mockCompanyData, data);
    }),
    findOne: jest.fn(() => {
      const data = mockCompanyData;

      delete data.cityId;
      delete data.provinceId;
      delete data.LogoId;

      return data;
    }),
  };
  beforeEach(async () => {
    const { unit } = TestBed.create(CompanyService)
      .mock(ProvinceTableService)
      .using(mockProvinceServiceTable)
      .mock(CompanyTableService)
      .using(mockCompanyTableService)
      .compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return provinces with city list as array', async () => {
    const expectedRes = [
      {
        id: expect.any(Number),
        provinceName: expect.any(String),
        phoneCode: expect.any(String),
        cities: [
          {
            id: expect.any(Number),
            cityName: expect.any(String),
          },
        ],
      },
    ];
    const data: ProvinceResultDtoFormat[] = await service.getProvinces();
    expect(mockProvinceServiceTable.find).toBeCalled();
    expect(data).toEqual(expectedRes);
  });

  it('should be return provinces with out city list as array', async () => {
    const expectedRes = [
      {
        id: expect.any(Number),
        provinceName: expect.any(String),
        phoneCode: expect.any(String),
        cities: null,
      },
    ];
    const data: ProvinceResultDtoFormat[] = await service.getSubPhones();
    expect(mockProvinceServiceTable.find).toBeCalled();
    expect(data).toEqual(expectedRes);
  });

  it('should be update phone number and return company data', async () => {
    const updatePhoneNumber: CompanyUpdatePhoneNumberDto = {
      phoneNumber: '0253-6694785',
    };
    const data = await service.updatePhoneNumber(
      mockCompanyData.id,
      updatePhoneNumber,
    );

    expect(mockCompanyTableService.update).toBeCalled();
    expect(mockCompanyTableService.findOne).toBeCalled();
    expect(data).toEqual(ExpectedFormat);
  });

  it('should be return exception if invalid data for update phone number', async () => {
    const updatePhoneNumber = {
      phoneNumber: '0256694785',
    };

    const validateObject: CompanyUpdatePhoneNumberDto = plainToInstance(
      CompanyUpdatePhoneNumberDto,
      updatePhoneNumber,
    );

    const errors = await validate(validateObject);

    expect(errors.length).not.toBe(0);
    expect(JSON.stringify(errors)).toContain(
      'phoneNumber must match ^\\\\d{3}-\\\\d{8}$ regular expression',
    );
  });

  it('should be update address(postalCode,address,province,city) and return company data', async () => {
    const updateAddressDto: CompanyUpdateAddressDto = {
      companyPostalCode: '123456789',
      companyAddress: 'qom,test,test',
      provinceId: 145,
      cityId: 25,
    };

    const data = await service.updateAddress(
      mockCompanyData.id,
      updateAddressDto,
    );

    expect(mockCompanyTableService.update).toBeCalled();
    expect(mockCompanyTableService.findOne).toBeCalled();
    expect(data).toEqual(ExpectedFormat);
  });

  it('should be return exception if invalid data for update address', async () => {
    const updateAddressDto = {
      companyPostalCode: 123456789,
      companyAddress: 123,
      provinceId: 'asdasd',
      cityId: 'asdasd',
    };

    const validateObject: CompanyUpdateAddressDto = plainToInstance(
      CompanyUpdateAddressDto,
      updateAddressDto,
    );
    const errors = await validate(validateObject);

    expect(errors.length).toBe(4);
  });
});
