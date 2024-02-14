import { Injectable } from '@nestjs/common';
import { WrapperService } from '../../../../wrapper.service';
import { WrappersEnum } from '../../../../enum/wrappers.enum';
import { CreateUserResultDto } from './dto/create-user-result.dto';
import { SearchUserDto, SearchUserQueryParams } from './dto/search-user.dto';
import { RawAxiosRequestHeaders } from 'axios';
import { ZAMMAD_API_VERSION } from '../../../const/zammad-version.const';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class ZammadUserWrapperService {
  constructor(private readonly wrapperService: WrapperService) {}
  async createUser(dto: CreateUserDto): Promise<void> {
    await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setBody<CreateUserDto>(dto)
      .setUrl(`/api/${ZAMMAD_API_VERSION}/users`)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: `Token token=${process.env.ZAMMAD_ADMIN_TOKEN}`,
      })
      .setMethod('POST')
      .build()
      .request<CreateUserResultDto>();
  }

  async searchUser(login: string): Promise<SearchUserDto[]> {
    const result = await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setMethod('GET')
      .setUrl(`/api/${ZAMMAD_API_VERSION}/users/search`)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: `Token token=${process.env.ZAMMAD_ADMIN_TOKEN}`,
      })
      .setParams<SearchUserQueryParams>({
        limit: 1,
        query: `login:${login}`,
      })
      .build()
      .request<SearchUserDto[]>();
    return result.data;
  }
}
