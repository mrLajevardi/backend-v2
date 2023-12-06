import { Injectable } from '@nestjs/common';
import { FileTableService } from '../../crud/file-table/file-table.service';
import { isNil } from 'lodash';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@Injectable()
export class FileService {
  constructor(private readonly fileTableService: FileTableService) {}

  async getFileContent(streamId: string) {
    const data = await this.fileTableService.findByStreamId(streamId);
    if (isNil(data)) {
      throw ApiNotFoundResponse();
    }

    return data;
  }

  async deleteFile(streamId: string): Promise<DeleteResult> {
    const file = await this.fileTableService.delete(streamId);

    return file;
  }
}
