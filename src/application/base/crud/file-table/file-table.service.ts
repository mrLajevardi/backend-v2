import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Files } from '../../../../infrastructure/database/entities/Files';

@Injectable()
export class FileTableService {
  constructor(
    @InjectRepository(Files)
    private readonly repository: Repository<Files>,
  ) {}

  async findByStreamId(streamId: string): Promise<Files | null> {
    return await this.repository.findOne({ where: { guid: streamId } });
  }

  async findByGuid(guid: string): Promise<Files | null> {
    return await this.repository.findOne({ where: { guid: guid } });
  }

  async find(options?: FindManyOptions<Files>): Promise<Files[]> {
    return await this.repository.find(options);
  }

  async delete(guid: string): Promise<DeleteResult> {
    const where: FindOptionsWhere<Files> = {
      guid: guid,
    };

    return await this.repository.delete(where);
  }
}
