import { Injectable } from '@nestjs/common';
import { FileTableService } from '../../crud/file-table/file-table.service';
import { isNil } from 'lodash';
import { ApiNotFoundResponse } from '@nestjs/swagger';

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
}
