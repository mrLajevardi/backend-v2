import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { DatabaseErrorException } from 'src/infrastructure/exceptions/database-error.exception';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceInstancesStoredProcedureService {
  constructor(
    @InjectRepository(ServiceInstances)
    private readonly repository: Repository<ServiceInstances>,
  ) {}

  // Exec Sp_CountAradAIUsedEachService
  async spCountAradAiUsedEachService(instanceId: string): Promise<Record<string,number>> {
    const query =
      "EXEC Sp_CountAradAIUsedEachService @ServiceInstanceID='" +
      instanceId +
      "'";
    try {
      const result = await this.repository.query(query);
      return result;
    } catch (err) {
      throw new DatabaseErrorException('sp_count problem', err);
    }
  }
}
