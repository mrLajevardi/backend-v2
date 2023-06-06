import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MigrationsLock } from 'src/infrastructure/database/entities/MigrationsLock';
import { CreateMigrationsLockDto } from 'src/infrastructure/dto/create/create-migrations-lock.dto';
import { UpdateMigrationsLockDto } from 'src/infrastructure/dto/update/update-migrations-lock.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MigrationsLockService {
    constructor(
        @InjectRepository(MigrationsLock)
        private readonly repository : Repository<MigrationsLock>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<MigrationsLock> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<MigrationsLock[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<MigrationsLock>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateMigrationsLockDto){
        const newItem = plainToClass(MigrationsLock, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateMigrationsLockDto){
        const item = await this.findById(id);
        const updateItem : Partial<MigrationsLock> = Object.assign(item,dto);
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
