import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from 'src/infrastructure/database/entities/Permissions';
import { CreatePermissionDto } from 'src/application/base/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from 'src/application/base/permissions/dto/update-permission.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permissions)
        private readonly repository : Repository<Permissions>
    ){}

    // Find One Item by its ID 
    async findById(id : number) : Promise<Permissions> {
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
    async create(dto : CreatePermissionDto){
        const newItem = plainToClass(Permissions, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : number, dto : UpdatePermissionDto){
        const item = await this.findById(id);
        const updateItem : Partial<Permissions> = Object.assign(item,dto);
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
