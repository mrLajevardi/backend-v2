import { HttpStatus, Injectable } from '@nestjs/common';
import { UserTableService } from '../crud/user-table/user-table.service';
import { TicketsTableService } from '../crud/tickets-table/tickets-table.service';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ServiceInstancesTableService } from '../crud/service-instances-table/service-instances-table.service';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ZammadTicketWrapperService } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/zammad-ticket-wrapper.service';
import { ZammadUserWrapperService } from '../../../wrappers/zammad-wrapper/services/wrapper/user/zammad-users-wrapper.service';
import { ZammadRolesEnum } from '../../../wrappers/zammad-wrapper/services/wrapper/user/enum/zammad-roles.enum';
import { User } from '../../../infrastructure/database/entities/User';
import { encodePassword } from '../../../wrappers/zammad-wrapper/services/helper/encode-password.helper';
import { ZammadArticleTypeEnum } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/enum/zammad-article-type.enum';
import { ZammadTicketStatesEnum } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/enum/zammad-ticket-states.enum';
import { TicketTopics } from '../crud/tickets-table/enum/ticket-topics.enum';
import { TicketTopicType } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/type/ticket-topic.type';
import { ArticleReactionEnum } from './enum/article-reaction.enum';
import { ArticleReactionDto } from './dto/article-rection.dto';
import { ArticleListDto } from './dto/article-list.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { GetTicketArticlesDto } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/dto/get-ticket-articles.dto';
import { ArticleGetDto } from './dto/article-get.dto';

@Injectable()
export class TicketService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly ticketTable: TicketsTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly zammadTicketService: ZammadTicketWrapperService,
    private readonly zammadUserService: ZammadUserWrapperService,
  ) {}
  async closeTicket(options: SessionRequest, ticketId: number): Promise<void> {
    const userId = options.user.userId;
    const authToken = encodePassword(options.user.guid);
    const ticketExists = await this.ticketTable.findOne({
      where: {
        userId: userId,
        ticketId: ticketId,
      },
    });
    if (!ticketExists) {
      return Promise.reject(new ForbiddenException());
    }
    await this.zammadTicketService.updateTicket(
      ticketId,
      {
        state: ZammadTicketStatesEnum.Close,
      },
      authToken,
    );
    return Promise.resolve();
  }

  async createTicket(
    options: SessionRequest,
    data: CreateTicketDto,
  ): Promise<{ ticketId: number }> {
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    const authToken = encodePassword(user.guid);
    const service = await this.serviceInstancesTable.findOne({
      where: {
        userId: userId,
        id: data.serviceInstanceId,
      },
    });
    if (!service && data.serviceInstanceId) {
      throw new ForbiddenException();
    }
    const ticket = await this.zammadTicketService.createTicket(
      {
        topic: this.convertTopicEnumToKey(data.topic),
        title: data.subject,
        group: data.group,
      },
      authToken,
    );
    console.log('zammad ticket created');
    await this.zammadTicketService.articleService.createArticle(
      {
        body: data.message,
        ticket_id: ticket.id,
        type: ZammadArticleTypeEnum.Note,
        attachments: data.attachments,
      },
      authToken,
    );
    console.log('zammad article created');
    const createdTicket = await this.ticketTable.create({
      ticketId: ticket.id,
      userId: userId,
      serviceInstanceId: data.serviceInstanceId ?? null,
      topic: data.topic,
    });
    await this.zammadTicketService.updateTicket(
      ticket.id,
      {
        ticket_code: createdTicket.code,
      },
      authToken,
    );
    console.log('zammad article updated');
    return Promise.resolve({ ticketId: ticket.id });
  }

  async getAllTickets(options: SessionRequest): Promise<any[]> {
    const authToken = encodePassword(options.user.guid);
    const user = await this.userTable.findById(options.user.userId);
    const zammadUser = await this.zammadUserService.searchUser(user.guid);
    if (zammadUser.length === 0) {
      await this.createTicketingUser(user);
      console.log('zammad user created');
    }
    const tickets = await this.zammadTicketService.getAllTickets(authToken);
    const states =
      await this.zammadTicketService.statesService.getAllTicketStates(
        authToken,
      );
    const extendedTickets = tickets.map((ticket) => {
      const state = states.find(
        (targeState) => targeState.id === ticket.state_id,
      );
      return {
        ...ticket,
        topic: TicketTopics[ticket.topic],
        state: state.name,
      };
    });
    return extendedTickets;
  }

  async getTicket(options: SessionRequest, ticketId: number): Promise<any> {
    const listTicket = (await this.getAllTickets(options)).find(
      (ticket) => ticket.id == ticketId,
    );

    const authToken = encodePassword(options.user.guid);
    let articles: GetTicketArticlesDto[];
    try {
      articles = await this.zammadTicketService.articleService.getArticle(
        ticketId,
        authToken,
      );
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        throw new ForbiddenException();
      }
    }
    const extendedTicket = articles.map((article) => {
      let reaction: ArticleReactionEnum;
      if (article.preferences?.highlight?.includes('Pink')) {
        reaction = ArticleReactionEnum.Dislike;
      } else if (article.preferences?.highlight?.includes('Green')) {
        reaction = ArticleReactionEnum.Like;
      } else {
        reaction = null;
      }
      return {
        ...article,
        reaction,
      };
    });

    const res: ArticleGetDto = {};
    res.articles = extendedTicket;
    res.topic = listTicket.topic;
    res.ticket_code = listTicket.ticket_code;
    res.state = listTicket.state;
    // const ff = extendedTicket as ArticleListDto[];
    return res;
  }

  async replyToTicket(
    options: SessionRequest,
    data: ReplyTicketDto,
    ticketId: number,
  ): Promise<void> {
    const authToken = encodePassword(options.user.guid);
    await this.zammadTicketService.articleService.createArticle(
      {
        body: data.message,
        ticket_id: ticketId,
        type: ZammadArticleTypeEnum.Note,
        attachments: data.attachments,
      },
      authToken,
    );
  }

  async articleReaction(
    dto: ArticleReactionDto,
    ticketId: number,
    options: SessionRequest,
  ): Promise<void> {
    const articles = await this.getTicket(options, ticketId);
    const article = articles.find((article) => article.id === dto.articleId);
    if (!article) {
      throw new ForbiddenException();
    }
    const reaction =
      dto.reaction === ArticleReactionEnum.Like ? 'Green' : 'Pink';
    const highlight = `type:TextRange|0$${article.body.length}$1$highlight-${reaction}$article-content-${dto.articleId}`;
    await this.zammadTicketService.articleService.updateArticle(
      `Token token=${process.env.ZAMMAD_ADMIN_TOKEN}`,
      dto.articleId,
      {
        preferences: {
          highlight,
        },
      },
    );
  }

  async getAttachment(
    options: SessionRequest,
    ticketId: number,
    articleId: number,
    attachmentId: number,
  ): Promise<Buffer> {
    const authToken = encodePassword(options.user.guid);
    return await this.zammadTicketService.articleService.getAttachment(
      authToken,
      ticketId,
      articleId,
      attachmentId,
    );
  }
  private async createTicketingUser(user: User): Promise<void> {
    await this.zammadUserService.createUser({
      email: user.email,
      firstname: user.name,
      lastname: user.family,
      login: user.guid,
      organization: null,
      password: process.env.ZAMMAD_USER_PASSWORD,
      roles: [ZammadRolesEnum.Customer],
    });
  }

  private convertTopicEnumToKey(topic: TicketTopics): TicketTopicType {
    if (topic === TicketTopics.Ai) {
      return 'Ai';
    } else if (topic === TicketTopics.Vdc) {
      return 'Vdc';
    }
  }
}
