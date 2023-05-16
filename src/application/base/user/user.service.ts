import { Injectable } from '@nestjs/common';
import { User } from 'src/infrastructure/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        // @InjectRepository(AccessToken)
        // private readonly accessTokenRepository : Repository<AccessToken>,
    ) {}

    async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
        return await  this.userRepository.findOne({ where : { phoneNumber : phoneNumber} })
    }


    async findOne(where : FindOptionsWhere<User>  ) : Promise<User | undefined> {
        return await this.userRepository.findOne({ where: where});
    }

   
    async findById(id: number): Promise<User | undefined> {
        return await  this.userRepository.findOne({
            where : {
                id: id 
            }
        });
    }

    async getUsers(): Promise<User[] | undefined> {
        return await this.userRepository.find({})
    }

    async getPasswordHash(string: string): Promise<string> {
        return await bcrypt.hash(string , 10);
    }

    async comparePassword(hashed: string, plain: string) : Promise<boolean> {
        return await bcrypt.compare(plain, hashed);
    }

    async create(userData: Partial<User>): Promise<User> {
        userData.password = await this.getPasswordHash(userData.password);
        const user = this.userRepository.create(userData);
        return await  this.userRepository.save(user);
    }
    
    async update(id: number, userData: Partial<User>): Promise<User | undefined> {
        await this.userRepository.update(id, userData);
        return await  this.findById(id);
    }
    
    async delete(id: number): Promise<DeleteResult | undefined> {
        return await this.userRepository.delete(id);
    }

    async changePassword(id: number, newPassword: string): Promise<User | undefined> {
        const user = await this.findById(id);
        if (user) {
          const hashedPassword = await this.getPasswordHash(newPassword); 
          user.password = hashedPassword;
          return await this.userRepository.save(user);
        }
        return undefined;
    }

      
}   

