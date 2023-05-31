import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
    async checkAIToken()  {
    //     const verified = await verifyToken(token).then((res) => {
    //       return res;
    //     }).catch((err) => {
    //       return err;
    //     });
    //     if (!verified) {
    //         throw new HttpException({
    //             status: HttpStatus.FORBIDDEN,
    //             error: 'This is a custom message',
    //           }, HttpStatus.FORBIDDEN, {
    //             cause: error
    //           });
    //       return cb(new HttpExceptions().invalidToken(), null);
    //     }
    //     const userId = verified.userId;
    //     const user = await app.models.Users.findById(userId);
      
    //     const expireDate = new Date(verified.expireDate);
    //     const currentDate = new Date();
    //     if (expireDate < currentDate) {
    //       return cb(new HttpExceptions().invalidToken(), null);
    //     }
      
    //     const ServiceProperties = await app.models.ServiceProperties.findOne({
    //       where:
    //       {
    //         and: [
    //           {Value: {like: '%'+token+'%'}},
    //           {PropertyKey: {like: '%aradAi%'}},
    //         ],
    //       },
    //     });
    //     if (isEmpty(ServiceProperties)) {
    //       return cb(new HttpExceptions().invalidToken(), null);
    //     }
      
    //     const serviceInstance = await app.models.ServiceInstances.findOne({
    //       where: {
    //         ID: ServiceProperties.ServiceInstanceID,
    //       },
    //     });
    //     if (isEmpty(verified.costPerRequest) || isEmpty(verified.createdDate) ||
    //     (verified.qualityPlanCode != 'demo'&& (serviceInstance.IsDisabled || serviceInstance.IsDeleted))) {
    //       return cb(new HttpExceptions().invalidToken(), null);
    //     }
    //     const constPerRequest = parseInt(verified.costPerRequest);
      
    //     if (constPerRequest > parseInt(user.credit)) {
    //       const err = new HttpExceptions().notEnoughCredit();
    //       return cb(err, null);
    //     }
    //     if (verified.qualityPlanCode == 'demo') {
    //       // Muximum use per day
    //       const usePerDay = await usedPerDay(app, ServiceProperties.ServiceInstanceID);
    //       if (verified.maxRequestPerDay != 'unlimited' && verified.maxRequestPerDay < usePerDay) {
    //         return cb(new HttpExceptions().invalidUseRequestPerDay(), null);
    //       }
    //       // Muximum use pre month
    //       const usePerMonth = await usedPerMonth(app, ServiceProperties.ServiceInstanceID, verified.createdDate);
    //       if (verified.maxRequestPerMonth != 'unlimited' && verified.maxRequestPerMonth < usePerMonth) {
    //         return cb(new HttpExceptions().invalidUseRequestPerMonth(), null);
    //       }
    //     }
    //     return cb(null, true);
    //   };
    }
}