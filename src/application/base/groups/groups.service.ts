import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from 'src/infrastructure/database/entities/Groups';
import { CreateGroupsDto } from 'src/infrastructure/dto/create/create-groups.dto';
import { UpdateGroupsDto } from 'src/infrastructure/dto/update/update-groups.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Groups)
        private readonly repository : Repository<Groups>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<Groups> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<Groups[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<Groups>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateGroupsDto){
        const newItem = plainToClass(Groups, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateGroupsDto){
        const item = await this.findById(id);
        const updateItem : Partial<Groups> = Object.assign(item,dto);
        await this.repository.save(updateItem);
    }

    // delete an Item
    async delete(id : string){
        await this.repository.delete(id);
    }

    // delete all items 
    async deleteAll(){
        await this.repository.delete({});
    }
}
