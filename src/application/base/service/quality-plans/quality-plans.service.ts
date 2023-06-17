import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QualityPlans } from 'src/infrastructure/database/entities/views/quality-plans';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

// This is a view 
@Injectable()
export class QualityPlansService {

    constructor(
        @InjectRepository(QualityPlans)
        private readonly repository: Repository<QualityPlans>,
      ) {}
    
      // Find One Item by its ID
      async findById(id: number): Promise<QualityPlans> {
        const serviceType = await this.repository.findOne({ where: { ID: id } });
        return serviceType;
      }
    
      // Find Items using search criteria
      async find(options?: FindManyOptions): Promise<QualityPlans[]> {
        const result = await this.repository.find(options);
        return result;
      }
    
   
      // Count the items
      async count(options?: FindManyOptions): Promise<number> {
        const result = await this.repository.count(options);
        return result;
      }
    
      // Find one item
      async findOne(options?: FindOneOptions): Promise<QualityPlans> {
        const result = await this.repository.findOne(options);
        return result;
      }
    


}
