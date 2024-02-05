import { Injectable } from '@nestjs/common';
import { WrapperService } from '../../../../wrapper.service';
import {
  CreateTicketDto,
  CreateTicketResultDto,
} from './dto/create-ticket.dto';
import { WrappersEnum } from '../../../../enum/wrappers.enum';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { GetAllTicketsDto } from './dto/get-all-tickets.dto';
import { ZAMMAD_API_VERSION } from '../../../const/zammad-version.const';
import { ZammadArticleWrapperService } from './zammad-article-wrapper.service';
import { RawAxiosRequestHeaders } from 'axios';

@Injectable()
export class ZammadTicketWrapperService {
  constructor(
    private readonly wrapperService: WrapperService,
    public readonly articleService: ZammadArticleWrapperService,
  ) {}

  async createTicket(
    dto: CreateTicketDto,
    authToken: string,
  ): Promise<CreateTicketResultDto> {
    const result = await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setUrl(`/api/${ZAMMAD_API_VERSION}/tickets`)
      .setBody<CreateTicketDto>(dto)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .setMethod('post')
      .build()
      .request<CreateTicketResultDto>();
    return result.data;
  }

  async updateTicket(
    ticketId: number,
    dto: UpdateTicketDto,
    authToken: string,
  ): Promise<void> {
    await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setMethod('PUT')
      .setUrl(`/api/${ZAMMAD_API_VERSION}/tickets/${ticketId}`)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .setBody<UpdateTicketDto>(dto)
      .build()
      .request();
  }

  async getAllTickets(authToken: string): Promise<GetAllTicketsDto[]> {
    const result = await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setMethod('GET')
      .setUrl(`/api/${ZAMMAD_API_VERSION}/tickets/`)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .build()
      .request<GetAllTicketsDto[]>();
    return result.data;
  }
}
