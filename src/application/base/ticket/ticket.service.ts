import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketService {

    // module.exports.closeTicket = async function(
    //     app,
    //     options,
    //     ticketId,
    // ) {
    //   const userId = options.accessToken.userId;
    //   const user= await app.models.Users.findById(userId);
    //   const ticketExists = await app.models.Tickets.findOne({
    //     where: {
    //       and: [
    //         {UserID: userId},
    //         {TicketID: ticketId},
    //       ],
    //     },
    //   });
    //   if (! ticketExists) {
    //     return Promise.reject(new HttpExceptions().forbidden());
    //   }
    //   // update status to 3
    //   console.log(ticketId, '💀💀💀');
    //   const ticket = await updateTicket('status', 5, ticketId);
    //   return Promise.resolve();
    // };

    // module.exports.createTicket = async function(
    //     app,
    //     options,
    //     data,
    // ) {
    //   const userId = options.accessToken.userId;
    //   const user= await app.models.Users.findById(userId);
    //   const service = await app.models.ServiceInstances.findOne({
    //     where: {
    //       and: [
    //         {UserID: userId},
    //         {ID: data.serviceInstanceId},
    //       ],
    //     },
    //   });
    //   console.log(data);
    //   if (! service || isNil(data.serviceInstanceId)) {
    //     return Promise.reject(new HttpExceptions().forbidden());
    //   }
    //   const message = `${data.message}\nنام سرویس: ${service.Name || ''}, نوع سرویس: ${service.ServiceTypeID}`;
    //   const {ticketId} = await createTicket(
    //       message, 'customer', null, data.name, data.subject, user.username,
    //   );
    //   console.log('🐉🐉🐉');
    //   await app.models.Tickets.create({
    //     TicketID: ticketId,
    //     UserID: userId,
    //     ServiceInstanceID: data.serviceInstanceId,
    //   });
    //   return Promise.resolve(ticketId);
    // };

    // module.exports.getAllTickets = async function(
    //     app,
    //     options,
    // ) {
    //   const userId = options.accessToken.userId;
    //   const user = await app.models.Users.findById(userId);
    //   try {
    //     const tickets = await getListOfTickets({
    //       actAsEmail: user.username,
    //       actAsType: 'customer',
    //     });
    //     return Promise.resolve(tickets);
    //   } catch (error) {
    //     if (error.statusCode === 404) {
    //       return {
    //         tickets: [],
    //         pagination: {},
    //       };
    //     }
    //     return Promise.reject(error);
    //   }
    // };

    // module.exports.getTicket = async function(
    //     app,
    //     options,
    //     ticketId,
    // ) {
    //   const userId = options.accessToken.userId;
    //   const user = await app.models.Users.findById(userId);
    //   const ticketExists = await app.models.Tickets.findOne({
    //     where: {
    //       and: [
    //         {UserID: userId},
    //         {TicketID: ticketId},
    //       ],
    //     },
    //   });
    //   if (! ticketExists) {
    //     return Promise.reject(new HttpExceptions().forbidden());
    //   }
    //   const ticket = await getTicket(ticketId);
    //   return Promise.resolve(ticket);
    // };



}
