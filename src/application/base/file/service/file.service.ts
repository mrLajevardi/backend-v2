import { Injectable } from '@nestjs/common';
import { FileTableService } from '../../crud/file-table/file-table.service';
import { isNil } from 'lodash';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@Injectable()
export class FileService {
  constructor(private readonly fileTableService: FileTableService) {}

  async getFileContent(guid: string) {
    const data = await this.fileTableService.findByGuid(guid);
    if (isNil(data)) {
      throw ApiNotFoundResponse();
    }

    return data;
  }

  async deleteFile(guid: string): Promise<DeleteResult> {
    const file = await this.fileTableService.delete(guid);

    return file;
  }
}
