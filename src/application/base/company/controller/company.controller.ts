import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { CompanyService } from '../service/company.service';
import { CompanyResultDto } from '../dto/company.result.dto';
import { CompanyUpdatePhoneNumberDto } from '../dto/company-update-phone-number.dto';
import { CompanyUpdateAddressDto } from '../dto/company-update-address.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckPolicies } from '../../../base/security/ability/decorators/check-policies.decorator';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from '../../../base/security/ability/interfaces/policy-handler.interface';
import { AclSubjectsEnum } from '../../../base/security/ability/enum/acl-subjects.enum';
import { Action } from '../../../base/security/ability/enum/action.enum';

@ApiTags('Company')
@Controller('company')
// @CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
//   ability.can(Action.Manage, subject(AclSubjectsEnum.Company, props)),
// )
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/provinces')
  @ApiOperation({ summary: 'get all province with cities' })
  async getProvinces(@Request() options: SessionRequest) {
    return this.companyService.getProvinces();
  }

  @Get('/subPhones')
  @ApiOperation({ summary: 'get all province sub-phone' })
  async getSubPhones(@Request() options: SessionRequest) {
    return this.companyService.getSubPhones();
  }

  @Post('/updatePhoneNumber/:companyId')
  @ApiParam({
    name: 'companyId',
    type: String,
    description: 'companyId about a specify company',
  })
  @ApiOperation({ summary: 'update company phone number' })
  async updatePhoneNumber(
    @Param('companyId') companyId: number,
    @Request() options: SessionRequest,
    @Body() data: CompanyUpdatePhoneNumberDto,
  ) {
    const updatedCompany = await this.companyService.updatePhoneNumber(
      companyId,
      data,
    );

    return new CompanyResultDto().toArray(updatedCompany);
  }
  @Post('/updateAddress/:companyId')
  @ApiParam({
    name: 'companyId',
    type: String,
    description: 'companyId about a specify company',
  })
  @ApiOperation({
    summary: 'update company address , postal code , province , city',
  })
  async updateAddress(
    @Param('companyId') companyId: number,
    @Request() options: SessionRequest,
    @Body() data: CompanyUpdateAddressDto,
  ) {
    const updatedCompany = await this.companyService.updateAddress(
      companyId,
      data,
    );

    return new CompanyResultDto().toArray(updatedCompany);
  }

  @Post('/uploadLogo/:companyId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({
    name: 'companyId',
    type: String,
    description: 'companyId about a specify company',
  })
  @ApiOperation({ summary: 'upload logo for company' })
  async uploadLogo(
    @Param('companyId') companyId: number,
    @Request() options: SessionRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.companyService.uploadLogo(options, companyId, file);

    return data;
  }
}
