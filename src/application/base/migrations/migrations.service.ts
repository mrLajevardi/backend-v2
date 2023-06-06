import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Migrations } from 'src/infrastructure/database/entities/Migrations';
import { CreateMigrationsDto } from 'src/infrastructure/dto/create/create-migrations.dto';
import { UpdateMigrationsDto } from 'src/infrastructure/dto/update/update-migrations.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MigrationsService {
    constructor(
        @InjectRepository(Migrations)
        private readonly repository : Repository<Migrations>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<Migrations> {
        const serviceType = await this.repository.findOne({ where: { id: id}})
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<Migrations[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<Migrations>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateMigrationsDto){
        const newItem = plainToClass(Migrations, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateMigrationsDto){
        const item = await this.findById(id);
        const updateItem : Partial<Migrations> = Object.assign(item,dto);
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
