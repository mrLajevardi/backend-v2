import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FileUpload } from '../../../../infrastructure/database/entities/FileUpload';

@Injectable()
export class FileTableService {
  constructor(
    @InjectRepository(FileUpload)
    private readonly repository: Repository<FileUpload>,
  ) {}

  async findByStreamId(streamId: string): Promise<FileUpload | null> {
    return await this.repository.findOne({ where: { streamId: streamId } });
  }

  async find(options?: FindManyOptions<FileUpload>): Promise<FileUpload[]> {
    return await this.repository.find(options);
  }

  async delete(streamId: string): Promise<DeleteResult> {
    const where: FindOptionsWhere<FileUpload> = {
      streamId: streamId,
    };

    return await this.repository.delete(where);
  }
}
