import { Tickets } from '../../../infrastructure/database/entities/Tickets';
import { User } from '../../../infrastructure/database/entities/User';
import { ForbiddenException } from '../../../infrastructure/exceptions/forbidden.exception';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { ZammadTicketWrapperService } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/zammad-ticket-wrapper.service';
import { SearchUserDto } from '../../../wrappers/zammad-wrapper/services/wrapper/user/dto/search-user.dto';
import { ZammadGroupsEnum } from '../../../wrappers/zammad-wrapper/services/wrapper/user/enum/zammad-groups.enum';
import { ZammadUserWrapperService } from '../../../wrappers/zammad-wrapper/services/wrapper/user/zammad-users-wrapper.service';
import { ServiceInstancesTableService } from '../crud/service-instances-table/service-instances-table.service';
import { TicketTopics } from '../crud/tickets-table/enum/ticket-topics.enum';
import { TicketsTableService } from '../crud/tickets-table/tickets-table.service';
import { UserTableService } from '../crud/user-table/user-table.service';
import { TicketService } from './ticket.service';
import { TestBed } from '@automock/jest';

describe('TicketService', () => {
  let service: TicketService;
  let ticketTableService: TicketsTableService;
  let zammadTicketService: ZammadTicketWrapperService;
  let zammadUserService: ZammadUserWrapperService;
  let serviceInstanceTableService: ServiceInstancesTableService;
  let userTableService: UserTableService;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(TicketService).compile();
    ticketTableService = unitRef.get(TicketsTableService);
    zammadTicketService = unitRef.get(ZammadTicketWrapperService);
    serviceInstanceTableService = unitRef.get(ServiceInstancesTableService);
    userTableService = unitRef.get(UserTableService);
    zammadUserService = unitRef.get(ZammadUserWrapperService);
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('closeTicket', () => {
    it('should throw forbidden exception if ticket not exist', async () => {
      jest
        .spyOn(ticketTableService, 'findOne')
        .mockImplementation(async () => null);
      jest
          .spyOn(userTableService, 'findById')
          .mockImplementation(async (): Promise<User> => {
            return {
              guid: 'guid',
            } as User;
          });
      const options: SessionRequest = {
        user: {
          guid: 'guid',
          userId: 1,
        },
      } as SessionRequest;
      const ticketId = 1;
      const testFunction = async (): Promise<any> => {
        await service.closeTicket(options, ticketId);
      };
      await expect(testFunction).rejects.toThrow(ForbiddenException);
    });

    it('should call zammadTicketWrapperService updateTicket method', async () => {
      const ticket: Tickets = {
        code: 1,
        id: 1,
        serviceInstance: null,
        serviceInstanceId: null,
        ticketId: 1,
        topic: TicketTopics.Vdc,
        userId: 1,
      };
      jest
        .spyOn(ticketTableService, 'findOne')
        .mockImplementation(async (): Promise<Tickets> => {
          return ticket;
        });
      jest
          .spyOn(userTableService, 'findById')
          .mockImplementation(async (): Promise<User> => {
            return {
              guid: 'guid',
            } as User;
          });
      const updateTicket = jest
        .spyOn(zammadTicketService, 'updateTicket')
        .mockImplementation(async () => {
          return;
        });
      const options: SessionRequest = {
        user: {
          guid: 'guid',
          userId: 1,
        },
      } as SessionRequest;
      const ticketId = 1;
      await service.closeTicket(options, ticketId);
      expect(updateTicket).toHaveBeenCalled();
    });
  });

  describe('createTicket', () => {
    it('should throw forbidden exception if serviceInstanceId is wrong', async () => {
      jest
        .spyOn(ticketTableService, 'create')
        .mockImplementation(async () => null);
      jest
        .spyOn(userTableService, 'findById')
        .mockImplementation(async (): Promise<User> => {
          return {
            guid: 'guid',
          } as User;
        });
      jest
        .spyOn(serviceInstanceTableService, 'create')
        .mockImplementation(async () => null);
      const options: SessionRequest = {
        user: {
          guid: 'guid',
          userId: 1,
        },
      } as SessionRequest;
      const testFunction = async (): Promise<any> => {
        await service.createTicket(options, {
          group: ZammadGroupsEnum.FinancialUser,
          message: 'd',
          subject: 'z',
          topic: TicketTopics.Vdc,
          serviceInstanceId: 'd',
        });
      };
      await expect(testFunction).rejects.toThrow(ForbiddenException);
    });

    // it('should call zammad create user if user not exists in zammad', async () => {
    //   jest
    //     .spyOn(ticketTableService, 'create')
    //     .mockImplementation(async () => null);
    //   jest
    //     .spyOn(userTableService, 'findById')
    //     .mockImplementation(async (): Promise<User> => {
    //       return {
    //         guid: '',
    //         email: '',
    //         name: '',
    //         family: '',
    //       } as User;
    //     });
    //   jest
    //     .spyOn(serviceInstanceTableService, 'create')
    //     .mockImplementation(async () => null);
    //   jest
    //     .spyOn(zammadUserService, 'searchUser')
    //     .mockImplementation(async () => [{}] as SearchUserDto[]);
    //   const createUser = jest
    //     .spyOn(zammadUserService, 'createUser')
    //     .mockImplementation(async () => {
    //       return {
    //         id: 2,
    //       };
    //     });
    //   const options: SessionRequest = {
    //     user: {
    //       guid: 'guid',
    //       userId: 1,
    //     },
    //   } as SessionRequest;
    //   await service.createTicket(options, {
    //     group: ZammadGroupsEnum.FinancialUser,
    //     message: 'd',
    //     subject: 'z',
    //     topic: TicketTopics.Vdc,
    //   });
    //   expect(createUser).toBeCalled();
    // });
  });
});
