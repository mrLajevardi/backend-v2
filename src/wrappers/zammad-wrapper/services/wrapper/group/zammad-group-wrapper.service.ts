import { Injectable } from '@nestjs/common';
import { WrapperService } from '../../../../wrapper.service';
import { WrappersEnum } from '../../../../enum/wrappers.enum';
import { ZAMMAD_API_VERSION } from '../../../const/zammad-version.const';
import { RawAxiosRequestHeaders } from 'axios';
import { ShowGroupsDto } from './dto/get-groups.dto';

@Injectable()
export class ZammadGroupWrapperService {
  constructor(private readonly wrapperService: WrapperService) {}

  async getGroups(authToken: string): Promise<ShowGroupsDto[]> {
    const result = await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setUrl(`/api/${ZAMMAD_API_VERSION}/groups`)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .setMethod('GET')
      .build()
      .request<ShowGroupsDto[]>();
    return result.data;
  }
}
