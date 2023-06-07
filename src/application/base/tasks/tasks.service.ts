import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from 'src/infrastructure/database/entities/Tasks';
import { CreateTaskDto } from 'src/application/base/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/application/base/tasks/dto/update-task.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks)
        private readonly repository : Repository<Tasks>
    ){}

    // Find One Item by its ID 
    async findById(id : string) : Promise<Tasks> {
        const serviceType = await this.repository.findOne({
            where: {
                taskId: id
            }
        })
        return serviceType;
    }

    
    // Find Items using search criteria 
    async find(options?: FindManyOptions) : Promise<Tasks[]>{
        const result = await this.repository.find(options);
        return result;
    }
    
    // Find one item 
    async findOne(options?: FindOneOptions) : Promise<Tasks>{
        const result = await this.repository.findOne(options);
        return result;
    }


    // Create an Item using createDTO 
    async create(dto : CreateTaskDto){
        const newItem = plainToClass(Tasks, dto);
        let createdItem = this.repository.create(newItem);
        await this.repository.save(createdItem)
    }

    // Update an Item using updateDTO
    async update(id : string, dto : UpdateTaskDto){
        const item = await this.findById(id);
        const updateItem : Partial<Tasks> = Object.assign(item,dto);
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
