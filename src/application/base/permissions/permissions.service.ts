import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from 'src/infrastructure/database/entities/Permissions';
import { CreatePermissionsDto } from 'src/infrastructure/dto/create/create-permissions.dto';
import { UpdatePermissionsDto } from 'src/infrastructure/dto/update/update-permissions.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permissions)
        private readonly repository : Repository<Permissions>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<Permissions> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<Permissions[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<Permissions>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreatePermissionsDto){
        const newItem = plainToClass(Permissions, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdatePermissionsDto){
        const item = await this.findById(id);
        const updateItem : Partial<Permissions> = Object.assign(item,dto);
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
