import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from 'passport-headerapikey';
import { CreateUserDto } from '../crud/user-table/dto/create-user.dto';
import { UpdateUserDto } from '../crud/user-table/dto/update-user.dto';
import { plainToClass } from 'class-transformer';
import { UserTableService } from '../crud/user-table/user-table.service';

@Injectable()
export class UserService {
  constructor(private readonly userTable: UserTableService) {}

  // find user by phone number
  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return await this.userTable.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }

  // convery string to password hash
  async getPasswordHash(string: string): Promise<string> {
    if (!string) {
      throw new BadRequestError('bad parameters');
    }
    return await bcrypt.hash(string, 10);
  }

  // compare two passwordes
  async comparePassword(hashed: string, plain: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }

  async checkUserCredit(costs, userId, options, serviceType) {
    try {
      const user = await this.userTable.findById(userId);
      const userCredit = user.credit;
      console.log(costs);
      if (userCredit >= costs) {
        const updatedCredit = userCredit - costs;
        // Implement
        /** Should be implemented  */
        throw new InternalServerErrorException(
          'complete the code and remove comments ',
        );
        // const updateResult = await this.repository.updateAll({id: userId}, {credit: updatedCredit});
        //MUST BE IMPLEMENTED

        // ******

        if (options && serviceType && updatedCredit) {
          //only for lint
        }
        // await logger.info(
        //     'services',
        //     'buyService',
        //     {
        //       costs,
        //       serviceType,
        //       _object: userId,
        //     },
        //     {...options.locals},
        // );
        // if (updateResult.count < 1) {
        //   return Promise.reject(new Error('not updated'));
        // }
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
