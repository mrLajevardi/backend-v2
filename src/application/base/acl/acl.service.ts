import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Acl } from 'src/infrastructure/database/test-entities/Acl';
import { CreateAclDto } from 'src/infrastructure/dto/create/create-acl.dto';
import { UpdateAclDto } from 'src/infrastructure/dto/update/update-acl.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AclService {
    constructor(
        @InjectRepository(Acl)
        private readonly repository : Repository<Acl>
    ){}

    // Find One Item by its ID 
    async findById(id : number) : Promise<Acl> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<Acl[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<Acl>{
        const result = await this.repository.findOne(options);
        return result;
    }

    // Create an Item using createDTO 
    async create(dto : CreateAclDto){
        const newItem = plainToClass(Acl, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : number, dto : UpdateAclDto){
        const item = await this.findById(id);
        const updateItem : Partial<Acl> = Object.assign(item,dto);
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

}
