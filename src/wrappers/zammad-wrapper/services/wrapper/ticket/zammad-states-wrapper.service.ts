import { Injectable } from '@nestjs/common';
import { WrapperService } from '../../../../wrapper.service';
import { WrappersEnum } from '../../../../enum/wrappers.enum';
import { GetAllStatesDto } from './dto/get-all-states.dto';
import { ZAMMAD_API_VERSION } from '../../../const/zammad-version.const';
import { RawAxiosRequestHeaders } from 'axios';

@Injectable()
export class ZammadStatesWrapperService {
  constructor(private readonly wrapperService: WrapperService) {}

  async getAllTicketStates(authToken: string): Promise<GetAllStatesDto[]> {
    const result = await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setMethod('GET')
      .setUrl(`/api/${ZAMMAD_API_VERSION}/ticket_states`)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .build()
      .request<GetAllStatesDto[]>();
    return result.data;
  }
}
