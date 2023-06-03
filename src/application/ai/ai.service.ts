import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { invalidToken } from 'src/infrastructure/exceptions/invalid-token.exception';
import { UserService } from '../base/user/user.service';

@Injectable()
export class AiService {

    constructor(private readonly userService: UserService){} 

    async verifyToken(token: string){
        const JWT_SECRET_KEY = require('src/infrastructure/config/aradAIConfig.js').JWT_SECRET_KEY;
        const jwt = require('jsonwebtoken');
        return await jwt.verify(token, JWT_SECRET_KEY);
    }

    async checkAIToken(token : string)  {
        const verified = await this.verifyToken(token).then((res) => {
          return res;
        }).catch((err) => {
          throw new invalidToken(err); 
        });

        if (!verified) {
          throw new invalidToken();
        }

        const userId = verified.userId;
        const user = await this.userService.findById(userId);
      
        const expireDate = new Date(verified.expireDate);
        const currentDate = new Date();
        if (expireDate < currentDate) {
          throw new invalidToken();
        }
      
        // const ServiceProperties = await app.models.ServiceProperties.findOne({
        //   where:
        //   {
        //     and: [
        //       {Value: {like: '%'+token+'%'}},
        //       {PropertyKey: {like: '%aradAi%'}},
        //     ],
        //   },
        // });
        // if (isEmpty(ServiceProperties)) {
        //   return cb(new HttpExceptions().invalidToken(), null);
        // }
      
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