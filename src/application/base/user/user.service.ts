import { Injectable } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from 'passport-headerapikey';
import { CreateUserDto } from 'src/infrastructure/dto/create/create-user.dto';
import { UpdateUserDto } from 'src/infrastructure/dto/update/update-user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {}



    // Find One Item by its ID 
    async findById(id : number) : Promise<User> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<User[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<User>{
        const result = await this.repository.findOne(options);
        return result;
    }

    // Create an Item using createDTO 
    async create(dto : CreateUserDto){
        const newItem = plainToClass(User, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : number, dto : UpdateUserDto){
        const item = await this.findById(id);
        const updateItem : Partial<User> = Object.assign(item,dto);
        await this.repository.save(updateItem);
    }

    // delete an Item
    async delete(id : number){
        await this.repository.delete(id);
    }

    // delete all items 
    async deleteAll(){
        await this.repository.delete({});
    }
    
    // find user by phone number
    async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
        return await this.repository.findOne({ where : { phoneNumber : phoneNumber} })
    }

    // convery string to password hash 
    async getPasswordHash(string: string): Promise<string> {
        if (!string){
            throw new BadRequestError("bad parameters");
        }
        return await bcrypt.hash(string , 10);
    }

    // compare two passwordes 
    async comparePassword(hashed: string, plain: string) : Promise<boolean> {
        return await bcrypt.compare(plain, hashed);
    }

    // change user password 
    async changePassword(id: number, newPassword: string): Promise<User | undefined> {
        const user = await this.findById(id);
        if (user) {
          const hashedPassword = await this.getPasswordHash(newPassword); 
          user.password = hashedPassword;
          return await this.repository.save(user);
        }
        return undefined;
    }

      
}   

