import { Injectable } from '@nestjs/common';
import { AITransactionsLogsTableService } from './aitransactions-logs-table.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AiTransactionsLogs } from 'src/infrastructure/database/entities/AiTransactionsLogs';
import { Repository } from 'typeorm';

@Injectable()
export class AitransactionsLogsStoredProcedureService {
  constructor(
    @InjectRepository(AiTransactionsLogs)
    private readonly repository: Repository<AiTransactionsLogs>,
  ) {}

  async getChartAIUsed(
    startDate: string,
    endDate: string,
    serviceInstanceId: string,
  ) {
    const query = `EXEC Sp_ChartAIUsed '${startDate}', '${endDate}', '${serviceInstanceId}'`;

    // Execute the query using the appropriate database connector or ORM method
    const result = await this.repository.query(query);

    return result;
  }
}
