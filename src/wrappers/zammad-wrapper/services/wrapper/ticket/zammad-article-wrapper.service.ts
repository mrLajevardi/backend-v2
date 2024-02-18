import { Injectable } from '@nestjs/common';
import { WrapperService } from '../../../../wrapper.service';
import { WrappersEnum } from '../../../../enum/wrappers.enum';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetTicketArticlesDto } from './dto/get-ticket-articles.dto';
import { ZAMMAD_API_VERSION } from '../../../const/zammad-version.const';
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ZammadArticleWrapperService {
  constructor(private readonly wrapperService: WrapperService) {}

  async createArticle(dto: CreateArticleDto, authToken: string): Promise<void> {
    await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setBody<CreateArticleDto>(dto)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .setMethod('POST')
      .setUrl(`/api/${ZAMMAD_API_VERSION}/ticket_articles`)
      .build()
      .request();
  }
  async getArticle(
    ticketId: number,
    authToken: string,
  ): Promise<GetTicketArticlesDto[]> {
    const result = await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setMethod('GET')
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .setUrl(
        `/api/${ZAMMAD_API_VERSION}/ticket_articles/by_ticket/${ticketId}`,
      )
      .build()
      .request<GetTicketArticlesDto[]>();
    return result.data;
  }

  async updateArticle(
    authToken: string,
    ticketId: number,
    dto: UpdateArticleDto,
  ): Promise<void> {
    await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setBody<UpdateArticleDto>(dto)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .setMethod('PUT')
      .setUrl(`/api/${ZAMMAD_API_VERSION}/ticket_articles/${ticketId}`)
      .build()
      .request();
  }

  async getAttachment(
    authToken: string,
    ticketId: number,
    articleId: number,
    attachmentId: number,
  ): Promise<any> {
    const result = await this.wrapperService
      .getBuilder(WrappersEnum.Zammad)
      .setHeaders<RawAxiosRequestHeaders>({
        Authorization: authToken,
      })
      .setMethod('GET')
      .setUrl(
        `/api/${ZAMMAD_API_VERSION}/ticket_attachment/${ticketId}/${articleId}/${attachmentId}`,
      )
      // .setParams({ view: 'preview' })
      .setAdditionalConfigs<AxiosRequestConfig>({ responseType: 'arraybuffer'})
      .build()
      .request<any>();
    return result.data;
  }
}
