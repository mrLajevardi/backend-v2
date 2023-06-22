import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/infrastructure/database/entities/Plans';
import { Repository } from 'typeorm';

@Injectable()
export class PlansQueryService {
    constructor(
        @InjectRepository(Plans)
        private readonly repository: Repository<Plans>,
        ) {}
        
  // Moved from Invoice->checkPlanCondition
  async serviceInstanceExe(sql: string): Promise<any> {
    const result = await this.repository.query(sql);
  }
    
}
